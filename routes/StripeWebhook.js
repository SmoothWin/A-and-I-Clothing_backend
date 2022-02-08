/* istanbul ignore file */
const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const endpointSecret = process.env.STRIPE_SECRET_WEBHOOK

const bodyParser = require('body-parser');




router.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {

    const sig = request.headers['stripe-signature'];
    // console.log(sig)
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log(err.message)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // console.log(event.type)
    // Handle the event
    switch (event.type) {
      // case 'checkout.session.completed':
      //   const session = event.data.object;
      //   console.log(session.payment_status)
      //   if(session.payment_status == 'paid'){
      //     const sessionObject = await stripe.checkout.sessions.retrieve(session.id,
      //       {
      //           expand: ['line_items']
      //       })
      //     // console.log(sessionObject.metadata) //should store ordered quantities in metadata of the session object
      //     // console.log(sessionObject.line_items.data)//use the price and get the product ID in order to change specific item quantity
      //     //do actions that will store/modify items quantity depending on different sizes.
      //   }
      // // Then define and call a function to handle the event checkout.session.completed
      // break;
      case 'checkout.session.expired':
        const session = event.data.object;
        const products = await stripe.products.list({limit:100,ids:Object.keys(session.metadata)})
        const marketItems = products
        const metadata = session.metadata
        let quantityModified = {}
        marketItems.data.forEach(x=>{
          Object.entries(metadata).forEach(m=>{
              if(m[0] == x.id){
                  Object.entries(JSON.parse(m[1])).forEach(cQty=>{
                      // console.log("Key: "+cQty[0])
                      // console.log("Substract Qty: "+cQty[1])
                      // console.log("Original Qty: "+ x.metadata[cQty[0]])
                      console.log(x.metadata[cQty[0]]+cQty[1])
                      quantityModified[m[0]] = {[cQty[0]]: (parseInt(x.metadata[cQty[0]])+parseInt(cQty[1]))}
                  })
              }
          })
          // console.log(x.metadata)
      })
      console.log(quantityModified)
      Object.entries(quantityModified).forEach(async x=>{
        await stripe.products.update(
            x[0],
            {metadata:x[1]}
        )
      })
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

  module.exports = router
const app = require('../index')

const supertest = require('supertest')
const request = supertest(app)
const fs = require('fs')

const buffer_ok =
  fs.readFileSync(__dirname+'\\bigorders\\upload\\bigorder_ok.csv');

const buffer_no_data = 
  fs.readFileSync(__dirname+'\\bigorders\\upload\\bigorder_no_extra_data.csv');

const buffer_quantity_not_int = 
  fs.readFileSync(__dirname+'\\bigorders\\upload\\bigorder_quantity_not_integer.csv');

describe('/POST /bigorders/upload csv upload', () => {
    it('Submitting .csv file should be successful', async () => {
      const res = await request.post('/bigorders/upload')
      .attach("file", buffer_ok, "bigorder_ok.csv")
      // expect(insertBigOrderSuccess.mock.calls.length).toBe(1)
      expect(res.statusCode).toBe(200)
      // console.log(res.body)
    })
})

describe('/POST /bigorders/upload csv upload Error -> quantity is not a number', () => {
  it('.csv file submission should fail because quantity is not an integer', async () => {
    const res = await request.post('/bigorders/upload')
      .attach("file", buffer_quantity_not_int, "bigorder_quantity_not_integer.csv")

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("Quantity for big orders in the csv needs to be in \"integer\" digits")
      // console.log(res.body)
  })
})

describe('/POST /bigorders/upload csv upload Error -> no file', () => {
  it('.csv file submission should fail because no file was submitted', async () => {
    const res = await request.post('/bigorders/upload')
    .send()
      // console.log(res)
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe("No files were uploaded.")
  })
})

describe('/POST /bigorders/upload csv upload Error -> no data was inserted', () => {
  it('.csv file submission should fail because no order rows were added', async () => {
    const res = await request.post('/bigorders/upload')
      .attach("file", buffer_no_data, "bigorder_no_extra_data.csv")

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe("No orders were attached to the file")
      // console.log(res.body)
  })
})

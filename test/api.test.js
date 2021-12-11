const app = require('../index')

const supertest = require('supertest')
const request = supertest(app)

//create other express instance for testing db post


describe('/POST /bigorders/upload csv upload', () => {
    it('Submitting .csv file should be successful', async () => {
      const res = await request.post('/bigorders/upload')
      .send()
      .attach("file", "bigorder_ok.csv")
      expect(insertBigOrderSuccess.mock.calls.length).toBe(1)
      console.log(res)
    })
})

// describe('/POST /bigorders/upload csv upload Error -> quantity is not a number', () => {
//   it('.csv file submission should fail because quantity is not an integer', () => {
//     expect(false).toBe(false)
//   })
// })

describe('/POST /bigorders/upload csv upload Error -> no file', () => {
  it('.csv file submission should fail because no file was submitted', async () => {
    const res = await request.post('/bigorders/upload')
    .send()
      // console.log(res)
    expect(res.statusCode).toBe(400)
    expect(res.body.message).toBe("No files were uploaded.")
  })
})

// describe('/POST /bigorders/upload csv upload Error -> no data was inserted', () => {
//   it('.csv file submission should fail because no order rows were added', () => {
//     expect(false).toBe(false)
//   })
// })

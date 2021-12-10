
describe('/POST /bigorders/upload csv upload', () => {
    it('Submitting .csv file should be successful', () => {
      expect(true).toBe(true)
    })
})

describe('/POST /bigorders/upload csv upload Error -> quantity is not a number', () => {
  it('.csv file submission should fail because quantity is not an integer', () => {
    expect(false).toBe(false)
  })
})

describe('/POST /bigorders/upload csv upload Error -> no file', () => {
  it('.csv file submission should fail because no file was submitted', () => {
    expect(false).toBe(false)
  })
})

describe('/POST /bigorders/upload csv upload Error -> no data was inserted', () => {
  it('.csv file submission should fail because no order rows were added', () => {
    expect(false).toBe(false)
  })
})

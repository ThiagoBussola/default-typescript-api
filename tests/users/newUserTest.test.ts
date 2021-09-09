import app from '../../app'
import * as request from 'supertest'
import shortid from 'shortid'
import usersDao from '../../users/daos/users.dao'

describe('Task', () => {

})

describe('GET / - a simple api endpoint', () => {
  // clear database after test
  afterEach(async () => {
    await usersDao.User.deleteMany({})
  })

  const firstUserBody = {
    email: `thiagobussola+${shortid.generate()}@hotmail.com`,
    password: 'Sup3rSecret!23'
  }

  it('Hello API Request', async () => {
    const result = await request.default(app).get('/')
    expect(result.text).toEqual('Server running at http://localhost:3000')
    expect(result.statusCode).toEqual(200)
  })

  it('should allow a POST to /users', async function () {
    const res = await request.default(app).post('/users').send(firstUserBody)

    expect(res.status).toEqual(201)
    console.log(res.body)
    expect(res.body._id).toBeDefined()
  })
})

import app from '../../app'
import * as request from 'supertest'
import shortid from 'shortid'
import usersDao from '../../users/daos/users.dao'

describe('GET / - a simple api endpoint', () => {
  // clear database after test
  afterAll(async () => {
    await usersDao.User.deleteMany({})
  })

  let firstUserIdTest = ''
  let refreshToken = ''
  const firstUserBody = {
    email: `thiagobussola+${shortid.generate()}@hotmail.com`,
    password: 'Sup3rSecret!23'
  }
  let accessToken = ''
  const newFirstName2 = 'Paulo'
  const newLastName2 = 'Faraco'

  it('Hello API Request', async () => {
    const result = await request.default(app).get('/')
    expect(result.text).toEqual('Server running at http://localhost:3000')
    expect(result.statusCode).toEqual(200)
  })

  it('should allow a POST to /users', async function () {
    const res = await request.default(app).post('/users').send(firstUserBody)

    expect(res.status).toEqual(201)
    expect(res.body._id).toBeDefined()
    firstUserIdTest = res.body._id
  })

  it('should allow a POST to /auth', async function () {
    const res = await request.default(app).post('/auth').send(firstUserBody)

    expect(res.status).toEqual(201)
    expect(res.body.accessToken).toBeDefined()
    accessToken = res.body.accessToken
    refreshToken = res.body.refreshToken
  })

  it('should allow a GET from /users/:userId with an access token', async function () {
    const res = await request.default(app).get(`/users/${firstUserIdTest}`).set('Authorization', `Bearer ${accessToken}`).send()

    expect(res.status).toEqual(200)
    expect(res.body._id).toBeDefined()
    expect(res.body._id).toEqual(firstUserIdTest)
    expect(res.body.email).toEqual(firstUserBody.email)
  })

  describe('with a valid access token', function () {
    it('should allow a GET from /users', async function () {
      const res = await request.default(app).get('/users').set('Authorization', `Bearer ${accessToken}`).send()
      expect(res.status).toEqual(200)
    })

    it('should disallow a PUT to /users/:userId with an nonexistent ID', async function () {
      const res = await request.default(app).put('/users/i-do-not-exist').set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: 'Matheus',
          lastName: 'Silva'
        })
      expect(res.status).toEqual(404)
    })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    it('should allow a POST to /auth/refresh-token', async function () {
      const res = await request.default(app)
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })

      expect(res.status).toEqual(201)
      expect(res.body.accessToken).toBeDefined()
      accessToken = res.body.accessToken
      refreshToken = res.body.refreshToken
    })

    it('should allow a PUT to /users/:userId to change first and last names', async function () {
      const res = await request.default(app)
        .put(`/users/${firstUserIdTest}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: newFirstName2,
          lastName: newLastName2
        })

      expect(res.status).toEqual(200)
    })

    it('should allow a GET from /users/:userId and should have a new full name', async function () {
      const res = await request.default(app)
        .get(`/users/${firstUserIdTest}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()

      expect(res.status).toEqual(200)
      expect(res.body._id).toBeDefined()
      expect(res.body.firstName).toEqual(newFirstName2)
      expect(res.body.lastName).toEqual(newLastName2)
      expect(res.body.email).toEqual(firstUserBody.email)
      expect(res.body._id).toEqual(firstUserIdTest)
    })

    it('should allow a DELETE from /users/:userId', async function () {
      const res = await request.default(app)
        .delete(`/users/${firstUserIdTest}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send()
      expect(res.status).toEqual(200)
    })
  })
})

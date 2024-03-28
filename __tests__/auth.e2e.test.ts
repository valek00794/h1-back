import request from 'supertest'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

import { app } from '../src/app'
import { CodeResponses, SETTINGS } from '../src/settings'

dotenv.config()

const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
const codedAuth = buff.toString('base64')

const newIncorrectLoginData = {
    loginOrEmail: '',
    password: '',
}

const newCorrectUser = {
    login: 'lg-706298',
    password: 'qwerty1',
    email: 'admin@google.com'
}

describe('/login', () => {
    const client = new MongoClient(SETTINGS.DB.mongoURI)

    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(CodeResponses.NO_CONTENT_204)
        await client.connect()
    })

    afterAll(async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(CodeResponses.NO_CONTENT_204)
        await client.close()
    })
    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(CodeResponses.NO_CONTENT_204)
    })

    it('1. - POST /login does not auth the User with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ ...newIncorrectLoginData })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field is required', field: 'loginOrEmail' },
                    { message: 'The field is required', field: 'password' },
                ],
            })

    })

    it('2. - POST /login does not auth the User with correct email and incorrect password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)

        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.email, password: 'wrongPswd' })
            .expect(CodeResponses.UNAUTHORIZED_401)

    })

    it('3. - POST /login does not auth the User with correct email and incorrect password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)

        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: 'wronglogin', password: 'wrongPswd' })
            .expect(CodeResponses.UNAUTHORIZED_401)

    })

    it('4. - POST /login does auth the User with correct data email+password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.email, password: newCorrectUser.password })
            .expect(CodeResponses.NO_CONTENT_204)

    })

    it('5. - POST /login does auth the User with correct data ;ogin+password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.login, password: newCorrectUser.password })
            .expect(CodeResponses.NO_CONTENT_204)
    })
})

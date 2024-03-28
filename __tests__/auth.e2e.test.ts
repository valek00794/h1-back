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
    login: 'userAdmin',
    password: 'qwerty22',
    email: 'admin@google.com'
}

describe('/login', () => {
    const client = new MongoClient(SETTINGS.DB.mongoURI)

    beforeAll(async () => {
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
        const resUser = await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)
        const user = resUser.body

        const resUsers = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(resUsers.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [user]
        })
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.email, password: 'wrongPswd' })
            .expect(CodeResponses.UNAUTHORIZED_401)

    })

    it('3. - POST /login does auth the User with correct data email+password', async function () {
        const resUser = await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)
        const user = resUser.body

        const resUsers = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(resUsers.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [user]
        })
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.email, password: newCorrectUser.password })
            .expect(CodeResponses.NO_CONTENT_204)

    })

    it('4. - POST /login does auth the User with correct data ;ogin+password', async function () {
        const resUser = await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(CodeResponses.CREATED_201)
        const user = resUser.body

        const resUsers = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(resUsers.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [user]
        })
        await request(app)
            .post(SETTINGS.PATH.login)
            .send({ loginOrEmail: newCorrectUser.login, password: newCorrectUser.password })
            .expect(CodeResponses.NO_CONTENT_204)

    })
})

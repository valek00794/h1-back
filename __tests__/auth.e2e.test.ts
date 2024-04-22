import request from 'supertest'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../src/app'
import { StatusCodes, SETTINGS } from '../src/settings'

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

    beforeAll(async () => {
        const mongod = await MongoMemoryServer.create();
        mongod.getUri();
    })

    afterAll(async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(StatusCodes.NO_CONTENT_204)
    })
    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(StatusCodes.NO_CONTENT_204)
    })

    it('1. - POST /login does not auth the User with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.auth + '/login')
            .send({ ...newIncorrectLoginData })
            .expect(StatusCodes.BAD_REQUEST_400, {
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
            .expect(StatusCodes.CREATED_201)

        await request(app)
            .post(SETTINGS.PATH.auth + '/login')
            .send({ loginOrEmail: newCorrectUser.email, password: 'wrongPswd' })
            .expect(StatusCodes.UNAUTHORIZED_401)

    })

    it('3. - POST /login does not auth the User with correct email and incorrect password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(StatusCodes.CREATED_201)

        await request(app)
            .post(SETTINGS.PATH.auth + '/login')
            .send({ loginOrEmail: 'wronglogin', password: 'wrongPswd' })
            .expect(StatusCodes.UNAUTHORIZED_401)

    })

    it('4. - POST /login does auth the User with correct data email+password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(StatusCodes.CREATED_201)
        const res = await request(app)
            .post(SETTINGS.PATH.auth + '/login')
            .send({ loginOrEmail: newCorrectUser.email, password: newCorrectUser.password })
            .expect(StatusCodes.OK_200)

        expect(res.body).toEqual({
            accessToken: expect.any(String)
        })

        const decodeToken = Buffer.from(res.body.accessToken, 'base64').toString('utf8')
        expect(decodeToken).toContain('{"alg":"HS256","typ":"JWT"}');
        expect(decodeToken).toContain('userId');
        expect(decodeToken).toContain('iat');
        expect(decodeToken).toContain('exp');

    })

    it('5. - POST /login does auth the User with correct data login+password', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectUser })
            .expect(StatusCodes.CREATED_201)
        const res = await request(app)
            .post(SETTINGS.PATH.auth + '/login')
            .send({ loginOrEmail: newCorrectUser.login, password: newCorrectUser.password })
            .expect(StatusCodes.OK_200)
        
        expect(res.body).toEqual({
            accessToken: expect.any(String)
        })

        const decodeToken = Buffer.from(res.body.accessToken, 'base64').toString('utf8')
        expect(decodeToken).toContain('{"alg":"HS256","typ":"JWT"}');
        expect(decodeToken).toContain('userId');
        expect(decodeToken).toContain('iat');
        expect(decodeToken).toContain('exp');
    })
})

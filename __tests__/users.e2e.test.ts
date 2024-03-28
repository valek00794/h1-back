import request from 'supertest'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

import { app } from '../src/app'
import { CodeResponses, SETTINGS } from '../src/settings'

dotenv.config()

const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
const codedAuth = buff.toString('base64')

const emptyUsers = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] }

const newIncorrectEmptyUser = {
    login: '',
    password: '',
    email: ''
}

const newIncorrectUser = {
    login: '12',
    password: '12345',
    email: 'test@mail.ru'
}

const newIncorrectUser2 = {
    login: '12345678901',
    password: '123456789012345678901',
    email: 'admin@google.com'
}

const newCorrectUser = {
    login: 'userAdmin',
    password: 'qwerty22',
    email: 'admin@google.com'
}

describe('/users', () => {
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

    it('1. GET /users = []', async () => {
        await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(emptyUsers)
    })
    //тест получения юзеров  с квери параметрами

    it('2. - POST /Users does not create the User with incorrect empty data', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectEmptyUser })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field is required and The field length should be from 6 to 20', field: 'password' },
                    { message: 'The field is required and The field length should be from 3 to 10', field: 'login' },
                    { message: 'The field is required and The field has a pattern /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/', field: 'email' },
                ],
            })

        const res = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(res.body).toEqual(emptyUsers)
    })

    it('3. - POST /Users does not create the User with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectUser2 })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field length should be from 6 to 20', field: 'password' },
                    { message: 'The field length should be from 3 to 10', field: 'login' },
                ],
            })

        const res = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(res.body).toEqual(emptyUsers)
    })

    it('4. - POST /Users does not create the User with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectUser })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field length should be from 6 to 20', field: 'password' },
                    { message: 'The field length should be from 3 to 10', field: 'login' },
                ],
            })

        const res = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(res.body).toEqual(emptyUsers)
    })

    it('5. - POST /Users does create the User with correct data', async function () {
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
    })

    it('6. - DELETE /users/{id} User by incorrect ID', async function () {
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
            .delete(SETTINGS.PATH.users + '/RandomId')
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(CodeResponses.NOT_FOUND_404)

        const resUsers2 = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(resUsers2.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [user]
        })
    })
    it('7. - DELETE /users/{id} User by correct ID', async function () {
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
            .delete(SETTINGS.PATH.users + '/' + user.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(CodeResponses.NO_CONTENT_204)

        const resUsers2 = await request(app)
            .get(SETTINGS.PATH.users)
            .set({ 'authorization': 'Basic ' + codedAuth })
        expect(resUsers2.body).toEqual(emptyUsers)
    })
})

import request from 'supertest'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

import { app } from '../src/app'
import { CodeResponses, SETTINGS } from '../src/settings'

dotenv.config()

const emptyBlogs = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] }

const newCorrectBlog = {
    name: "Blog Name",
    description: "Blog Desc",
    websiteUrl: "https://Ea6R10IEPX81QLN-MdWpCZMxt0LQknCzbPn6MbsujH6NF3XoE0ymYAfe9460K_xacNPjZv0zOYhkw3uCyHUUpTI6w.73"
}

const newAnotherCorrectBlog = {
    name: 'new Blog name',
    description: 'new Blog Desc',
    websiteUrl: 'https://it-incubator.io/'
}

const newIncorrectBlog = {
    name: '1234567890123456',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus',
    websiteUrl: 'Lorem ipsum dolor sit amet, consectetuer'
}

const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
const codedAuth = buff.toString('base64')

describe('/blogs', () => {
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

    it('1. GET /blogs = []', async () => {
        await request(app).delete(SETTINGS.PATH.clearDb).expect(CodeResponses.NO_CONTENT_204)
        await request(app).get(SETTINGS.PATH.blogs).expect(emptyBlogs)
    })

    it('2. - POST /blogs does not create the Blog with incorrect empty data', async function () {
        const newIncorrectBlog = {
            name: '',
            description: '',
            websiteUrl: ''
        }
        await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectBlog })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field is required', field: 'name' },
                    { message: 'The field is required', field: 'description' },
                    { message: 'The field is required and The field has a pattern ^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$', field: 'websiteUrl' },
                ],
            })

        const res = await request(app).get(SETTINGS.PATH.blogs)
        expect(res.body).toEqual(emptyBlogs)
    })
    it('3. - POST /blogs does not create the Blog with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectBlog })
            .expect(CodeResponses.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field length must be less than 15', field: 'name' },
                    { message: 'The field length must be less than 500', field: 'description' },
                    { message: 'The field has a pattern ^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$', field: 'websiteUrl' },
                ],
            })

        const res = await request(app).get(SETTINGS.PATH.blogs)
        expect(res.body).toEqual(emptyBlogs)
    })

    it('4. - POST /blogs does create the Blog with correct data', async function () {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        expect(createdBlog).toEqual(
            {
                ...newCorrectBlog,
                id: res.body.id,
                createdAt: res.body.createdAt,
                isMembership: res.body.isMembership
            })
    })

    it('5. - GET /blogs/{id} Blog by ID with incorrect id', async () => {
        await request(app).get(`${SETTINGS.PATH.blogs}/RandomId`).expect(CodeResponses.NOT_FOUND_404)
    })

    it('6. + GET /blogs/{id} Blog by ID with correct id', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newAnotherCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        const resCreatedBlog = await request(app)
            .get(SETTINGS.PATH.blogs + '/' + createdBlog.id)
            .expect(CodeResponses.OK_200, createdBlog)
        expect(resCreatedBlog.body).toEqual(createdBlog)

    })

    it('7. - PUT /blogs/{id} Blog with incorrect id', async () => {
        await request(app)
            .put(SETTINGS.PATH.blogs + '/RandomId')
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send(newAnotherCorrectBlog)
            .expect(CodeResponses.NOT_FOUND_404)

        const res = await request(app).get(SETTINGS.PATH.blogs)
        expect(res.body).toEqual(emptyBlogs)
    })


    it('8. - PUT /blogs/{id} Blog with incorrect data', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        await request(app).get(SETTINGS.PATH.blogs).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdBlog]
        })

        await request(app)
            .put(SETTINGS.PATH.blogs + '/' + createdBlog.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({
                name: newIncorrectBlog.name,
                description: newIncorrectBlog.description,
                websiteUrl: newIncorrectBlog.websiteUrl
            })
            .expect(CodeResponses.BAD_REQUEST_400)
        await request(app).get(SETTINGS.PATH.blogs).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdBlog]
        })

    })

    it('9. - PUT /blogs/{id} Blog by ID with correct data', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        await request(app).get(SETTINGS.PATH.blogs).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdBlog]
        })

        await request(app)
            .put(SETTINGS.PATH.blogs + '/' + createdBlog.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({
                name: newAnotherCorrectBlog.name,
                description: newAnotherCorrectBlog.description,
                websiteUrl: newAnotherCorrectBlog.websiteUrl
            })
            .expect(CodeResponses.NO_CONTENT_204)

        await request(app).get(SETTINGS.PATH.blogs).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                ...createdBlog,
                name: newAnotherCorrectBlog.name,
                description: newAnotherCorrectBlog.description,
                websiteUrl: newAnotherCorrectBlog.websiteUrl
            }]
        })
    })
    it('10. - DELETE /blogs/{id} Blog by incorrect ID', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        expect(createdBlog).toEqual(
            {
                ...newCorrectBlog,
                id: res.body.id,
                createdAt: res.body.createdAt,
                isMembership: res.body.isMembership
            })

        await request(app)
            .delete(SETTINGS.PATH.blogs + '/RandomId')
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(CodeResponses.NOT_FOUND_404)

        await request(app).get(SETTINGS.PATH.blogs).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                ...newCorrectBlog,
                id: createdBlog.id,
                createdAt: createdBlog.createdAt,
                isMembership: createdBlog.isMembership
            }]
        })
    })
    it('11. - DELETE /blogs/{id} Blog by correct ID', async () => {
        const res = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(CodeResponses.CREATED_201)

        const createdBlog = res.body
        expect(createdBlog).toEqual(
            {
                ...newCorrectBlog,
                id: res.body.id,
                createdAt: res.body.createdAt,
                isMembership: res.body.isMembership
            })

        await request(app)
            .delete(SETTINGS.PATH.blogs + '/' + createdBlog.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(CodeResponses.NO_CONTENT_204)

        await request(app).get(SETTINGS.PATH.blogs).expect(emptyBlogs)
    })
})

import request from 'supertest'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server';

import { app } from '../src/app'
import { SETTINGS, StatusCodes } from '../src/settings'

dotenv.config()

const emptyPosts = { pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: [] }

const newCorrectBlog = {
    name: 'Blog Name',
    description: 'Blog Desc',
    websiteUrl: 'https://Ea6R10IEPX81QLN-MdWpCZMxt0LQknCzbPn6MbsujH6NF3XoE0ymYAfe9460K_xacNPjZv0zOYhkw3uCyHUUpTI6w.73'
}

const newCorrectPost = {
    title: 'string',
    shortDescription: 'string',
    content: 'string',
    blogId: ''
}

const newAnotherCorrectPost = {
    title: 'string2',
    shortDescription: 'string2',
    content: 'string2',
    blogId: ''
}

const newIncorrectPost = {
    title: 'Lorem ipsum dolor sit amet, con',
    shortDescription: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean ma',
    content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na',
    blogId: '12312312312312312'
}

const newIncorrectEmptyPost = {
    title: '',
    shortDescription: '',
    content: '',
    blogId: ''
}

const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf8')
const codedAuth = buff.toString('base64')

describe('/posts', () => {

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

    it('1. GET /posts = []', async () => {
        await request(app).get(SETTINGS.PATH.posts).expect(emptyPosts)
    })

    it('2. - POST /posts does not create the Post with incorrect empty data', async function () {
        await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectEmptyPost })
            .expect(StatusCodes.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field is required', field: 'title' },
                    { message: 'The field is required', field: 'shortDescription' },
                    { message: 'The field is required', field: 'content' },
                    { message: 'The field is required and Blog not found', field: 'blogId' },
                ],
            })

        const res = await request(app).get(SETTINGS.PATH.posts)
        expect(res.body).toEqual(emptyPosts)
    })
    it('3. - POST /posts does not create the Post with incorrect data', async function () {
        await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newIncorrectPost })
            .expect(StatusCodes.BAD_REQUEST_400, {
                errorsMessages: [
                    { message: 'The field length must be less than 30', field: 'title' },
                    { message: 'The field length must be less than 100', field: 'shortDescription' },
                    { message: 'The field length must be less than 1000', field: 'content' },
                    { message: 'Blog not found', field: 'blogId' },
                ],
            })

        const res = await request(app).get(SETTINGS.PATH.posts)
        expect(res.body).toEqual(emptyPosts)
    })

    it('4. - POST /posts does create the Post with correct data', async function () {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const resPost = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = resPost.body
        expect(createdPost).toEqual(
            {
                ...newCorrectPost,
                id: createdPost.id,
                createdAt: createdPost.createdAt,
                blogId: resBlog.body.id,
                blogName: resBlog.body.name,
            })
    })

    it('4.2. - POST /blogs/{blogId}/posts does create the Post with correct data for special blog ID', async function () {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const resPost = await request(app)
            .post(SETTINGS.PATH.blogs + '/' + resBlog.body.id + SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = resPost.body
        expect(createdPost).toEqual(
            {
                ...newCorrectPost,
                id: createdPost.id,
                createdAt: createdPost.createdAt,
                blogId: resBlog.body.id,
                blogName: resBlog.body.name,
            })
    })

    it('5. - GET /posts/{id} Post by ID with incorrect id', async () => {
        await request(app).get(`${SETTINGS.PATH.posts}/RandomId`).expect(StatusCodes.NOT_FOUND_404)
    })

    it('6. + GET /posts/{id}  Post by ID with correct id', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const resPost = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newAnotherCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = resPost.body
        await request(app)
            .get(SETTINGS.PATH.posts + '/' + createdPost.id)
            .expect(StatusCodes.OK_200, createdPost)
    })

    it('6.2. + GET /blogs/{blogId}/posts  Posts for special correct blog ID', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const resPost = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newAnotherCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = resPost.body
        await request(app)
            .get(SETTINGS.PATH.blogs + '/' + resBlog.body.id + SETTINGS.PATH.posts)
            .expect(StatusCodes.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdPost]
            })
    })

    it('7. - PUT /posts/{id} Post with incorrect id', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        await request(app)
            .put(SETTINGS.PATH.posts + '/RandomId')
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newAnotherCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.NOT_FOUND_404)

        const res = await request(app).get(SETTINGS.PATH.posts)
        expect(res.body).toEqual(emptyPosts)
    })


    it('8. - PUT /posts/{id}  Post with correct data', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const res = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = res.body
        await request(app).get(SETTINGS.PATH.posts).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdPost]
        })

        await request(app)
            .put(SETTINGS.PATH.posts + '/' + createdPost.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({
                title: newIncorrectPost.title,
                shortDescription: newIncorrectPost.shortDescription,
                content: newIncorrectPost.content,
                blogId: newIncorrectPost.blogId
            })
            .expect(StatusCodes.BAD_REQUEST_400)
        await request(app).get(SETTINGS.PATH.posts).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdPost]
        })

    })

    it('9. - PUT /posts/{id}  Post by ID with correct data', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const res = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = res.body
        await request(app).get(SETTINGS.PATH.posts).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [createdPost]
        })

        const resBlog2 = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        await request(app)
            .put(SETTINGS.PATH.posts + '/' + createdPost.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({
                title: newAnotherCorrectPost.title,
                shortDescription: newAnotherCorrectPost.shortDescription,
                content: newAnotherCorrectPost.content,
                blogId: resBlog2.body.id
            })
            .expect(StatusCodes.NO_CONTENT_204)

        await request(app).get(SETTINGS.PATH.posts).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                ...createdPost,
                title: newAnotherCorrectPost.title,
                shortDescription: newAnotherCorrectPost.shortDescription,
                content: newAnotherCorrectPost.content,
                blogId: resBlog2.body.id
            }]
        })
    })
    it('10. - DELETE /posts/{id}  Post by incorrect ID', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const res = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = res.body
        expect(createdPost).toEqual(
            {
                ...newCorrectPost,
                id: res.body.id,
                createdAt: res.body.createdAt,
                blogId: res.body.blogId,
                blogName: res.body.blogName,
            })

        await request(app)
            .delete(SETTINGS.PATH.posts + '/RandomId')
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(StatusCodes.NOT_FOUND_404)

        await request(app).get(SETTINGS.PATH.posts).expect({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                ...newCorrectPost,
                id: res.body.id,
                createdAt: res.body.createdAt,
                blogId: res.body.blogId,
                blogName: res.body.blogName,
            }]
        })
    })
    it('11. - DELETE /posts/{id}  Post by correct ID', async () => {
        const resBlog = await request(app)
            .post(SETTINGS.PATH.blogs)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectBlog })
            .expect(StatusCodes.CREATED_201)

        const res = await request(app)
            .post(SETTINGS.PATH.posts)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .send({ ...newCorrectPost, blogId: resBlog.body.id })
            .expect(StatusCodes.CREATED_201)

        const createdPost = res.body
        expect(createdPost).toEqual(
            {
                ...newCorrectPost,
                id: res.body.id,
                createdAt: res.body.createdAt,
                blogId: res.body.blogId,
                blogName: res.body.blogName,
            })

        await request(app)
            .delete(SETTINGS.PATH.posts + '/' + createdPost.id)
            .set({ 'authorization': 'Basic ' + codedAuth })
            .expect(StatusCodes.NO_CONTENT_204)

        await request(app).get(SETTINGS.PATH.posts).expect(emptyPosts)
    })
})

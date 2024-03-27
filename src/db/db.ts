import { DBType } from "../types/db-types"
import { MongoClient } from "mongodb"
import dotenv from 'dotenv'

import { PostType } from "../types/posts-types"
import { BlogType } from "../types/blogs-types"
import { SETTINGS } from "../settings"
import { UserDBType } from "../types/users-types"
dotenv.config()

const client = new MongoClient(SETTINGS.DB.mongoURI)
export const runDb = async () => {
  try {
    await client.connect()
    console.log('Connect success')
  } catch (e) {
    console.log('Connect ERROR', e)
    await client.close()
  }
}

export const dbLocal: DBType = {
  videos: [
    {
      "id": 1,
      "title": "im play",
      "author": "Barsik",
      "canBeDownloaded": true,
      "minAgeRestriction": null,
      "createdAt": "2024-02-27T09:08:13.199Z",
      "publicationDate": "2024-02-27T09:08:13.200Z",
      "availableResolutions": [
        "P144"
      ]
    },
    {
      "id": 2,
      "title": "im sleep",
      "author": "Barsik",
      "canBeDownloaded": false,
      "minAgeRestriction": null,
      "createdAt": "2024-02-27T09:08:13.199Z",
      "publicationDate": "2024-02-27T09:08:13.200Z",
      "availableResolutions": [
        "P240"
      ]
    },
    {
      "id": 3,
      "title": "im eat",
      "author": "Barsik",
      "canBeDownloaded": false,
      "minAgeRestriction": null,
      "createdAt": "2024-02-27T09:08:13.199Z",
      "publicationDate": "2024-02-27T09:08:13.200Z",
      "availableResolutions": [
        "P360"
      ]
    }
  ],
}

const db = client.db();

export const postsCollection = db.collection<PostType>(SETTINGS.DB.collection.POST_COLLECTION_NAME)

export const blogsCollection = db.collection<BlogType>(SETTINGS.DB.collection.BLOG_COLLECTION_NAME)

export const usersCollection = db.collection<UserDBType>(SETTINGS.DB.collection.USER_COLLECTION_NAME)

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    dbLocal.videos = []
    return
  }

  dbLocal.videos = dataset.videos || dbLocal.videos
}

export const setMongoDB = () => {
  postsCollection.drop()
  blogsCollection.drop()
  usersCollection.drop()
}
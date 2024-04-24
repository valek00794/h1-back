import { APIRequestsType, DBType } from "../types/db-types"
import { MongoClient } from "mongodb"
import mongoose from 'mongoose'
import dotenv from 'dotenv'

//import { PostType } from "../types/posts-types"
//import { BlogType } from "../types/blogs-types"
import { SETTINGS } from "../settings"
import { UserDBType, UserEmailConfirmationInfoType, UserRecoveryPasswordInfoType, UsersDevicesType } from "../types/users-types"
//import { CommentType } from "../types/comments-types"
dotenv.config()

const client = new MongoClient(SETTINGS.DB.mongoURI)
export const runDb = async () => {
  try {
    await mongoose.connect(SETTINGS.DB.mongoURI)
    console.log('Connect success')
  } catch (e) {
    console.log('Connect ERROR', e)
    await mongoose.disconnect()
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

//export const postsCollection = db.collection<PostType>(SETTINGS.DB.collection.POSTS)

//export const blogsCollection = db.collection<BlogType>(SETTINGS.DB.collection.BLOGS)

export const usersCollection = db.collection<UserDBType>(SETTINGS.DB.collection.USERS)

export const usersDevicesCollection = db.collection<UsersDevicesType>(SETTINGS.DB.collection.USERS_DEVICES)

export const usersEmailConfirmationCollection = db.collection<UserEmailConfirmationInfoType>(SETTINGS.DB.collection.USERS_EMAIL_CONFIRMATIONS)

export const usersRecoveryPassswordCollection = db.collection<UserRecoveryPasswordInfoType>(SETTINGS.DB.collection.USERS_PASSWORD_RECOVERY)

//export const commentsCollection = db.collection<CommentType>(SETTINGS.DB.collection.COMMENTS)

export const apiRequestsCollection = db.collection<APIRequestsType>(SETTINGS.DB.collection.API_REQUESTS)

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    dbLocal.videos = []
    return
  }

  dbLocal.videos = dataset.videos || dbLocal.videos
}

export const setMongoDB = () => {
  //postsCollection.drop()
  //blogsCollection.drop()
  usersCollection.drop()
  //commentsCollection.drop()
  usersEmailConfirmationCollection.drop()
  apiRequestsCollection.drop()
}
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { DBType } from "../types/db-types"
import { SETTINGS } from "../settings"
import { ApiRequestsModel } from '../db/mongo/apiRequests.model';
import { BlogsModel } from '../db/mongo/blogs.model';
import { CommentsModel } from '../db/mongo/comments.model';
import { PostsModel } from '../db/mongo/posts.model';
import { UsersModel } from '../db/mongo/users.model';
import { UsersDevicesModel } from '../db/mongo/usersDevices.model';
import { UsersEmailConfirmationsModel } from '../db/mongo/usersEmailConfirmation.model';
import { UsersRecoveryPassswordModel } from '../db/mongo/usersRecoveryPasssword.model';

dotenv.config()

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

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    dbLocal.videos = []
    return
  }
  dbLocal.videos = dataset.videos || dbLocal.videos
}

export const setMongoDB = async () => {
  await ApiRequestsModel.collection.drop()
  await BlogsModel.collection.drop()
  await CommentsModel.collection.drop()
  await PostsModel.collection.drop()
  await UsersModel.collection.drop()
  await UsersDevicesModel.collection.drop()
  await UsersEmailConfirmationsModel.collection.drop()
  await UsersRecoveryPassswordModel.collection.drop()
}
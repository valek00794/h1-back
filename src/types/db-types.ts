import { OutputVideoType } from "./videos-types"

export type DBType = {
    videos: OutputVideoType[],
}

export type APIRequestsType = {
    IP: string,
    URL: string,
    date: Date
}
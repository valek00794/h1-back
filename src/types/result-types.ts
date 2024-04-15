import { ResultStatus } from "../settings"

export type FieldError = {
    message: string,
    field: string,
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export type Result<T = null> = {
    status: ResultStatus,
    data: T
}




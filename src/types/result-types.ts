export type FieldError = {
    message: string,
    field: string,
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export enum ResultStatus {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    UNAUTHORIZED_401 = 401,
    NOT_FOUND_404 = 404,
    FORBIDDEN_403 = 403
}


export type Result<T = null> = {
    status: ResultStatus,
    data: T
}




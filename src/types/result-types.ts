import { ResultStatus } from "../settings"

export type FieldError = {
    message: string,
    field: string,
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export class Result<T = null> {
    constructor(
        public status: ResultStatus,
        public data: T,
        public errors: APIErrorResult | null
    ) {
    }
}

export class Paginator<T> {
    constructor(
        public pagesCount: number,
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: T
    ) { }
}




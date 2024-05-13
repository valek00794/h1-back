import { ResultStatus } from "../settings"

export type FieldError = {
    message: string,
    field: string,
}

export type APIErrorResult = {
    errorsMessages: FieldError[]
}

export class Result<T> {
    constructor(
        public status: ResultStatus,
        public data: T,
        public errors: APIErrorResult | null
    ) {
    }
}

export class SuccessResult<T> extends Result<T> {
    constructor(data: T) {
        super(ResultStatus.Success, data, null)
    }
}

export class Paginator<T> {
    public pagesCount: number
    constructor(
        public page: number,
        public pageSize: number,
        public totalCount: number,
        public items: T
    ) {
        this.pagesCount = Math.ceil(this.totalCount / this.pageSize)
    }
}




import { UserInfoType } from './users-types'
declare global {
    namespace Express {
        export interface Request {
            user: UserInfoType | null;
        }
    }
}
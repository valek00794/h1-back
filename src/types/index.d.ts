import { UserInfo } from './users-types'
declare global {
    namespace Express {
        export interface Request {
            user: UserInfo | null;
        }
    }
}
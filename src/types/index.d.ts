declare global {
    namespace Express {
        export interface Request {
            commentatorInfo: CommentatorInfo | null;
        }
    }
}
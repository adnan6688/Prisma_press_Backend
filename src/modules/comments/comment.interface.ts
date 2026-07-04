import { CommentStatus } from "../../../generated/prisma/enums";


export interface IcreateCommentPayload {
    content : string , 
    postId : string , 

}

export interface IupdatedCommentPayload {
    content? : string  , 
    status? : CommentStatus
}

export interface IModarateComment {
    status : CommentStatus
}
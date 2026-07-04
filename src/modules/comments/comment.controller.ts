import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { commentService } from "./comments.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const authodId = req?.user?.id as string

    const result = await commentService.createComment(authodId, req.body)

    sendResponse(res, {
        data: result,
        success: true,
        message: 'comment create successfully!',
        statusCode: status.CREATED
    })

});

const allCommentOfPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId as string

    const data = await commentService.allCommentOfPost(postId)

    sendResponse(res, {
        data,
        success: true,
        message: 'All comment retrived successfully!',
        statusCode: status.OK
    })
});

const getCommentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const comentId = req.params.commentId

    const data = await commentService.getCommentBycommentId(comentId as string)


    sendResponse(res, {
        data,
        success: true,
        message: 'Comment Get Successfully!',
        statusCode: status.OK
    })
});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const commentId= req.params.commentId as string 
    const data = req.body 
    const authorId = req.user?.id 
    const result = await commentService.updateComment(commentId , data , authorId as string)


     sendResponse(res, {
        data: result,
        success: true,
        message: 'Updated comment!',
        statusCode: status.OK
    })
});

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    const commentId = req.params.commentId as string 
    const authorId = req.user?.id as string
    const data = await commentService.deleteComment(commentId , authorId)

     sendResponse(res, {
        data: data,
        success: true,
        message: 'comment deleted successfully!',
        statusCode: status.OK
    })
});


export const commentController = {
    createComment,
    allCommentOfPost,
    getCommentById,
    updateComment,
    deleteComment,
};
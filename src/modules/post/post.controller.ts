import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    const payload = req.body
    const data = await postService.createPost(payload, userId as string)


    sendResponse(res, {
        data,
        success: true,
        message: 'post created successfully!',
        statusCode: httpStatus.CREATED
    })

})


const allPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const data = await postService.allPosts()

    sendResponse(res, {
        data,
        success: true,
        message: 'All post get  successfully!',
        statusCode: httpStatus.OK
    })
})


const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})


const myPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = req?.user?.id as string

    const data = await postService.myPosts(user)
    sendResponse(res, {
        data,
        success: true,
        message: 'Get my posts',
        statusCode: httpStatus.OK
    })
})


const postDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const postId = req.params.postId

    const data = await postService.postDetails(postId as string)
    sendResponse(res, {
        data,
        success: true,
        message: 'Post details get successfully!',
        statusCode: httpStatus.OK
    })
})

export const postController = {
    createPost,
    allPost,
    getPostStats,
    updatePost,
    myPosts,
    postDetails
}
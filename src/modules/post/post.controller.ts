import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";


const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



})


const allPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


})


const myPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})

export const postController = {
    createPost,
    allPost,
    getPostStats,
    updatePost,
    myPosts
}
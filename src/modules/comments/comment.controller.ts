import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";

const createComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next;
});

const allCommentOfPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next;
});

const getCommentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next;
});

const updateComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next;
});

const deleteComment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    next;
});

export const commentController = {
    createComment,
    allCommentOfPost,
    getCommentById,
    updateComment,
    deleteComment,
};
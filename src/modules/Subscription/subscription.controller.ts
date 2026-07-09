import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from 'http-status'

const createCheckOutSession = catchAsync(async (req : Request , res : Response , next : NextFunction)=>{

    const userId = req?.user?.id as string


    const result = await subscriptionService.createCheckOutSession(userId)


    sendResponse(res , {
        message : 'Checkout completed successfully!',
        success : true , 
        statusCode : httpStatus.OK,
        data : result
    })
})



export const subsCriptionController = {
    createCheckOutSession
}
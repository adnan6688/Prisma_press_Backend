import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status'
import { userService } from "./users.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const register = async (req: Request, res: Response) => {

    const user = await userService.register(req.body)



    sendResponse(res, {
        message: 'User Register Successfully!',
        success: true,
        statusCode: httpStatus.CREATED,
        data: user
    })

}


const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const profile = await userService.getMyProfile(req?.user?.email as string , req?.user?.id as string)

    sendResponse(res , {
        statusCode : httpStatus.OK , 
        success : true , 
        message : 'user profile',
        data : profile
    })
})


const updateProfile = catchAsync(async (req : Request , res : Response , next : NextFunction)=>{

    const userId = req?.user?.id as string 
    const payload = req.body 
    const result = await userService.updateProfile(userId , payload)

    sendResponse(res , {
        success : true , 
        message : 'Profile update successfully!' , 
        data : result ,  
        statusCode : httpStatus.OK
    })
})



export const userController = {
    register,
    getMyProfile, 
    updateProfile
}
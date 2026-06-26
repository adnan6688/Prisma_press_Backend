import { Request, Response } from "express";
import httpStatus from 'http-status'
import { userService } from "./users.service";


const register = async (req: Request, res: Response) => {

    try{
        const user = await userService.register(req.body)

    res.status(httpStatus.CREATED).json({
        message: 'User Register Successfully!',
        success: true,
        statusCode: httpStatus.CREATED,
        data: {
            user
        }
    })
    }catch(error){
        console.log(error)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success : false , 
            message :'Failed to register user', 
            error : (error as Error).message 
        })
    }
}


export const userController = {
    register
}
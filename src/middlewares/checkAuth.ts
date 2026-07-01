import { NextFunction } from "express"
import { Request, Response } from "express"
import { jwtUtils } from "../utils/jwt"
import { JwtPayload } from "jsonwebtoken"
import config from "../config"
import { catchAsync } from "../utils/catchAsync"
import { prisma } from "../lib/prisma"
import { ActiveStatus, UserRole } from "../../generated/prisma/enums"


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                name: string,
                id: string,
                role: UserRole
            }
        }
    }
}


export const auth = (...authRoles: string[]) => {


    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken || req.headers.authorization || req.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new Error("You are not logged in , please login to access this resource.")
        }
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret) as JwtPayload

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error)
        }


        const { role, email, id, name } = verifiedToken?.data

        if (authRoles.length && !authRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this resource")
        }

        const user = await prisma.user.findUnique({
            where: {
                id, email
            }
        })

        if (!user) {
            throw new Error("User not found!")
        }
        if (user.activeStatus === ActiveStatus.BLOCK) {
            throw new Error("Your account has been block , please contact support")
        }
        req.user = {
            email,
            role,
            id,
            name
        }
        next()

    })
}
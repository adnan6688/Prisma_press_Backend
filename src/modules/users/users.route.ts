import { NextFunction, Router } from "express";
import { userController } from "./users.controller";
import { Request, Response } from "express";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { UserRole } from "../../../generated/prisma/enums";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'
import { auth } from "../../middlewares/checkAuth";

const router = Router()



router.post('/register', userController.register)

router.get('/me', auth(...Object.values(UserRole)), userController.getMyProfile)

router.put('/update-profile' , auth(...Object.values(UserRole)) , userController.updateProfile)

export const userRoutes = router
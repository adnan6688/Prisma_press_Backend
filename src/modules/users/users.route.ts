import {  Router } from "express";
import { userController } from "./users.controller";
import { UserRole } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";

const router = Router()



router.post('/register', userController.register)

router.get('/me', auth(...Object.values(UserRole)), userController.getMyProfile)

router.put('/update-profile' , auth(...Object.values(UserRole)) , userController.updateProfile)

export const userRoutes = router
import { Router } from "express";
import { subsCriptionController } from "./subscription.controller";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router()


router.post('/checkout', auth(...Object.values(UserRole)), subsCriptionController.createCheckOutSession)



export const subsCriptionRoutes = router
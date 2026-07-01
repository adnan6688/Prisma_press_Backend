import { Router } from "express";
import { authContrller } from "./auth.controller";


const router = Router()

router.post('/login' , authContrller.loginUser )


export const AuthRoutes = router
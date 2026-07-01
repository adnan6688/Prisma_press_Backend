import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";



const route = Router()

route.post('/', auth(...Object.values(UserRole)), postController.createPost)


route.get('/', postController.allPost)


route.get('/stats', auth(...Object.values(UserRole)), postController.getPostStats)

route.get('my-posts', auth(...Object.values(UserRole)), postController.myPosts)

export const postRoutes = route
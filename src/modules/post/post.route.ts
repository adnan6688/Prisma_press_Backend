import { Router } from "express";
import { postController } from "./post.controller";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { userRoutes } from "../users/users.route";



const route = Router()

route.post('/', auth(...Object.values(UserRole)), postController.createPost)

route.get('/', postController.allPost)

route.get('/stats', auth(...Object.values(UserRole)), postController.getPostStats)

route.get('/my_posts', auth(...Object.values(UserRole)), postController.myPosts)

route.get('/:postId' ,  auth(...Object.values(UserRole)), postController.postDetails)


route.patch('/updatepost/:postId' , auth(...Object.values(UserRole)), postController.updatePost)

route.delete('/deletePost/:postId' , auth(...Object.values(UserRole)) , postController.deletePost)
export const postRoutes = route
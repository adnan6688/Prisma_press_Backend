import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from 'cors'
import config from "./config";
const app: Application = express();
import { userRoutes } from "./modules/users/users.route";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comments/comments.route";
import { NotFound } from "./middlewares/notFound";
import httpStatus from 'http-status'
import { GlobalErrorHandler } from "./middlewares/globalErrorHandler";


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: config.app_url,
    credentials: true
}))



app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to our prisma press site!')
})


app.use('/api/user', userRoutes)
app.use('/api/auth', AuthRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)



// not found middle ware
app.use(NotFound)



// jodi amra kono middleware ar modde para metters a err ta  ni tah hole seta global error handler
app.use(GlobalErrorHandler)

export default app
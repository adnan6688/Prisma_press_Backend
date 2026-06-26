import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from 'cors'
import config from "./config";
const app: Application = express();
import { userRoutes } from "./modules/users/users.route";



app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: config.app_url,
    credentials: true
}))

app.use('/api/user', userRoutes)





app.get('/', async (req: Request, res: Response) => {
    res.send('Welcome to our prisma press site!')
})


export default app
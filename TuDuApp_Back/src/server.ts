import dotenv from 'dotenv'
import cors from 'cors'
import { corsConfig } from './config/cors'
import express from 'express'
import {dbConnect} from './config/db'
import projectRoutes from './routes/ProjectRoutes'


dotenv.config()
dbConnect();
const app = express()
app.use(cors(corsConfig))

app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)


export default app
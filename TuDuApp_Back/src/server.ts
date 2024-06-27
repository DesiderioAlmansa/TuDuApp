import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { corsConfig } from './config/cors'
import express from 'express'
import {dbConnect} from './config/db'
import projectRoutes from './routes/ProjectRoutes'


dotenv.config()
dbConnect();
const app = express()
app.use(cors(corsConfig))

//Logger
app.use(morgan('dev'))

//Read forms data
app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)


export default app
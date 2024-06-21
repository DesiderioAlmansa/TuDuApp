import dotenv from 'dotenv'
import express from 'express'
import {dbConnect} from './config/db'
import projectRoutes from './routes/ProjectRoutes'


dotenv.config()
dbConnect();
const app = express()


app.use(express.json())

//Routes
app.use('/api/projects', projectRoutes)


export default app
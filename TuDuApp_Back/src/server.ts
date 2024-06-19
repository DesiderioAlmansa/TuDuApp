import dotenv from 'dotenv'
import express from 'express'
import {dbConnect} from './config/db'


dotenv.config()
dbConnect();
const app = express()
export default app
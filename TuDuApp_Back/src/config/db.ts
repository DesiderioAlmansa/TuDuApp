import colors from 'colors'
import {exit} from 'node:process'
import mongoose from 'mongoose'


export const dbConnect = async () => {
    try{
        const connection = await mongoose.connect(process.env.DATABASE_CONNECTION_URL)
        console.log(colors.cyan.bold(`MongoDB Connect to: ${connection.connection.host}:${connection.connection.port}`))
    }catch(error){
        console.log(colors.red.bold(`Error when trying to connect to mongodb --> ${error.message}`))
        exit(1)
    }
}
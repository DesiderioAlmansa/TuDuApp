import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import { ITask } from './Task'
import { IUser } from './User'

//OBJECT TYPESCRIPT
export interface IProject extends Document  {
    name: string
    client: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
}

//OBJECT MONGOOSE
const ProjectSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true   
    },
    client: {
        type: String,
        trim: true,
        required: true   
    },
    description: {
        type: String,
        trim: true,
        required: true   
    },
    tasks:[
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true})

//connection Typescript Model with Mongoose Schema
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
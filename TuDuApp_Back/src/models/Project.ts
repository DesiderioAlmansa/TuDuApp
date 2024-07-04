import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import { ITask } from './Task'

//OBJECT TYPESCRIPT
export interface IProject extends Document  {
    name: string
    client: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
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
    ]
}, {timestamps: true})

//connection Typescript Model with Mongoose Schema
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
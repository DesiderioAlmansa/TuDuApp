import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import Task, { ITask } from './Task'
import { IUser } from './User'
import Note from './Note'

//OBJECT TYPESCRIPT
export interface IProject extends Document  {
    name: string
    client: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[]
    manager: PopulatedDoc<IUser & Document>
    team: PopulatedDoc<IUser & Document>[]
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
    },
    team:[
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true})

//Middleware
ProjectSchema.pre('deleteOne', {document: true}, async function (){
    const projectId = this._id
    if(!projectId) return

    //Delete notes
    const tasks = await Task.find({project: projectId})
    for(const task of tasks) {
        await Note.deleteMany({task: task.id})
    }
    //Delete tasks
    await Task.deleteMany({project: projectId})
})


//connection Typescript Model with Mongoose Schema
const Project = mongoose.model<IProject>('Project', ProjectSchema)
export default Project
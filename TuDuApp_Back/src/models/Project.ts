import mongoose, {Schema, Document} from 'mongoose'

//OBJECT TYPESCRIPT
export type ProjectModel = Document & {
    name: string
    client: string
    description: string
}

//OBJECT MONGOOSE
const ProjectSchema: Schema = new Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: true   
    },
    client: {
        type: String,
        unique: true,
        trim: true,
        required: true   
    },
    description: {
        type: String,
        unique: true,
        trim: true,
        required: true   
    }
})

//connection Typescript Model with Mongoose Schema
const Project = mongoose.model<ProjectModel>('Project', ProjectSchema)
export default Project
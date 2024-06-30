import { z } from 'zod'

/** Task */
export const taskStatusSchema = z.enum([ "pending" , "onHold" , "inProgress" , "completed"])
export type TaskStatus = z.infer<typeof taskStatusSchema>

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    project: z.string(),
    description: z.string(),
    status: taskStatusSchema,
    createdAt: z.string(),
    updatedAt: z.string()
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description' >

/** Project */

export const projectSchema = z.object({
    _id: z.string(),
    name: z.string(),
    client: z.string(),
    description: z.string()
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id:true,
        name:true,
        client:true,
        description:true
    })
)

export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'name' | 'client' | 'description' >
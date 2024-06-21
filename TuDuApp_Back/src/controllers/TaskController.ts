import type {Request, Response} from 'express'
import colors from 'colors'
import Project from "../models/Project"
import Task from "../models/Task"

export class TaskController {
     
    static createTask = async (req: Request, res: Response) => {
        try{
            const task = new Task(req.body)

            task.project = req.project.id
            req.project.tasks.push(task.id)

            await Promise.allSettled([task.save(),  req.project.save()])
            res.send('Task created')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjectTasks = async(req: Request, res: Response) => {
        try{
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        const {taskId} = req.params
        try{
            const task = await Task.findById(taskId)

            if(!task){
                const error = new Error(`Task \'${taskId}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            if(task.project.toString() !== req.project.id){
                const error = new Error(`Task \'${taskId}\' does not belong to project \'${req.project.id}\'.`)
                return res.status(403).json({error: error.message})
            }
            
            res.json(task)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        const {taskId} = req.params
        try{
            const task = await Task.findById(taskId)

            if(!task){
                const error = new Error(`Task \'${taskId}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            if(task.project.toString() !== req.project.id){
                const error = new Error(`Task \'${taskId}\' does not belong to project \'${req.project.id}\'.`)
                return res.status(403).json({error: error.message})
            }
            task.name = req.body.name
            task.description = req.body.description
            await task.save()
            res.send('Task updated')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {
        const {taskId} = req.params
        try{
            const task = await Task.findById(taskId)

            if(!task){
                const error = new Error(`Task \'${taskId}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== taskId)
           
            await Promise.allSettled([await task.deleteOne(),await req.project.save()])

            res.send('Task deleted')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        const {taskId} = req.params
        
        try{
            const task = await Task.findById(taskId)
            if(!task){
                const error = new Error(`Task \'${taskId}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            const {status} = req.body
            task.status = status
            await task.save()

            res.send('Task status updated')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }
}


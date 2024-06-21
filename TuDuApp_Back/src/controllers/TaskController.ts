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
        try{ 
            res.json(req.task)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try{
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            
            res.send('Task updated')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {
        try{
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task.id.toString())
           
            await Promise.allSettled([await req.task.deleteOne(),await req.project.save()])

            res.send('Task deleted')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try{
            const {status} = req.body

            req.task.status = status
            await req.task.save()

            res.send('Task status updated')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }
}


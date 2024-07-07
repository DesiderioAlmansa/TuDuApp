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
            res.send('Tarea creada')
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjectTasks = async(req: Request, res: Response) => {
        try{
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try{ 
            const task = await (await Task.findById(req.task.id)).populate({path: 'completedBy.user', select:'id name email'})
            res.json(task)
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try{
            req.task.name = req.body.name
            req.task.description = req.body.description
            await req.task.save()
            
            res.send('Tarea actualizada')
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteTaskById = async (req: Request, res: Response) => {
        try{
            req.project.tasks = req.project.tasks.filter(task => task._id.toString() !== req.task.id.toString())
           
            await Promise.allSettled([await req.task.deleteOne(),await req.project.save()])

            res.send('Tarea eliminada')
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try{
            const {status} = req.body

            req.task.status = status
            const data = {
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data)
            
            await req.task.save()

            res.send('Estado actualizado')
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }
}


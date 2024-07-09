import type {Request, Response, NextFunction} from 'express'
import Task, { ITask } from "../models/Task"

declare global{
    namespace Express{
        interface Request{
            task: ITask
        }
    }
}

export async function validateTaskExists(req: Request, res: Response, next: NextFunction){
    try{
        const {taskId} = req.params

        const task = await Task.findById(taskId)
        if(!task){
            const error = new Error(`No se ha encontrado la tarea`)
            return res.status(404).json({error: error.message})
        }

        req.task = task
        next()
    } catch(error){
        res.status(500).json({error: 'Ha ocurrido un error'})
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction){
    if(req.task.project.toString() !== req.project.id.toString()){
        const error = new Error(`La tarea no pertenece al proyecto`)
        return res.status(403).json({error: error.message})
    }
    next()
}

export function hasAuthorization(req: Request, res: Response, next: NextFunction){
    console.log(req.project)
    if(req.user.id.toString() !== req.project.manager.toString()){
        const error = new Error(`No tienes permiso para realizar la acción`)
        return res.status(403).json({error: error.message})
    }
    next()
}
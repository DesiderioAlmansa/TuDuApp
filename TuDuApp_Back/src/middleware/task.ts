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
            const error = new Error(`Task \'${taskId}\' not found.`)
            return res.status(404).json({error: error.message})
        }

        req.task = task
        next()
    } catch(error){
        res.status(500).json({error: 'An error ocourred.'})
    }
}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction){
    if(req.task.project.toString() !== req.project.id.toString()){
        const error = new Error(`Task \'${req.task.id}\' does not belong to project \'${req.project.id}\'.`)
        return res.status(403).json({error: error.message})
    }
    next()
}
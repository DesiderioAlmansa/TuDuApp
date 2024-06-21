import { request, type Request, type Response } from "express"
import Project from "../models/Project"
import colors from 'colors'

export class ProjectController{

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        try{
            await project.save()
            res.send('Project created')
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findById(id).populate('tasks')

            if(!project){
                const error = new Error(`Project \'${id}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            res.json(project)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjects = async (req: Request, res: Response) => {
        try{
            const projects = await Project.find({})
            res.json(projects)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findByIdAndUpdate(id, req.body)

            if(!project){
                const error = new Error(`Project \'${id}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            await project.save()
            res.send(`Project \'${id}\' updated.`)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findById(id)

            if(!project){
                const error = new Error(`Project \'${id}\' not found.`)
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne()
            res.send(`Project \'${id}\' deleted.`)
        }catch(error){
            res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

}
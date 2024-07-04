import { request, type Request, type Response } from "express"
import Project from "../models/Project"
import colors from 'colors'

export class ProjectController{

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body)
        console.log(req.user)
        try{
            await project.save()
            res.send('Proyecto creado')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findById(id).populate('tasks')

            if(!project){
                const error = new Error(`No se encontró el proyecto \'${id}\'`)
                return res.status(404).json({error: error.message})
            }

            res.json(project)
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static getProjects = async (req: Request, res: Response) => {
        try{
            const projects = await Project.find({})
            res.json(projects)
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findById(id)

            if(!project){
                const error = new Error(`No se encontró el proyecto \'${id}\'`)
                return res.status(404).json({error: error.message})
            }
            project.name = req.body.name
            project.client = req.body.client
            project.description = req.body.description
            await project.save()
            
            res.send(`Proyecto \'${id}\' actualizado`)
        }catch(error){
            console.log(error.message)
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static deleteProjectById = async (req: Request, res: Response) => {
        const {id} = req.params
        try{
            const project = await Project.findById(id)

            if(!project){
                const error = new Error(`No se encontró el proyecto \'${id}\'`)
                return res.status(404).json({error: error.message})
            }

            await project.deleteOne()
            res.send(`Proyecto \'${id}\' eliminado`)
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

}
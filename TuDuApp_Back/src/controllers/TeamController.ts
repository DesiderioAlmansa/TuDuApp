import type {Request, Response} from 'express'
import colors from 'colors'
import Project from "../models/Project"
import User from '../models/User'


export class TeamController {
    static getProjectTeam = async (req: Request, res: Response) => {
        try{
            const project = await Project.findById(req.project.id).populate({
                path: 'team',
                select: 'id email name'
            })
 
            if(!project){
                const error = new Error(`No se encontró el proyecto`)
                return res.status(404).json({error: error.message})
            }
            res.json(project.team) 
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static findMemberByEmail = async (req: Request, res: Response) => {
        try{
            const {email} = req.body
            //Find user
            const user = await User.findOne({email}).select('id email name') 
            if(!user){
                const error = new Error(`No se encontró el usuario \'${email}\'`)
                return res.status(404).json({error: error.message})
            }
            res.json(user) 
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static addMemberById = async (req: Request, res: Response) => {
        try{
            const {id} = req.body
            //Find user
            const user = await User.findById(id).select('id')
            if(!user){
                const error = new Error(`No se encontró el usuario`)
                return res.status(404).json({error: error.message})
            }  
            //Check if user are already in team 
            if(req.project.team.some(team => team.toString() === user.id.toString())){
                
                const error = new Error(`El usuario ya pertenece a este proyecto`)
                return res.status(404).json({error: error.message})
            }

            req.project.team.push(user.id)
            await req.project.save()
            res.json('Usuario agregado al proyecto') 
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {
        try{
            const {userId} = req.params
            
            if(!req.project.team.some(team => team.toString() === userId)){
                
                const error = new Error(`El usuario no pertenece a este proyecto`)
                return res.status(404).json({error: error.message})
            }

            req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)

            await req.project.save()
            res.json('Usuario eliminado del proyecto') 
        }catch(error){
            res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }
}
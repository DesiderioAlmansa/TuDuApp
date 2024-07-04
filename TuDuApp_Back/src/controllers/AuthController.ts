import {  type Request, type Response } from "express"
import User from "../models/User"
import bcrypt from 'bcrypt'
import colors from 'colors'
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/Token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"

export class AuthController{

    static createAccount = async (req: Request, res: Response) => {
        try{
            const { password, email } = req.body
            
            //Check if exists
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya existe')
                return res.status(409).json({error: error.message})
            }

            const user = new User(req.body)

            //Hash password
            user.password = await hashPassword(password)

            //Gen token 6 digit
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Send emmail
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada, revisa tu email para confirmarla')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try{
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Token no válido')
                return res.status(401).json({error: error.message})
            }

            const user = await User.findOne(tokenExists.user)
            user.confirmed = true


            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static login = async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body

            //Check if user exists
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('No se encontró el usuario')
                return res.status(404).json({error: error.message})
            }
            
            //Check if user has been confirmed
            if(!user.confirmed){
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                //Send emmail
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                await token.save()
                const error = new Error('La cuenta aun no ha sido confirmada, se ha enviado email de confirmación')
                return res.status(404).json({error: error.message})
            }

            //Check password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Contraseña incorrecta')
                return res.status(404).json({error: error.message})
            }

            const tokenJWT = generateJWT({id: user.id})
            res.send(tokenJWT)
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try{
            const { email } = req.body
            
            //Check if exists
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no existe')
                return res.status(404).json({error: error.message})
            }

            if(user.confirmed){
                const error = new Error('El usuario ya esta confirmado')
                return res.status(403).json({error: error.message})
            }

            //Gen token 6 digit
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            //Send emmail
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Se ha creado un nuevo token, revisa tu email')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }


    static forgotPassword = async (req: Request, res: Response) => {
        try{
            const { email } = req.body
            
            //Check if exists
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no existe')
                return res.status(404).json({error: error.message})
            }

            //Gen token 6 digit
            const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            //Send emmail
            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Revisa el email para mas instrucciones...')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try{
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Token no válido')
                console.log(error.message)
                return res.status(401).json({error: error.message})
            }
            res.send('Token válido, escribe tu nueva contraseña')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try{
            const {token} = req.params
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Token no válido')
                return res.status(401).json({error: error.message})
            }

            const user = await User.findById(tokenExists.user)
            user.password = await hashPassword(req.body.password)

            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            
            res.send('Contraseña reestablecida correctamente')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.json(req.user)
    }

}
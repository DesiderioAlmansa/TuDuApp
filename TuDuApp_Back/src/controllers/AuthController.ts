import {  type Request, type Response } from "express"
import User from "../models/User"
import bcrypt from 'bcrypt'
import colors from 'colors'
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/Token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController{

    static createAccount = async (req: Request, res: Response) => {
        try{
            const { password, email } = req.body
            
            //Check if exists
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('The user already exists')
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
            res.send('Account created, check your email to confirm')
        }catch(error){
            return res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try{
            const {token} = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists){
                const error = new Error('Invalid token')
                return res.status(401).json({error: error.message})
            }

            const user = await User.findOne(tokenExists.user)
            user.confirmed = true


            await Promise.allSettled([user.save(), tokenExists.deleteOne()])
            res.send('Account confirmed')
        }catch(error){
            return res.status(500).json(`An error ocurred: ${error}`)
            //console.log(colors.red.bold(error))
        }
    }

    static login = async (req: Request, res: Response) => {
        try{
            const {email, password} = req.body

            //Check if user exists
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('No se encontró el usuario.')
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
                const error = new Error('La cuenta aun no ha sido confirmada, se ha enviado email de confirmación.')
                return res.status(404).json({error: error.message})
            }

            //Check password
            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Contraseña incorrecta')
                return res.status(404).json({error: error.message})
            }

            res.send('Autenticando...')
        }catch(error){
            return res.status(500).json(`Ha ocurrido un error: ${error.message}`)
            //console.log(colors.red.bold(error))
        }
    }

}
import type {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        const error = new Error('No autorizado')
        return res.status(401).json({error:error.message})
    }

    const [, tokenJWT] = bearer.split(' ')

    try{
        const decoded = jwt.verify(tokenJWT, 'secretwordTuDuApp')

        if(typeof decoded === 'object' && decoded.id){
            const user =  await User.findById(decoded.id).select('_id name email')
            if(user){
                req.user = user
                next()
            } else{
                res.status(500).json({error: 'Token JWT no válido'})
            }
        }
    } catch(error) {
        res.status(500).json({error: 'Token JWT no válido'})
    }
}
import { Router } from "express";
import {body, param} from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handlerInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',  
    body('name').notEmpty().withMessage('name is obligatory'),
    body('password').isLength({min: 8}).withMessage('the password is too short, it must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('password does not match')
        }
        return true
    }),
    body('email').isEmail().withMessage('invalid email'),
    handlerInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('token is obligatory'),
    handlerInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('invalid email'),
    body('password').notEmpty().withMessage('password is obligatory'),
    handlerInputErrors,
    AuthController.login
)

export default router

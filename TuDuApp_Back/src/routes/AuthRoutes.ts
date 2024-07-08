import { Router } from "express";
import {body, param} from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handlerInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

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

router.post('/request-code',
    body('email').isEmail().withMessage('invalid email'),
    handlerInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('invalid email'),
    handlerInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('token is obligatory'),
    handlerInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('invalid token'),
    body('password').isLength({min: 8}).withMessage('the password is too short, it must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('password does not match')
        }
        return true
    }),
    handlerInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

//PROFILE ROUTES
router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('name is obligatory'),
    body('email').isEmail().withMessage('invalid email'),
    AuthController.updateProfile
)


router.post('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('current password is obligatory'),
    body('password').isLength({min: 8}).withMessage('the password is too short, it must be at least 8 characters'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('password does not match')
        }
        return true
    }),
    handlerInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('password is obligatory'),
    handlerInputErrors,
    AuthController.checkPassword
)
export default router

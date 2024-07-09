import { Router } from "express";
import {body, param} from 'express-validator'
import { AuthController } from "../controllers/AuthController";
import { handlerInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account',  
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('password').isLength({min: 8}).withMessage('La contraseña es demaisado corta, debe contener al menos 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    }),
    body('email').isEmail().withMessage('email no válido'),
    handlerInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('token es obligatorio'),
    handlerInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage('email no válido'),
    body('password').notEmpty().withMessage('password es obligatorio'),
    handlerInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().withMessage('email no válido'),
    handlerInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().withMessage('email no válido'),
    handlerInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('token es obligatorio'),
    handlerInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('token no válido'),
    body('password').isLength({min: 8}).withMessage('La contraseña es demaisado corta, debe contener al menos 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden')
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
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('email').isEmail().withMessage('email no válido'),
    AuthController.updateProfile
)


router.post('/update-password',
    authenticate,
    body('current_password').notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('password').isLength({min: 8}).withMessage('La contraseña es demaisado corta, debe contener al menos 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Las contraseñas no coinciden')
        }
        return true
    }),
    handlerInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('password es obligatorio'),
    handlerInputErrors,
    AuthController.checkPassword
)
export default router

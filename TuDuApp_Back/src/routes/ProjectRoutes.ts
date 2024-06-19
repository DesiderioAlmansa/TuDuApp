import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import {body, param} from 'express-validator'
import { handlerInputErrors } from "../middleware/validation";

const router = Router()


router.post('/',  
    body('name').notEmpty().withMessage('name is obligatory'),
    body('client').notEmpty().withMessage('client is obligatory'),
    body('description').notEmpty().withMessage('description is obligatory'),
    handlerInputErrors,
    ProjectController.createProject
)

router.get('/:id', 
    param('id').isMongoId().withMessage('Invalid ID'),
    handlerInputErrors,
    ProjectController.getProjectById
)

router.get('/', ProjectController.getProjects)

router.put('/:id', 
    param('id').isMongoId().withMessage('Invalid ID'),
    body('name').notEmpty().withMessage('name is obligatory'),
    body('client').notEmpty().withMessage('client is obligatory'),
    body('description').notEmpty().withMessage('description is obligatory'),
    handlerInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('Invalid ID'),
    handlerInputErrors,
    ProjectController.deleteProjectById
)

export default router
import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import {body, param} from 'express-validator'
import { handlerInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, validateTaskExists } from "../middleware/task";
import Task from "../models/Task";
import { authenticate } from "../middleware/auth";

const router = Router()

router.use(authenticate)

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

//TASK ROUTES
router.param('projectId', validateProjectExists)

router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('name is obligatory'),
    body('description').notEmpty().withMessage('description is obligatory'),
    handlerInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', validateTaskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handlerInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('name is obligatory'),
    body('description').notEmpty().withMessage('description is obligatory'),
    handlerInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    handlerInputErrors,
    TaskController.deleteTaskById
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('status').notEmpty().withMessage('state is obligatory'),
    handlerInputErrors,
    TaskController.updateStatus
)

export default router
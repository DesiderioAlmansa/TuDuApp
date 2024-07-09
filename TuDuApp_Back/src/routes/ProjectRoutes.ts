import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { TeamController } from "../controllers/TeamController";
import {body, param} from 'express-validator'
import { handlerInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, validateTaskExists } from "../middleware/task";
import Task from "../models/Task";
import { authenticate } from "../middleware/auth";
import { NoteController } from "../controllers/NoteController";

const router = Router()

router.use(authenticate)

router.post('/',  
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('client').notEmpty().withMessage('client es obligatorio'),
    body('description').notEmpty().withMessage('description es obligatorio'),
    handlerInputErrors,
    ProjectController.createProject
)

router.get('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    handlerInputErrors,
    ProjectController.getProjectById
)

router.get('/', ProjectController.getProjects)

router.put('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('client').notEmpty().withMessage('client es obligatorio'),
    body('description').notEmpty().withMessage('description es obligatorio'),
    handlerInputErrors,
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),
    handlerInputErrors,
    ProjectController.deleteProjectById
)

//TASK ROUTES
router.param('projectId', validateProjectExists)

router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('description').notEmpty().withMessage('description es obligatorio'),
    handlerInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', validateTaskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('ID de Tarea no válido'),
    handlerInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID de Tarea no válido'),
    body('name').notEmpty().withMessage('name es obligatorio'),
    body('description').notEmpty().withMessage('description es obligatorio'),
    handlerInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID de Tarea no válido'),
    handlerInputErrors,
    TaskController.deleteTaskById
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('ID de Tarea no válido'),
    body('status').notEmpty().withMessage('state es obligatorio'),
    handlerInputErrors,
    TaskController.updateStatus
)

//TEAM ROUTES
router.get('/:projectId/team',
    TeamController.getProjectTeam
)

router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('Email no válido'),
    handlerInputErrors,
    TeamController.findMemberByEmail
)


router.post('/:projectId/team',
    body('id').isMongoId().withMessage('ID no válido'),
    handlerInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('ID no válido'),
    handlerInputErrors,
    TeamController.removeMemberById
)


//NOTES ROUTES
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('Email no válido'),
    handlerInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID no válido'),
    handlerInputErrors,
    NoteController.deleteNote
)

export default router
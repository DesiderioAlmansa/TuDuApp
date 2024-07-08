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
    hasAuthorization,
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
    hasAuthorization,
    param('taskId').isMongoId().withMessage('Invalid task ID'),
    body('name').notEmpty().withMessage('name is obligatory'),
    body('description').notEmpty().withMessage('description is obligatory'),
    handlerInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
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

//TEAM ROUTES
router.get('/:projectId/team',
    TeamController.getProjectTeam
)

router.post('/:projectId/team/find',
    body('email').isEmail().toLowerCase().withMessage('invalid email'),
    handlerInputErrors,
    TeamController.findMemberByEmail
)


router.post('/:projectId/team',
    body('id').isMongoId().withMessage('invalid id'),
    handlerInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('invalid id'),
    handlerInputErrors,
    TeamController.removeMemberById
)


//NOTES ROUTES
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('invalid email'),
    handlerInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('invalid id'),
    handlerInputErrors,
    NoteController.deleteNote
)

export default router
import service from "@/lib/axios";
import { Project, Task, TaskFormData, taskSchema } from "../types";
import { isAxiosError } from "axios";


type TaskService = {
    formData: TaskFormData
    projectId: Project['_id']
    taskId: Task['_id']
}
export async function createTask({formData, projectId} : Pick<TaskService, 'formData'| 'projectId'>){
    try{
        const { data } = await service.post<string>(`/projects/${projectId}/tasks`, formData)
        return data 
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function getTaskById({projectId, taskId} : Pick<TaskService, 'projectId' | 'taskId'>){
    try{
        const { data } = await service(`/projects/${projectId}/tasks/${taskId}`)
        const response = taskSchema.safeParse(data)
        if(response.success){
            return response.data 
        }
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function updateTask({projectId, taskId, formData} : Pick<TaskService, 'projectId' | 'taskId' | 'formData'>){
    try{
        const { data } = await service.put<string>(`/projects/${projectId}/tasks/${taskId}`, formData)
        return data 
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function deleteTask({projectId, taskId} : Pick<TaskService, 'projectId' | 'taskId'>){
    try{
        const { data } = await service.delete<string>(`/projects/${projectId}/tasks/${taskId}`)
        return data 
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}
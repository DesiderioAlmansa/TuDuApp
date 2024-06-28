import service from "@/lib/axios";
import { Project, Task, TaskFormData } from "../types";
import { isAxiosError } from "axios";


type TaskService = {
    formData: TaskFormData
    projectId: Project['_id']
}
export async function createTask({formData, projectId} : Pick<TaskService, 'formData'| 'projectId'>){
    try{
        const { data } = await service.post<string>(`/projects/${projectId}/tasks`, formData)
        /*const response = dashboardProjectSchema.safeParse(data)
        if(response.success){
         return response.data
        }*/
       return data 
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}
import service from "@/lib/axios";
import { Project, ProjectFormData, dashboardProjectSchema } from "../types";
import { isAxiosError } from "axios";


export async function createProject(formData: ProjectFormData){
    try{
        const { data } = await service.post('/projects', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getProjects(){
    try{
       const { data } = await service('/projects')
       const response = dashboardProjectSchema.safeParse(data)
       if(response.success){
        return response.data
       }     
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}

export async function getProjectById(id : Project['_id']){
    try{
       const { data } = await service(`/projects/${id}`)   
       return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}
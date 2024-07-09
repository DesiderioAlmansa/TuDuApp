import service from "@/lib/axios";
import { Project, ProjectFormData, dashboardProjectSchema, editProjectSchema, projectSchema } from "../types";
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
       const response =  editProjectSchema.safeParse(data)
       if(response.success){
        return response.data
       }
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}

export async function getFullProjectDetails(id : Project['_id']){
    try{
       const { data } = await service(`/projects/${id}`)  
       const response =  projectSchema.safeParse(data)
       if(response.success){
        return response.data
       }
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}

type ProjectServiceType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectServiceType){
    try{
       const { data } = await service.put<string>(`/projects/${projectId}`, formData)   
       return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}

export async function deleteProject(id : Project['_id']){
    try{
       const { data } = await service.delete<string>(`/projects/${id}`)   
       return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }  
    }
}
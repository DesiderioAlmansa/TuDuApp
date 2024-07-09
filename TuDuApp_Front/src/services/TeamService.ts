import service from "@/lib/axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";
import { isAxiosError } from "axios";

export async function findUserByEmail({projectId, formData} : {projectId: Project['_id'], formData: TeamMemberForm}) {
    try{
        const { data } = await service.post(`/projects/${projectId}/team/find`, formData)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function addUserToProject({projectId, id} : {projectId: Project['_id'], id: TeamMember['_id']}) {
    try{
        const { data } = await service.post<string>(`/projects/${projectId}/team`, {id})
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function getTeam(projectId: Project['_id']) {
    try{
        const { data } = await service(`/projects/${projectId}/team`)
        const response = teamMembersSchema.safeParse(data)
        if(response.success){
            return response.data
        }
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function removeUserFromProject({projectId, userId} : {projectId: Project['_id'], userId: TeamMember['_id']}) {
    try{
        const { data } = await service.delete<string>(`/projects/${projectId}/team/${userId}`)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}
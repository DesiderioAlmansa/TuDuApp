import service from "@/lib/axios";
import { Note, NoteFormData, Project, Task } from "../types";
import { isAxiosError } from "axios";

type NoteServiceType = {
    formData: NoteFormData
    projectId: Project['_id']
    taskId: Task['_id']
    noteId: Note['_id']
}

export async function createNote({projectId, taskId, formData} : Pick<NoteServiceType, 'projectId' | 'taskId' | 'formData'>) {
    try{
        const { data } = await service.post<string>(`/projects/${projectId}/tasks/${taskId}/notes`, formData)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function deleteNote({projectId, taskId, noteId} : Pick<NoteServiceType, 'projectId' | 'taskId' | 'noteId'>) {
    try{
        const { data } = await service.delete<string>(`/projects/${projectId}/tasks/${taskId}/notes/${noteId}`)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

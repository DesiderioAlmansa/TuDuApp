import service from "@/lib/axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import { isAxiosError } from "axios";

export async function updateProfile(formData : UserProfileForm) {
    try{
        const { data } = await service.put<string>(`/auth/profile`, formData)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}

export async function changePassword(formData : UpdateCurrentUserPasswordForm) {
    try{
        const { data } = await service.post<string>(`/auth/update-password`, formData)
        return data
     } catch (error){
         if(isAxiosError(error) && error.response){
             throw new Error(error.response.data.error)
         }  
     }
}
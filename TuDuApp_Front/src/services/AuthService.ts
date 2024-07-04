import service from "@/lib/axios";
import { ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, UserLoginForm, UserRegistrationForm, userSchema } from "../types";
import { isAxiosError } from "axios";

export async function createAccount(formData: UserRegistrationForm){
    try{
        const { data } = await service.post<string>('/auth/create-account', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function confirmAccount(formData: ConfirmToken){
    try{
        const { data } = await service.post<string>('/auth/confirm-account', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function requestConfirmationCode(formData: RequestConfirmationCodeForm){
    try{
        const { data } = await service.post<string>('/auth/request-code', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function login(formData: UserLoginForm){
    try{
        const { data } = await service.post<string>('/auth/login', formData)
        localStorage.setItem('AUTH_TOKEN_TUDUAPP', data)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function forgotPassword(formData: ForgotPasswordForm){
    try{
        const { data } = await service.post<string>('/auth/forgot-password', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function validateToken(formData: ConfirmToken){
    try{
        const { data } = await service.post<string>('/auth/validate-token', formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function uptatePasswordWithToken({formData, token} : {formData: NewPasswordForm, token: ConfirmToken['token']}){
    try{
        const { data } = await service.post<string>(`/auth/update-password/${token}`, formData)
        return data
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}

export async function getUser(){
    try{
        const { data } = await service(`/auth/user`)
        const response = userSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error){
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error)
        }
    }
}
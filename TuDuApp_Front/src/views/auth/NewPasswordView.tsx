import NewPasswordForm from "@/components/auth/NewPasswordForm"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import { ConfirmToken } from "@/types/index"
import { useState } from "react"

export default function NewPasswordView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    const [isValidToken, setIsValidToken] = useState(false)

    return (
        <>
            <h1 className="text-4xl font-black text-white text-center">Reestablecer contraseña</h1>
            <p className="text-2xl font-light text-white mt-5 text-center">
            <span className=" text-emerald-300 font-bold">Inserta el código</span> que recibiste por email y se abrira el formulario{''}
                <span className=" text-emerald-300 font-bold"> para establecer tu nueva contraseña</span>
            </p>

            {!isValidToken ? 
                <NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/> : 
                <NewPasswordForm token={token}/>
            }
        </>
    )
}
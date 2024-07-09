import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
//import { useForm } from "react-hook-form";
import { confirmAccount } from "@/services/AuthService";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')
    
    //const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ConfirmToken>({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const handleChange = (token : ConfirmToken['token']) => setToken(token)
    

    const handleComplete = (token: ConfirmToken['token']) =>  mutate({token})
    

    return (
        <>
            <h1 className="text-4xl font-black text-white text-center">Confirma tu cuenta</h1>
            <p className="text-2xl font-light text-white mt-5 text-center">
                Ingresa el código que recibiste {''}
                <span className=" text-emerald-300 font-bold"> por e-mail</span>
            </p>

            <form
                className="space-y-8 p-10 rounded-lgmt-10"
            >
                <label
                    className="font-normal text-2xl text-center block text-white"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-5 text-7xl">
                    <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                        <PinInputField className="text-center w-20 h-25 p-3 rounded-lg border-gray-300 border placeholder-white"/>
                    </PinInput>
                </div>

            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <p className="text-center text-gray-300 font-normal">
                    ¿Necesitas un código? <Link to={'/auth/request-code'} className="text-fuchsia-600 cursor-pointer hover:text-fuchsia-700">Solicitar código</Link>
                </p>
            </nav>

        </>
    )
}
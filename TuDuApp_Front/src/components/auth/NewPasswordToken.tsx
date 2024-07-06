import { validateToken } from '@/services/AuthService';
import { ConfirmToken } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: React.Dispatch<React.SetStateAction<string>>
    setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {setToken(token)}
    const handleComplete = (token: ConfirmToken['token']) => {mutate({token})}

    return (
        <>
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
                    ¿Necesitas un código? <Link to={'/auth/forgot-password'} className="text-fuchsia-600 cursor-pointer hover:text-fuchsia-700">Solicitar código</Link>
                </p>
            </nav>
        </>
    )
}
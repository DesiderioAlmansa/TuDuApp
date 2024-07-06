import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgotPassword } from "@/services/AuthService";

export default function ForgotPasswordView() {
    const initialValues: ForgotPasswordForm = {
        email: ''
    }
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: forgotPassword,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            //navigate('/')
        }
      })


    const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)


    return (
        <>
            <h1 className="text-4xl font-black text-white text-center">¿Olvidaste tu contraseña?</h1>
            <p className="text-2xl font-light text-white mt-5 text-center">
                Introduce tu email y  {''}
                <span className=" text-emerald-300 font-bold"> sigue las instrucciones que llegarán a tu correo</span>
            </p>
            <form
                onSubmit={handleSubmit(handleForgotPassword)}
                className="space-y-8 p-10 mt-10 bg-white"
                noValidate
            >
                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                        htmlFor="email"
                    >Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "E-mail no válido",
                            },
                        })}
                    />
                    {errors.email && (
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value='Enviar Instrucciones'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>

            <nav className="mt-10 flex flex-col space-y-4">
                <p className="text-center text-gray-300 font-normal">
                    ¿Ya tienes cuenta? <Link to={'/auth/login'} className="text-fuchsia-600 cursor-pointer hover:text-fuchsia-700">Iniciar sesión</Link>
                </p>
                <p className="text-center text-gray-300 font-normal">
                    ¿No tienes cuenta? <Link to={'/auth/register'} className="text-fuchsia-600 cursor-pointer hover:text-fuchsia-700">Crear una</Link>
                </p>
            </nav>
        </>
    )
}
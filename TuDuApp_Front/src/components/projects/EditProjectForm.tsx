import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/services/ProjectService";
import { toast } from "react-toastify";

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: string
}

export default function EditProjectForm({data, projectId} : EditProjectFormProps) {

    const navigate = useNavigate()

    const {register, handleSubmit, formState:{errors}} = useForm({defaultValues: {  
        name: data.name,
        client: data.client,
        description: data.description
    }})

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})//Realizar consulta nueva para evitar datos cacheados
            queryClient.invalidateQueries({queryKey: ['editProject', projectId]})
            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData: ProjectFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Edita el proyecto a través del siguiente formulario:</p>

                <nav className="my-5 ">
                    <Link className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        to="/">
                        Volver a Mis proyectos
                    </Link>
                </nav>

                <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate>

                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />

                        
                    <input type="submit" value='Guardar cambios' className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white
                    uppercase font-bold cursor-pointer transition-colors" />
                </form>
            </div>
           
        </>
    )
}
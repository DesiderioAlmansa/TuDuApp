import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/services/ProjectService"

export default function ProjectDetailsView(){

    const navigate = useNavigate()

    const params = useParams()

    const projectId = params.projectId!

    const { data, isError, isLoading } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if(isLoading) return 'Loading...'
    if(isError) return <Navigate to='/404'></Navigate>
    if(data) return (
        <>
            <h1 className="text-5xl font-black">{data.name}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            <nav className="my-5 flex gap-3">
                <button className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl
                font-bold cursor-pointer transition-colors"
                onClick={() => navigate('?newTask=true')}>
                    Añadir tarea
                </button>
            </nav>
        </>
    )
}
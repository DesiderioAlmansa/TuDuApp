import { Navigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/services/ProjectService"
import EditProjectForm from "@/components/projects/EditProjectForm"

export default function EditProjectView(){

    const params = useParams()

    const projectId = params.projectId!

    const { data, isError, isLoading } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })

    if(isLoading) return 'Loading...'
    if(isError) return <Navigate to='/404'></Navigate>
    if(data) return <EditProjectForm/>
}
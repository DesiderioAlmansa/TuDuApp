import { getUser } from "@/services/AuthService";
import { useQuery } from "@tanstack/react-query";
import { getuid } from "process";

export const useAuth = () => {
    const {data, isError, isLoading} = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: 1,
        refetchOnWindowFocus: false
    })

    return {data, isError, isLoading}
}
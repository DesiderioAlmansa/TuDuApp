import axios from "axios"


const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

service.interceptors.request.use(config => {
    const tokenJWT = localStorage.getItem('AUTH_TOKEN_TUDUAPP')
    if(tokenJWT){
        config.headers.Authorization = `Bearer ${tokenJWT}`
    }
    return config
})

export default service
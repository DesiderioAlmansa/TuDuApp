import { CorsOptions } from 'cors'

export const corsConfig: CorsOptions = {
    origin: function(origin, callback){
        const whitelist = [process.env.FRONT_URL]

        if(whitelist.includes(origin)){
            callback(null, true)
        }
        else{
            callback(new Error('CORS Error'))
        }
    }
}
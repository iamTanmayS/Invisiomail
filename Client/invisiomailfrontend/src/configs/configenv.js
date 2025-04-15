const getEnv = (envfile) =>
{      try{
           return import.meta.env[envfile]
        }
       catch(e){
        log.error(e)
       }
}


const config = {
 
 Server:{
  serverUrl: getEnv("VITE_SERVER_DEV_URL")
 },
 
 }


export default config
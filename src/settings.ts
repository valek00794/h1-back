import {config} from 'dotenv'
config()
 
export const SETTINGS = {
    'PORT': process.env.PORT || 3000,
    'BASE-URL': "/hometask_01/api",
}

import {create} from 'zustand'
import axios from '../lib/axios'
import toast from "react-hot-toast"

export const useAuthStore = create((set, get)=>({
    user : null,
    loading : false,
    checkingAuth : true,
    signup : async ({name, email, password, confirmPassword}) => {
        set({loading : true})
        if(password !== confirmPassword){
            toast.error("Password do not match!")
        }
        try{
            const res = await axios.post("/auth/signup", {name, email, password})
            console.log("signup : ", res.data)
            set({user : res.data, loading : false})
            toast.success("Account created successfully")
        }catch(error){
            set({loading : false})
            toast.error( error.response.data.message || "An error occured in the signup")
            console.log(error)
        }
    },
    login : async ({email, password}) =>{
        set({loading : true})
        try{
            const res = await axios.post("/auth/login", {email, password})
            set({user : res.data, loading : false})
            toast.success("Logged in Successfully")
        }catch(error){
            set({loading : false})
            toast.error( error.response.data.message || "An error occured in the signup")
            console.log(error)
        }
    },
    checkAuth : async () =>{
        set({checkingAuth : true}) 
        try {
            const response = await axios.get('/auth/profile')
            set({user : response.data, checkingAuth : false})
        } catch (error) {
            set({checkingAuth : false, user : null})
            console.log(error.message)
        }
    },
    logout : async () =>{
        try{
            await axios.post('/auth/logout')
            set({user : null})
            toast.success("logout successfull")
        }catch(error){
            toast.error("logout failed")
            console.log(error.message)
        } 
    },refreshToken : async () => {
        // PREVENT MULTIPLE SIMULTANEOUS REFRESH ATTEMPTS
        if(get().checkingAuth) return 
        set({checkingAuth : true})
        try {
            const response = await axios.post("/auth/refresh-token")
            set({checkingAuth : false})
            return response.data
        } catch (error) {
            set({user : null, checkingAuth : false})
            throw error
        }
    }
}))

// AXIOS INTERCEPTOR FOR TOKEN REFRESH 
let refreshPromise = null
axios.interceptors.response.use(
    (response) => response, // if nothing is wrong it just move on 
    async (error) => {
        const orginalRequest = error.config
        if(error.response?.status === 401 && !orginalRequest._retry){
            orginalRequest._retry = true
            try {
                // IF A REFRESH IS ALREADY IN PROGRESS, WAIT FOR IT TO COMPLETE 
                if(refreshPromise){
                    await refreshPromise
                    return axios(orginalRequest)
                }

                // START A NEW REFRESH PROCESS
                refreshPromise = useAuthStore.get().refreshToken()
                await refreshPromise
                refreshPromise = null 

                return axios(orginalRequest)

            } catch (refreshError) {
                // IF REFRESH FAILS REDIRECT TO LOGIN OR HANDLE AS NEEDED 
                useAuthStore.getState().logout()
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)
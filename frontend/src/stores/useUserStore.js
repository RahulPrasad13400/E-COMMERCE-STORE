import {create} from 'zustand'
import axios from 'axios'
import toast from "react-hot-toast"

export const useAuthStore = create((set)=>({
    user : null,
    loading : false,
    checkingAuth : true,
    signup : async ({name, email, password, confirmPassword}) => {
        set({loading : true})
        if(password !== confirmPassword){
            toast.error("Password do not match!")
        }
        try{
            const res = await axios.post("/api/auth/signup", {name, email, password})
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
            const res = await axios.post("/api/auth/login", {email, password})
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
            const response = await axios.get('/api/auth/profile')
            set({user : response.data, checkingAuth : false})
        } catch (error) {
            set({checkingAuth : false, user : null})
            console.log(error.message)
        }
    },
    logout : async () =>{
        try{
            await axios.post('/api/auth/logout')
            set({user : null})
            toast.success("logout successfull")
        }catch(error){
            toast.error("logout failed")
            console.log(error.message)
        } 
    } 
}))

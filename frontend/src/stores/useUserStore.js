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
            console.log("hello")
            set({user : res.data.user, loading : false})
            toast.success("Account created successfully")
        }catch(error){
            set({loading : false})
            toast.error( error.response.data.message || "An error occured in the signup")
            console.log(error)
        }
    }
}))

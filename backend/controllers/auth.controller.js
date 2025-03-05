import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const {email, name, password} = req.body 
    try{
        // checking whether the email already exist 
        const userExists = await User.findOne({email})
        if(userExists){
            return res.status(400).json({
                success : false,
                message : "user with this email already exist!"
            })
        }

        // Saving to database 
        const user = await User.create({name, email, password})
        
        // sending a response back 
        res.status(201).json({
            user,
            message : "user created successfully!"
        })
        
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

export const login = async (req, res) =>{
    console.log("hello")
}

export const logout = async (req, res) =>{
    console.log("hello")
}    
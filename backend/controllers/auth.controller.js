import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt, { decode } from "jsonwebtoken";

const generateTokens = (userId) =>{
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN,{
        expiresIn : '15m'
    })

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN,{
        expiresIn : '7d'
    })

    return {accessToken, refreshToken}
}

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) =>{
    res.cookie("accessToken", accessToken, {
        httpOnly : true, // prevent XSS attacks 
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict", // prevent CSRF attacks
        maxAge : 15*60*1000 // expires in 15 min
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly : true, // prevent XSS attacks 
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict", // prevent CSRF attacks
        maxAge : 7*24*60*60*1000 // expires in 7 days 
    })
}

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

        const {accessToken, refreshToken} = generateTokens(user._id)
        await storeRefreshToken(user._id, refreshToken)
        setCookies(res, accessToken, refreshToken)

        
        // sending a response back 
        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        })
        
    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

export const login = async (req, res) =>{
    const {email, password} = req.body
    try{
        const user = await User.findOne({email})
        
        if(user && (await user.comparePassword(password))){
            const { accessToken, refreshToken } = generateTokens(user._id) 
            
            await storeRefreshToken(user._id, refreshToken)
            setCookies(res, accessToken, refreshToken)

            res.status(200).json({
                user : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            })
        }else{
            res.status(401).json({
                success : false,
                message : "Invalid email or password"
            })
        }
        
    }catch(error){
        console.log("error in login controller", error.message)
        res.status(500).json({
            message : error.message
        })
    }
}

export const logout = async (req, res) =>{
    try{
        const refreshToken = req.cookies.refreshToken
        if(refreshToken){
            const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
            await redis.del(`refresh_token:${decode.userId}`)
        }
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        res.json({
            message : "logged out successfully!"
        })
    }catch(error){
        console.log("Error in logout controller", error.message)
        res.status(500).json({
            message : "server errro",
            error : error.message
        })
    }
}    

// this will access the refresh token 
export const refreshToken = async (req, res) =>{
    try{
        const refreshToken = req.cookies.refreshToken
        if(!refreshToken){
            return res.status(401).json({
                message : "No Refresh Token Provided!"
            })
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

        if(storedToken !== refreshToken){
            return res.status(401).json({
                message : "invalid refresh token!"
            })
        }

        const accessToken = jwt.sign({userId : decoded.userId}, process.env.ACCESS_TOKEN, {expiresIn : "15m"})

        res.cookie("accessToken", accessToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "strict",
            maxAge : 15*60*1000
        })

        res.json({
            message : "Token refreshed successfully!"
        })

    }catch(error){
        console.log("Error in refresh token controller", error.message)
        res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}

export const getProfile = async (req, res) =>{
    try {
        res.json(req.user)
    } catch (error) {
        res.status(500).json({
            message : "Server Error",
            error : error.message
        })
    }
}
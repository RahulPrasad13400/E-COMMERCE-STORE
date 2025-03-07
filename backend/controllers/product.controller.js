import cloudinary from "../lib/cloudinary.js"
import { redis } from "../lib/redis.js"
import Product from "../models/product.model.js"

export const getAllProducts = async (req, res) =>{
    try{
        const products = await Product.find() 
        res.status(200).json({
            success : false,
            products
        })
    }catch(error){
        console.log("Error occured in the getAllProducts controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {

        // fetching from redis to increase the speed 
        let featuredProducts = await redis.get("featured_products")
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts)) // parse this because redis gonna store it as a string
        }

        // if not in redis, fetch from mongoDb
        featuredProducts = await Product.find({isFeatured : true}).lean()
        // instead of mongoDb objects lean return javascript objects which make the performance better 

        if(!featuredProducts){
            return res.status(400).json({
                message : "No featured products found!"
            })
        }

        // store in redis for feature quick access 
        await redis.set("featured_products", JSON.stringify(featuredProducts))

        res.status(200).json(featuredProducts)
 
    } catch (error) {
        console.log("Error occured in the getFeaturedProducts controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })  
    }
}

export const createProduct = async (req, res) =>{
    try {
        const {name, description, image, price, category} = req.body

        // saving image to cloudinary 
        let cloudinaryResponse = null;
        if(image){
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder : "products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image : cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        })

        res.status(201).json(product)

    } catch (error) {
        console.log("Error occured in the createProduct controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })          
    }
}
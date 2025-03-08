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

export const deleteProduct = async () =>{
    try {
        const product = await Product.findById(req.params.id)
        if(!product){
            return res.status().json({
                success : false,
                message : "Product not found!"
            })
        }

        // deleting the image from the cloudinary
        if(product.image){
            // this will get the id of the image 
            const publicId = product.image.split('/').pop().split('.')[0]
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`)
                console.log("Deleted image from cloudinary!")
            } catch (error) {
                console.log("Error deleting image from cloudinary", error.message)
            }
        }
        
        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({
            success : true,
            message : "Product deleted successfully!"
        })
        
    } catch (error) {
        console.log("Error occured in the deleteProduct controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })    
    }
}

export const getRecommendedProducts = async (req, res) =>{
    try {
        const products = await Product.aggregate([
            {
                $sample : {size : 3} // number of products 
            },
            {
                $project : {    // it should return those fields 
                    id : 1,
                    name : 1,
                    description : 1,
                    image: 1,
                    price : 1
                }
            }
        ])

        res.json(products)

    } catch (error) {
        console.log("Error occured in the getRecommendedProducts controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })       
    }
}

export const getProductsByCategory = async (req, res) =>{
    const {category} = req.params
    try {
        const products = await Product.find({category})
        res.json(products)
    } catch (error) {
        console.log("Error occured in the getCategoryProducts controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })   
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params)
        if(!product){
            product.isFeatured = !product.isFeatured
            const updatedProduct = await product.save()

            // update cache (redis)
            await updateFeaturedProductsCache()
            res.json(updatedProduct)
        }else{ 
            res.status(404).json({
                message : "Product not found!"
            })
        }

    } catch (error) {
        console.log("Error occured in the toggleFeaturedProduct controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })          
    }
}

async function updateFeaturedProductsCache(){
    try {
        const featuredProducts = await Product.find({isFeatured : true}).lean()
        await redis.set("featured_products", JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("Error in updateFeaturedProductsCache function")
    }
}
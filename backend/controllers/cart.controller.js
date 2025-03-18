import Product from "../models/product.model.js"

export const getCartProducts = async (req, res) =>{
    try {
		// Step 1: Retrieve products from the database that are in the user's cart
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// Step 2: Add quantity to each product based on the user's cart
		const cartItems = products.map((product) => {
			// Find the product in the user's cart and extract its quantity
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			// Return the product with its details and quantity
			return { ...product.toJSON(), quantity: item.quantity };
		});

        res.status(200).json(cartItems)
        
    } catch (error) {
        console.log("Error occured in the getCartProducts controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })         
    }
}

export const addToCart = async (req, res) =>{
    try {
        const {productId} = req.body
        const user = req.user
        const existingItem = user.cartItems.find((item) => item._id.toString() === productId);
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId)
        }

        await user.save()

        res.status(200).json(user.cartItems)

    } catch (error) {
        console.log("Error occured in the addToCart  controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })   
    }
}

export const removeAllFromCart = async (req, res) =>{
    try {
        const {productId} = req.params
        const user = req.user
        if(!productId){
            user.cartItems = []
        }else{
            user.cartItems = user.cartItems.filter(item=>item.id !== productId)
        }

        await user.save()
        res.status(200).json(user.cartItems)
        
    } catch (error) {
        console.log("Error occured in the removeAllFromCart controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })         
    }
}

export const updateQuantity = async (req, res) =>{
    try {
        const {id : productId} = req.params
        const {quantity} = req.body
        const user = req.user
        const existingItem = user.cartItems.find(item=>item.id === productId)
        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item=>item.id !== productId)
                await user.save()
                return res.status(200).json(user.cartItems)
            }
            existingItem.quantity = quantity
            await user.save()
            return res.status(200).json(user.cartItems)
        }else{
            res.status(404).json({
                message : "Product not found!"
            })
        }

    } catch (error) {
        console.log("Error occured in the updateQuantity controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })          
    }
}
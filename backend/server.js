// type : "module" in the package.json allow to use the import syntax 
import express from "express"
import dotenv from "dotenv" // To read the values from .env 
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import { conntectDB } from "./lib/db.js"

dotenv.config() // To read the values from .env
const app = express()
app.use(express.json()) // req.body il ulla values read cheyyan 
app.use(cookieParser())

const PORT = process.env.PORT || 5000 

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)

app.listen(PORT,()=>{
    console.log(`server started running on the ${PORT}`)
    conntectDB()
})
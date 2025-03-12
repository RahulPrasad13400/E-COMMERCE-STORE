// type : "module" in the package.json allow to use the import syntax 
import express from "express"
import dotenv from "dotenv" // To read the values from .env 
import cookieParser from "cookie-parser"

// import cors from "cors"


import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"
import { conntectDB } from "./lib/db.js"

dotenv.config() // To read the values from .env
const app = express()
app.use(express.json()) // req.body il ulla values read cheyyan 
app.use(cookieParser())

// app.use(cors({
//     origin: 'http://localhost:5173',
//   }));

const PORT = process.env.PORT || 5000 

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/analytics', analyticsRoutes)

app.listen(PORT,()=>{
    console.log(`server started running on the ${PORT}`)
    conntectDB()
})
import { stripe } from "../lib/stripe.js"
import Coupon from "../models/coupon.model.js"
import Order from "../models/order.model.js"

export const createCheckoutSession = async (req, res) =>{
    try {
        const {products, couponCode} = req.body
        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({
                error : "invalid or empty products array!"
            })
        }

        let totalAmout = 0
        const lineItems = products.map((product)=>{
            const amount = Math.round(product.price*100) // strip want to send the amount in the format of cents 
            totalAmout+=amount*product.quantity

            return {
                price_data : {
                    currency : "usd",
                    product_data : {
                        name  : product.name,
                        images : [product.image],
                    },
                    unit_amount:amount
                },
                quantity : product.quantity || 1
            }
        })

        let coupon = null 
        if(couponCode){
            coupon = await Coupon.findOne({code : couponCode, userId : req.user._id, isActive : true})
            if(coupon){
                totalAmout -= Math.round(totalAmout * coupon.discountPercentage /100)
            }
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types : ["card"],
            line_items : lineItems,
            mode : "payment",
            success_url : `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`${process.env.CLIENT_URL}/purchase-cancel`,
            discounts : coupon ? [
                {
                    coupon : await createStripeCoupon(coupon.discountPercentage)
                }
            ] : [],
            metadata : {
                userId : req.user._id.toString(),
                couponCode : couponCode || "",
                products : JSON.stringify(products.map((p)=>{
                    return {
                        id : p._id,
                        quantity : p.quantity,
                        price : p.price 
                    }
                }))
            }
        })
        
        // creating a new coupon for purchase above the price 
        if(totalAmout > 20000){
            await createNewCoupon(req.user._id)
        }

        res.status(200).json({
            id : session.id,
            totalAmout : totalAmout /100
        })

    } catch (error) {
        console.log("Error occured in the createCheckoutSession controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })          
    }
}

async function createStripeCoupon(discountPercentage){
    const coupon = await stripe.coupons.create({
        percent_off : discountPercentage,
        duration : "once"
    })

    return coupon.id
}       

async function createNewCoupon(userId){ 

    // console.log(userId)

    // To delete the previous coupon
    await Coupon.findOneAndDelete({ userId: userId });
    
    const newCoupon = new Coupon({
        code : "GIFT" + Math.random().toString().substring(2, 8).toUpperCase(),
        discountPercentage : 10,
        expirationDate : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now 
        userId : userId
    })
    await newCoupon.save()
    return newCoupon
}

export const checkoutSuccess = async(req, res)=>{
    try {
        const {sessionId} = req.body
        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if(session.payment_status === "paid"){
            // updating the coupon
            if(session.metadata.couponCode){
                await Coupon.findOneAndUpdate({code : session.metadata.couponCode, userId : session.metadata.userId}, {isActive : false})
            }

            // create a new Order
            const products = JSON.parse(session.metadata.products)
            const newOrder = new Order({
                user : session.metadata.userId,
                products : products.map((product)=>{
                    return {
                        product : product.id,
                        quantity : product.quantity,
                        price : product.price 
                    }
                }),
                totalAmount : session.amount_total / 100,    // convert from cents to dollars 
                stripeSessionId : sessionId
            })  
            
            await newOrder.save()

            res.status(200).json({
                success : true,
                message : "Paymeny successfully, order created, and coupon was deactivated if used.",
                orderId : newOrder._id
            })
            
        }
    } catch (error) {
        console.log("Error processing successfull checkout : ",error.message)
        res.status(500).json({
            message : "Error processing successfull checkout",
            error : error.message
        })   
    }
}
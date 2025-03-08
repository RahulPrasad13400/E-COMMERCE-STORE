import { stripe } from "../lib/stripe.js"
import Coupon from "../models/coupon.model.js"

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
                }
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
                couponCode : couponCode || ""
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
    const newCoupon = new Coupon({
        code : "GIFT" + Math.random().toString().substring(2, 8).toUpperCase(),
        discountPercentage : 10,
        expirationDate : new Date(new Date() + 30*24*60*60*1000), // 30 days from now 
        userId : userId
    })
    await newCoupon.save()
    return newCoupon
}
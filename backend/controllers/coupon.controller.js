import Coupon from "../models/coupon.model.js"

export const getCoupon = async (req, res) =>{
    try {
        const coupons = await Coupon.findOne({userId : req.user._id, isActive : true})

        res.status(200).json(coupons || null )

    } catch (error) {
        console.log("Error occured in the getCoupon controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })           
    }
}

export const validateCoupon = async (req, res) =>{
    try {
        const {code} = req.body
        const coupon = await Coupon.findOne({code : code, isActive : true, userId : req.user._id})
        if(!coupon){
            res.status(404).json({
                message : "Coupon not found!"
            })
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false 
            await coupon.save() 
            return res.status(404).json({
                message : "Coupon expired!"
            })     
        }

        res.status(200).json({
            message : "Coupon is valid!",
            code : coupon.code,
            discountPercentage : coupon.discountPercentage
        })

    } catch (error) {
        console.log("Error occured in the validateCoupon controller : ",error.message)
        res.status(500).json({
            message : "server error",
            error : error.message
        })         
    }
}
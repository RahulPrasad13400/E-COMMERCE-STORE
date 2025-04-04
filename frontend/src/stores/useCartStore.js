import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast"
import { isCancel } from "axios";

export const useCartStore = create((set, get)=>({
    cart : [],
    loading : false,
    coupon : null,
    total : 0, 
    subTotal : 0,
    isCouponApplied : false,

    getMyCoupon : async () => {
        try {
            const response = await axios.get('/coupons')
            set({coupon : response.data})
        } catch (error) {
           console.log("Error fetching the coupon", error) 
        }
    },
    applyCoupon : async (code) => {
        try {
            const response = await axios.post("/coupons/validate", {code})
            set({coupon : response.data, isCouponApplied : true})
            get().calculateTotals()
            toast.success("coupon applied")
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to apply coupon")
        }
    },
    removeCoupon : async () => {
        set({coupon : null, isCouponApplied : false})
        get().calculateTotals()
        toast.success("coupon removed!")
    },
    getCartItems : async () => {
        try {
            const response = await axios.get(`/cart`)
            set({cart : response.data})  
            get().calculateTotals()          
        } catch (error) {
            set({cart : []})
            toast.error(error.response.data.message || "An Error Occured in the getCartItems!")
        }
    },
    clearCart : async () => {
        set({cart : [], coupon : null, total : 0, subTotal : 0})
    },
    addToCart : async (product) => {
        try {
            await axios.post(`/cart`, {productId : product._id})
            toast.success("Product added to Cart")

            set((prevState)=>{
                const existingItem = prevState.cart.find((item) => item._id.toString() === product._id)
                const newCart = existingItem ? prevState.cart.map((item)=>item.id === product._id ? {...item, quantity : item.quantity + 1} : item) : [...prevState.cart, {...product, quantity : 1}]
                return {cart : newCart}
            })
            get().calculateTotals()  

        } catch (error) {
            toast.error(error.message)
        }
    },
    removeFromCart : async (productId) => {
        console.log(productId)
        await axios.delete(`/cart`, {data : {productId}})
        set((prevState)=>({cart : prevState.cart.filter(item=>item._id !== productId)}))
        get().calculateTotals()
    },
    updateQuantity : async (productId, quantity) => {
        if(quantity === 0){
            get().removeFromCart(productId)
            return 
        }
        await axios.put(`/cart/${productId}`, {quantity})
        set((prevState)=>({cart : prevState.cart.map(item=>item._id === productId ? {...item, quantity} : item)}))
        get().calculateTotals()
    },
    calculateTotals : () =>{
        const { cart, coupon } = get()
        const subTotal = cart.reduce((sum, item)=> sum + item.price * item.quantity ,0)
        let total = subTotal

        if(coupon){
            const discount = subTotal * (coupon.discountPercentage / 100)
            total = subTotal - discount
        }

        set({subTotal, total})
    }       
}))
import axios from "../lib/axios"
import toast from "react-hot-toast"
import {create} from "zustand"

export const useProductStore = create((set)=>({
    products : [],
    loading : false,
    setProducts : (products) => set({products}),
    createProduct : async (productData) => {
        set({loading : true})
        try {
            const res = await axios.post('/products', productData)
            set((prevState)=>({
                products : [...prevState.products, res.data],
                loading : false 
            }))
            toast.success("Product Created")
        } catch (error) {
            set({loading : false})
            toast.error( error.response.data.error || "An error occured in the createProduct")
            console.log(error)
        }
    }
}))
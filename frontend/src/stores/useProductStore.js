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
    },
    fetchAllProducts : async () => {
        set({loading : true})
        try {
            const response = await axios.get("/products")
            set({products : response.data.products, loading : false})
        } catch (error) {
            set({loading : false})
            toast.error( error.response.data.error || "An error occured in the fetchAllProducts")
            console.log(error)
        }
    },
    deleteProduct : async (productId) => {
        set({loading : true})
        try {
            await axios.delete(`/products/${productId}`)
            set((prevProducts)=>({
                products : prevProducts.products.map((product)=> product._id !== productId),
                loading : false
            }))
        } catch (error) {
            set({loading : false})
            toast.error( error.response.data.error || "An error occured in the deleteProduct")
            console.log(error)  
        }
    },
    toggleFeaturedProduct : async (productId) => { 
        set({loading : true})
        try {
            const response = await axios.patch(`/products/${productId}`)
            set((prevProducts)=>({
                products : prevProducts.products.map(
                    (product) => product._id === productId ? {...product, isFeatured : response.data.updatedProduct.isFeatured} : product),
                    loading : false 
            }))
        } catch (error) {
            set({loading : false})
            toast.error(error.message)
            console.log(error)     
        }  
    }
}))
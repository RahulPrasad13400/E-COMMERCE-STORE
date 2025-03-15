import { useState } from "react"
import { motion } from "framer-motion"
import { PlusCircle, Upload, Loader } from "lucide-react"
import { useProductStore } from "../stores/useProductStore";

const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];

export default function CreateProductForm() {
    const [newProduct, setNewProduct] = useState({
        name : "",
        description : "",
        price : "",
        category : "",
        image : ""
    })
    // const loading = false 
    const {createProduct, loading} = useProductStore()

    async function handleSubmit(e){
        e.preventDefault()
        try {
            await createProduct(newProduct)
            setNewProduct({ name : "", description : "", price : "", category : "", image : ""})
        } catch {
            console.log("Error creating a Product!")
        }
    }

    function handleImageChange(e){
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onloadend = () =>{
                setNewProduct({...newProduct, image : reader.result})
            }
            reader.readAsDataURL(file)
        }
    }

    return (
        <motion.div className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto' 
                    initial={{opacity : 0, y : 20}}
                    animate={{opacity : 1, y : 0}}
                    transition={{duration : 0.8}}>
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Create New Products</h2>
            
            <form onSubmit={handleSubmit} className='space-y-4'> 
                <div>
                    <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
                        Product Name
                    </label>
                    <input type="text" id="name" name="name" value={newProduct.name} required
                    	className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                        px-3 text-white focus:outline-none focus:ring-2
                        focus:ring-emerald-500 focus:border-emerald-500'
                        onChange={(e)=>setNewProduct({...newProduct, name : e.target.value})}/>
                </div>

                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-300'>
                        Description
                    </label>
                    <textarea type="text" id="description" name="description" value={newProduct.description} required
                    	className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                        px-3 text-white focus:outline-none focus:ring-2
                        focus:ring-emerald-500 focus:border-emerald-500'
                        onChange={(e)=>setNewProduct({...newProduct, description : e.target.value})}/>
                </div>

                <div>
                    <label htmlFor="price" className='block text-sm font-medium text-gray-300'>
                        Price
                    </label>
                    <input type="number" id="price" name="price" value={newProduct.price} required
                    	className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                        px-3 text-white focus:outline-none focus:ring-2
                        focus:ring-emerald-500 focus:border-emerald-500'
                        onChange={(e)=>setNewProduct({...newProduct, price : e.target.value})}/>
                </div>

                <div>
                    <label htmlFor="category" className='block text-sm font-medium text-gray-300'>Category</label>
                    <select id="category" name="category" value={newProduct.category} 
                     onChange={(e)=>setNewProduct({...newProduct, category : e.target.value})}
                     className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                     shadow-sm py-2 px-3 text-white focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                     required >
                        <option value="">Select a Category</option>
                        {categories.map((category)=>{
                            return <option key={category} value={category}>{category}</option>
                        })}
                    </select>
                </div>
                        {/* onChange={handleImageChange} */}
                <div>
                    <input type='file' id="image" accept='image/*' className='sr-only' onChange={handleImageChange} />   
                    <label htmlFor="image" className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 
                      rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none 
                      focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'>
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Upload Image
                    </label>
                    {newProduct.image && <span className='ml-3 text-sm text-gray-400'>Image Uploaded</span>}
                </div>

                <button type="submit" disabled={loading} className='w-full flex justify-center py-2 px-4 border 
                    border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'>
                    {loading ? <>
                        <Loader aria-hidden='true' className='mr-2 h-5 w-5 animate-spin' />
                        {/* aria-hidden='true': This attribute is used to hide the element from screen readers, as it is purely decorative and doesn't need to be announced. */}
                        Loading
                    </> : <>
                        <PlusCircle className='mr-2 h-5 w-5' />
                        Create Product
                    </>}
                </button>
            </form>
        </motion.div>
    )
}

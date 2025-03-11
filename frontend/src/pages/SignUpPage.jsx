import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react"
import { animate, motion } from "framer-motion"

export default function SignUpPage() {
  const loading = true 
  const [formData, setFormData] = useState({
    name : '',
    email : '',   
    password : '',
    confirmPassword : ''
  })

  const handleSubmit = (e) =>{
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <motion.div initial={{opacity : 0, y : -20}}
                  animate={{opacity : 1, y : 0}}
                  transition={{duration : 0.8, delay : 0.2}}
                  className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-emerald-400'>Create Your Account</h2>
      </motion.div>
      <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'
                  initial={{opacity : 0, y : 20}}
                  animate={{opacity : 1, y : 0}}
                  transition={{duration : 0.8, delay : 0.2}}>
        <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form onSubmit={handleSubmit} className='space-y-6 '>
                  <div>
                      <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Full Name
                      </label>
                      <div className='mt-1 relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									            <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								          </div>
                          <input type="text" className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									       placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                            id='name' required value={formData.name} placeholder='Jon Snow'
                            onChange={(e)=>setFormData({...formData, name : e.target.value})}/>
                      </div>
                  </div>

                  <div>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
                        Email Address
                      </label>
                      <div className='mt-1 relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									            <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								          </div>
                          <input type="email" className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									       placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                            id='email' required value={formData.email} placeholder='theNorthRemembers@gmail.com'
                            onChange={(e)=>setFormData({...formData, email : e.target.value})}/>
                      </div>
                  </div>

                  <div>
                      <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                        Password
                      </label>
                      <div className='mt-1 relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									            <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								          </div>
                          <input type="password" className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									       placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                            id='password' required value={formData.password} placeholder='Password'
                            onChange={(e)=>setFormData({...formData, password : e.target.value})}/>
                      </div>
                  </div>

                  <div>
                      <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>
                        Confirm Password
                      </label>
                      <div className='mt-1 relative rounded-md shadow-sm'>
                          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									            <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
								          </div>
                          <input type="password" className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm
									       placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm' 
                            id='confirmPassword' required value={formData.confirmPassword} placeholder='Confirm Password'
                            onChange={(e)=>setFormData({...formData, confirmPassword : e.target.value})}/>
                      </div>
                  </div>
            </form>  
        </div>              
      </motion.div>
    </div>
  )
}

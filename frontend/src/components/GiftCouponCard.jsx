import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function GiftCouponCard() {
    const [userInputCode, setUserInputCode] = useState('')
    
    return (
    <motion.div className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }} >
		<div className='space-y-4'>
		    <div>
				<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
					Do you have a voucher or gift card?
				</label>
                <input type='text' id='voucher' className='block w-full rounded-lg border border-gray-600 bg-gray-700 
                  p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
                focus:ring-emerald-500' placeholder='Enter code here' value={userInputCode}
				  onChange={(e) => setUserInputCode(e.target.value)} required />

            </div>
        </div>    
    </motion.div>
  )
}

import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from '../lib/axios'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

export default function PeopleAlsoBought() {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(function(){
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`/products/recommendations`)
        setRecommendations(res.data)
      } catch (error) {
        toast.error("An error occured in Fetch Recommendation", error.res.data.message)
      } finally {
        setIsLoading(false)
      }

    }
    fetchRecommendations()
  },[])

  if(isLoading) return <LoadingSpinner />

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>
        People Also Bought
      </h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
        {recommendations.map((product) => {
          return <ProductCard key={product.id} product={product} />
        })}
      </div>
    </div>
  )
}

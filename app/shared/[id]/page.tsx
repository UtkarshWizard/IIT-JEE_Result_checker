'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ResultCard from '@/app/components/ResultCard' 
import NotFound from '@/app/components/NotFound'
import { getSharedLinkById } from '@/lib/helpers'
import { findResultByHallTicket } from '@/lib/utils'
import { Student } from '@/lib/types'

export default function SharedResultPage() {
  const params = useParams()
  const router = useRouter()
  const [result, setResult] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  
  useEffect(() => {
    const fetchSharedResult = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const shareId = params.id as string
        const link = getSharedLinkById(shareId)
        
        if (!link) {
          setError('The shared link does not exist or has expired')
          return
        }

        if (new Date() > link.expiresAt) {
          setError('This shared link has expired')
          return
        }
        
        const result = await findResultByHallTicket(link.hallTicket)
        if (!result) {
          setError('Result not found for this shared link')
          return
        }
        
        setResult(result)

        const updateTimer = () => {
          const now = new Date()
          const diffMs = link.expiresAt.getTime() - now.getTime()
          
          if (diffMs <= 0) {
            setTimeRemaining('Expired')
            clearInterval(intervalId)
            return
          }
          
          const diffMins = Math.floor(diffMs / 60000)
          const diffSecs = Math.floor((diffMs % 60000) / 1000)
          setTimeRemaining(`${diffMins}:${diffSecs < 10 ? '0' + diffSecs : diffSecs}`)
        }
        
        updateTimer()
        const intervalId = setInterval(updateTimer, 1000)
        
        return () => clearInterval(intervalId)
      } catch (err) {
        console.log(err)
        setError('An error occurred while fetching the shared result')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSharedResult()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-lg">Loading shared result...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <NotFound 
            message={error || "This shared result link has expired or is invalid"} 
            onBack={() => router.push('/')} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded">
          <p className="font-medium">You are viewing a shared result</p>
          <p className="text-sm">This link will expire in {timeRemaining}</p>
        </div>
        
        <div id="shared-result-card">
          <ResultCard 
            student={result}
            isShared={true}
          />
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            &larr; Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}
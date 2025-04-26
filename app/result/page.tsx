'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import ResultCard from '../components/ResultCard' 
import NotFound from '../components/NotFound'
import { findResultByHallTicket } from '@/lib/utils'
import { Student } from '@/lib/types'

export const dynamic = 'force-dynamic';

function ResultPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const hallTicket = searchParams.get('hallTicket')
    if (!hallTicket) {
      router.push('/')
      return
    }

    const fetchResult = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const data = await findResultByHallTicket(hallTicket)
        if (data) {
          setResult(data)
        } else {
          setError('No result found for the provided hall ticket number')
        }
      } catch (err) {
        console.error('Error fetching result:', err)
        setError('An error occurred while fetching the result')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-lg">Loading result data...</p>
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
            message={error || "No result data found."} 
            onBack={() => router.push('/')} 
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div id="result-card">
          <ResultCard student={result} />
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            &larr; Back to Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultPageContent />
    </Suspense>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertCircle } from 'lucide-react'

export default function SearchForm() {
  const [hallTicketNumber, setHallTicketNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateHallTicket = (value: string): boolean => {
    return /^HT\d{6}$/.test(value);
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedValue = hallTicketNumber.trim().toUpperCase()
    
    if (!trimmedValue) {
      setError('Please enter your hall ticket number')
      return
    }
    
    if (!validateHallTicket(trimmedValue)) {
      setError('Please enter a valid hall ticket number')
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      router.push(`/result?hallTicket=${trimmedValue}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:shadow-xl">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 py-4 px-6">
        <h2 className="text-white text-xl font-bold">Check Your JEE Result</h2>
        <p className="text-blue-100 text-sm mt-1">Enter your hall ticket number below</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-4">
          <label htmlFor="hallTicketNumber" className="block text-gray-700 text-sm font-medium mb-2">
            Hall Ticket Number *
          </label>
          <div className="relative">
            <input
              type="text"
              id="hallTicketNumber"
              value={hallTicketNumber}
              onChange={(e) => {
                setHallTicketNumber(e.target.value.toUpperCase())
                if (error) setError(null)
              }}
              placeholder="e.g.- HT137816"
              className={`w-full px-4 py-2 border ${
                error ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              autoComplete="off"
            />
            <div className="absolute right-3 top-2.5 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
          {error && (
            <div className="mt-2 text-red-600 text-sm flex items-start">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'Check Result'
            )}
          </button>
        </div>
        
      </form>
    </div>
  )
}
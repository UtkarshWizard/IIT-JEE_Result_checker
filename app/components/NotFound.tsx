import { AlertTriangle } from 'lucide-react'

interface NotFoundProps {
  message?: string
  onBack?: () => void
}

export default function NotFound({ 
  message = "We couldn't find any result with the provided hall ticket number.",
  onBack 
}: NotFoundProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-red-600 py-4 px-6 text-white">
        <h2 className="text-xl font-bold">Result Not Found</h2>
      </div>
      
      <div className="p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <p className="text-gray-700 mb-6">{message}</p>
        
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        )}
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 border-t">
        <p>If you believe this is an error, please contact the examination authorities.</p>
      </div>
    </div>
  )
}
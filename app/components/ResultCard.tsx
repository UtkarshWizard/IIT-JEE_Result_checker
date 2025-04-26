'use client'

import { useState } from 'react'
import { Student } from '@/lib/types' 
import { calculatePercentage, generateShareLink, storeSharedLink } from '@/lib/helpers' 
import { Download, Share2, CheckCircle, XCircle } from 'lucide-react'
import { jsPDF } from 'jspdf'
import * as htmlToImage from 'html-to-image'

interface ResultCardProps {
  student: Student
  isShared?: boolean
}

const totalMaxMarks = 210

export default function ResultCard({ student, isShared = false }: ResultCardProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  
  const totalPercentage = calculatePercentage(student.totalMarks, totalMaxMarks)
  
  const handleDownload = async (format: 'pdf' | 'jpeg') => {
    try {
      const element = document.getElementById('result-card');
      if (!element) return;
  
      const clone = element.cloneNode(true) as HTMLElement;
  
      // clone.style.backgroundColor = '#ffffff';
      // clone.style.color = '#000000';
  
      clone.querySelectorAll('*').forEach((child) => {
        const el = child as HTMLElement;
        if (el.style.color.includes('oklch')) el.style.color = '#000000';
        if (el.style.backgroundColor.includes('oklch')) el.style.backgroundColor = '#ffffff';
        if (el.style.borderColor.includes('oklch')) el.style.borderColor = '#000000';
      });
  
      // clone.style.position = 'absolute';
      // clone.style.left = '-9999px';
      document.body.appendChild(clone);
  
      const dataUrl = await htmlToImage.toJpeg(clone, { quality: 1.0, backgroundColor: '#ffffff' });
  
      document.body.removeChild(clone);
  
      if (format === 'pdf') {
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const pdfHeight = (img.height * pdfWidth) / img.width;
          pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`JEE_Result_${student.hallTicket}.pdf`);
        }
      } else {
        const link = document.createElement('a');
        link.download = `JEE_Result_${student.hallTicket}.jpeg`;
        link.href = dataUrl;
        link.click();
      }
  
    } catch (err) {
      console.error('Error generating download:', err);
      alert('An error occurred while generating the download. Please try again.');
    }
  };
  
  
  const handleShare = async () => {
    if (isShared) {
      alert('This is already a shared view. You can copy the URL from the address bar to share it again.')
      return
    }
    
    setIsSharing(true)
    
    try {
      const link = generateShareLink(student.hallTicket , student.id)
      storeSharedLink(link)
      
      const url = `${window.location.origin}/shared/${link.id}`
      setShareUrl(url)

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
      
      await navigator.clipboard.writeText(url)
      alert('Share link has been copied to clipboard!')
    } catch (err) {
      console.error('Error sharing result:', err)
      alert('An error occurred while generating the share link. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }
  
  return (
    <div id="result-card" className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 py-4 px-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">JEE Result</h2>
          <p className="text-blue-100 text-sm">Joint Entrance Examination</p>
        </div>
        <div className="flex items-center space-x-2">
          {student.passed ? (
            <div className="text-green-300 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>Qualified</span>
            </div>
          ) : (
            <div className="text-red-300 flex items-center text-sm">
              <XCircle className="w-4 h-4 mr-1" />
              <span>Not Qualified</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Student Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hall Ticket Number</p>
                <p className="font-medium">{student.hallTicket}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rank</p>
                <p className="font-medium text-blue-700">{student.rank.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">All India Rank</p>
              <p className="text-2xl font-bold text-blue-800">{student.rank}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Marks Details</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks Obtained
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maximum Marks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentile
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Physics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.physicsMarks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">70</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculatePercentage(student.physicsMarks , 70).toFixed(2)}%</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Chemistry</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.chemistryMarks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">70</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculatePercentage(student.chemistryMarks , 70).toFixed(2)}%</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Maths</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.mathMarks}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">70</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{calculatePercentage(student.mathMarks , 70).toFixed(2)}%</div>
                    </td>
                  </tr>
                <tr className="bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {student.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {totalMaxMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {totalPercentage.toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {student.passed && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-1">Counseling Information</h4>
            <p className="text-sm text-green-700">
              Congratulations! You have qualified for counseling.
              Please prepare all original documents.
            </p>
          </div>
        )}

        {shareUrl && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-1">Shareable Link Generated</h4>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 text-sm p-2 border border-gray-300 rounded bg-white"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <div className="text-xs text-blue-700 whitespace-nowrap">
                Expires in: <span className="font-semibold">{timeRemaining}</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="sm:w-1/2">
            <p className="text-sm text-gray-600 mb-2">Download Result</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('pdf')}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" />
                PDF
              </button>
              <button
                onClick={() => handleDownload('jpeg')}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-1" />
                JPEG
              </button>
            </div>
          </div>
          
          {!isShared && (
            <div className="sm:w-1/2">
              <p className="text-sm text-gray-600 mb-2">Share Result (expires in 1 hour)</p>
              <button
                onClick={handleShare}
                disabled={isSharing}
                className={`w-full bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center ${
                  isSharing ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSharing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Link...
                  </span>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-1" />
                    Generate Share Link
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 border-t">
        <p>This result card is computer generated and doesn't require signature.</p>
        <p>For verification, please visit the official JEE website or contact examination authorities.</p>
      </div>
    </div>
  )
}
import { Header } from "./Header";
import { GraduationCap, Search, Download, Clock } from 'lucide-react'
import SearchForm from './Formcard' 

export default function Home() {
  return (
    <>
    <Header />
      <div className="py-16 bg-gradient-to-b from-blue-900 to-indigo-800 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-center mb-4">IIT JEE Result Portal</h1>
          <p className="text-xl text-center text-blue-100 max-w-2xl mx-auto">
            Check your Joint Entrance Examination results, download scorecards, and access counseling information.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="-mt-16 mb-12">
            <SearchForm />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Check Result</h3>
              <p className="text-gray-600">
                Enter your hall ticket number to check your IIT JEE examination result instantly.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Download Result</h3>
              <p className="text-gray-600">
                Download your result in PDF or JPEG format for your records and future reference.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Result</h3>
              <p className="text-gray-600">
                Generate a temporary link to share your result with others. Links expire in 1 hour.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Important Information</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India. 
                It is constituted by two different examinations: JEE Main and JEE Advanced.
              </p>
              <p>
                <strong>JEE Main:</strong> The first stage for admission to NITs, IIITs, CFTIs, and other institutions.
                <br />
                <strong>JEE Advanced:</strong> The second stage for admission to Indian Institutes of Technology (IITs).
              </p>
              <p>
                For any queries regarding the examination or results, please contact the examination authorities or visit the official JEE website.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="mr-4">
                <GraduationCap className="w-8 h-8 text-blue-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Top Performers Recognition</h3>
                <p className="text-gray-700">
                  Congratulations to all students who have performed exceptionally well in JEE this year! 
                  Top performers will be recognized at the national level and may be eligible for scholarships and special programs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
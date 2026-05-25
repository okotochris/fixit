import React from 'react'

function Loading() {
  return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300 border border-gray-200 flex flex-col"
              >
                <div className="relative h-40 sm:h-44">
                  <img
                    src="/placeholder-cover.jpg"
                    alt="Placeholder cover"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <img              
                           src="/placeholder-cover.jpg"
                    alt="Placeholder cover"
                      className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="pt-12 pb-6 px-5 flex flex-col grow">
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-1 truncate">
                   
                  </h3>
                  <p className="text-blue-600 font-medium text-center text-sm mb-1">
                   
                  </p>

                  {/* Distance line */}
                  <div className="flex items-center justify-center gap-1.5 text-gray-600 text-xs sm:text-sm mb-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span> </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 mb-3 text-sm">
                    <span className="text-amber-500 text-xl"></span>
                    <span className="font-semibold"></span>
                    <span className="text-gray-500"></span>
                  </div>

                  <p className="text-gray-600 text-center text-sm line-clamp-2 mb-5 flex-grow">
                   
                  </p>

                  <div className="flex gap-3 px-1">
                    <a
                    
                      className="flex-1 text-center py-2.5 px-4 bg-white text-blue-600 text-sm font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      
                    </a>
                    <button className="flex-1 py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                     
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
     
      </div>
  )
}

export default Loading

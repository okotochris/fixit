
import Head from '@/app/component/head';


export default function Profile() {

  return (
    <div className="min-h-screen bg-white">
      <Head />
      <div className="h-14" />

      {/* Cover Photo - full width, no overlap */}
      <div 
        className="h-64 md:h-80 w-full bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("/placeholder-cover.jpg")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      {/* Profile Info Section - placed directly below cover */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            
            {/* Avatar */}
            <div className="flex justify-center md:justify-start shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
                <img 
                  src="/placeholder-cover.jpg" 
                  alt="Mike Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main Info */}
            <div className="flex-1 text-center md:text-left space-y-3 md:space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                
                </h1>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                
                </span>
              </div>

              <p className="text-xl font-medium text-blue-600">
               
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500 text-xl"></span>
                  <span className="font-semibold"></span>
                  <span></span>
                </div>
                <div className="hidden md:block text-gray-400">•</div>
                <div></div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span></span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center md:justify-end gap-3 mt-4 md:mt-0">
            
             
            </div>
          </div>
        </div>
      </div>

      {/* Main content below profile header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        <section>
         
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Services Offered</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Emergency Plumbing",
              "Pipe Repair & Replacement",
              "Water Heater Services",
              "Drain Cleaning",
              "Leak Detection",
              "Bathroom Remodel Plumbing",
              "Kitchen Plumbing",
              "Sewer Line Services"
            ].map((service) => (
              <div 
                key={service} 
                className="bg-white p-4 rounded-lg border border-gray-200 text-center font-medium text-gray-800 hover:border-blue-300 transition-colors"
              >
                
              </div>
            ))}
          </div>
        </section>
        <section>
             <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {["/placeholder-cover.jpg", "/placeholder-cover.jpg", "/placeholder-cover.jpg"].map((img, i) => (
                        <div key={i} className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                            <img 
                                src={img} 
                                alt={`Project ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    ))}
                    <div>
                       
                    </div>
                </div>  
        </section>

      
  
        {/* Add more sections like Reviews, Portfolio, Contact later */}
      </div>
    </div>
  );
}
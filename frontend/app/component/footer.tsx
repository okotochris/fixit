import React from 'react'

function Footer() {
  return (
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12 min-h-[434.1px]">
        <div className="container mx-auto flex flex-col md:flex-row justify-around ">
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4 text-white">ServiceHub Platform</h2>
              <p className="text-gray-400 mb-4">
                Connecting homeowners with trusted local<br/>
                professionals for safe, reliable, and high-<br/>
                quality home services.<br/>
                </p>
            </div>
             
              <div className="flex flex-col  space-x-4 mt-4  p-4">
                <h2 className="text-2xl font-bold mb-4  text-white">Company</h2>
                <a href="#" className="hover:underline">About Us</a>
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Contact Us</a>
              </div>
              <div className="flex flex-col  space-x-4 mt-4 p-4">
                <h2 className="text-2xl font-bold mb-4  text-white">For Clients</h2>
                <a href="#" className="hover:underline">How it works</a>
                <a href="#" className="hover:underline">Safety</a>
                <a href="#" className="hover:underline">Support</a>
              </div>
              <div className="p-4 flex flex-col  space-x-4 mt-4 text-gray-400">
                <h1 className="text-white">Subscribe to our newsletter</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <input type="email" placeholder="Enter your email" className="px-4 py-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 transition">Subscribe</button>
                </div>
              </div>
            </div>

          <div className='text-center mt-4 text-gray-400 border-t border-gray-700 pt-4'>
            <p>&copy; {new Date().getFullYear()} ServiceHub Platform Inc. All rights reserved.</p>
          </div>
      </footer>
  )
}

export default Footer

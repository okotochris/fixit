import { CheckCircle } from "lucide-react";

// ============ SUCCESS SCREEN ============
function SuccessScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome to FixIt!</h1>
        {/* <p className="text-gray-600 mb-8">
          {role === 'client'
            ? 'Your account has been created successfully. Start browsing professionals now!'
            : 'Your profile is ready! Start receiving project requests from clients.'}
        </p>
        <Link
          href={role === 'client' ? '/service' : '/profile'}
          className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Get Started <ChevronRight className="w-5 h-5 ml-2" />
        </Link> */}
      </div>
    </div>
  )
}

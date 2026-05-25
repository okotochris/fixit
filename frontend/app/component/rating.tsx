import React, { useState } from 'react'

function Rating() {
      const [userRating, setUserRating] = useState(0);
      const [hoveredRating, setHoveredRating] = useState(0);
      const [reviewText, setReviewText] = useState('');
  return (
    <>
           <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.47 4.521h4.752c.978 0 1.374 1.24.588 1.81l-3.847 2.782 1.47 4.521c.3.922-.755 1.688-1.54 1.118l-3.847-2.782-3.847 2.782c-.784.57-1.838-.196-1.54-1.118l1.47-4.521-3.847-2.782c-.786-.57-.39-1.81.588-1.81h4.752l1.47-4.521z" />
                    </svg>
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900">4.8</span>
              </div>
              <div className="text-gray-600">
                <p className="font-medium">120 reviews</p>
                <p className="text-sm">based on customer feedback</p>
              </div>
            </div>
          </div>
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.47 4.521h4.752c.978 0 1.374 1.24.588 1.81l-3.847 2.782 1.47 4.521c.3.922-.755 1.688-1.54 1.118l-3.847-2.782-3.847 2.782c-.784.57-1.838-.196-1.54-1.118l1.47-4.521-3.847-2.782c-.786-.57-.39-1.81.588-1.81h4.752l1.47-4.521z" />
                    </svg>
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900">4.8</span>
              </div>
              <div className="text-gray-600">
                <p className="font-medium">120 reviews</p>
                <p className="text-sm">based on customer feedback</p>
              </div>
            </div>
          </div>

          {/* Rating Form */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Experience</h3>
            
            {/* Star Rating Picker */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">Your Rating</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setUserRating(rating)}
                    className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full"
                  >
                    <svg
                      className={`w-10 h-10 transition-colors ${
                        (hoveredRating || userRating) >= rating
                          ? 'text-amber-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.47 4.521h4.752c.978 0 1.374 1.24.588 1.81l-3.847 2.782 1.47 4.521c.3.922-.755 1.688-1.54 1.118l-3.847-2.782-3.847 2.782c-.784.57-1.838-.196-1.54-1.118l1.47-4.521-3.847-2.782c-.786-.57-.39-1.81.588-1.81h4.752l1.47-4.521z" />
                    </svg>
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  You rated this: <span className="font-semibold text-gray-900">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][userRating]}</span>
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this professional..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">{reviewText.length}/500</p>
            </div>

            <button
              disabled={userRating === 0 || reviewText.trim().length === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Your Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {[
              {
                name: "Sarah M.",
                initial: "S",
                rating: 5,
                date: "2 weeks ago",
                comment: "Mike was fantastic! He arrived on time, diagnosed the issue quickly, and fixed our leaking pipe in no time. Highly recommend!"
              },
              {
                name: "David L.",
                initial: "D",
                rating: 4,
                date: "1 month ago",
                comment: "Great service overall. Mike was professional and knowledgeable. The only reason I'm giving 4 stars instead of 5 is because of a slight delay in communication."
              },
            ].map((review, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{review.initial}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, j) => (
                        <svg
                          key={j}
                          className={`w-4 h-4 ${
                            j < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.47 4.521h4.752c.978 0 1.374 1.24.588 1.81l-3.847 2.782 1.47 4.521c.3.922-.755 1.688-1.54 1.118l-3.847-2.782-3.847 2.782c-.784.57-1.838-.196-1.54-1.118l1.47-4.521-3.847-2.782c-.786-.57-.39-1.81.588-1.81h4.752l1.47-4.521z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition">
            Load More Reviews
          </button>
        </section>
    </>
  )
}

export default Rating

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { sanityClient } from "@/lib/sanity"
import SearchBar from "./SearchBar"

interface Review {
  _id: string
  _createdAt: string
  comment: string
  email: string
  rating: number
  product: {
    _id: string
    productName: string
    category: string
    image: {
      asset: {
        url: string
      }
    }
  }
}

interface GroupedReviews {
  [productId: string]: {
    product: {
      _id: string
      productName: string
      category: string
      image: { asset: { url: string } }
    }
    reviews: Omit<Review, 'product'>[]
  }
}

const ReviewPage: React.FC = () => {
  const [groupedReviews, setGroupedReviews] = useState<GroupedReviews>({})
  const [filteredReviews, setFilteredReviews] = useState<GroupedReviews>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = `*[_type == "review"] {
          _id,
          _createdAt,
          comment,
          email,
          rating,
          product->{
            _id,
            productName,
            category,
            image { asset->{ url } }
          }
        }`

        const fetchedReviews = await sanityClient.fetch<Review[]>(query)
        
        if (!fetchedReviews.length) {
          setError("No reviews found")
          return
        }

        const grouped = fetchedReviews.reduce((acc: GroupedReviews, review) => {
          if (!review.product?._id) {
            console.warn("Review missing product:", review._id)
            return acc
          }

          const productId = review.product._id
          const { product, ...reviewData } = review

          if (!acc[productId]) {
            acc[productId] = {
              product: {
                _id: product._id,
                productName: product.productName,
                category: product.category,
                image: product.image
              },
              reviews: []
            }
          }

          acc[productId].reviews.push(reviewData)
          return acc
        }, {})

        setGroupedReviews(grouped)
        setFilteredReviews(grouped)
      } catch (err) {
        console.error("Error loading reviews:", err)
        setError("Failed to load reviews. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredReviews(groupedReviews)
      return
    }

    const filtered = Object.entries(groupedReviews).reduce((acc: GroupedReviews, [productId, { product, reviews }]) => {
      const filteredReviews = reviews.filter(review =>
        review.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )

      if (filteredReviews.length > 0) {
        acc[productId] = {
          product,
          reviews: filteredReviews
        }
      }
      return acc
    }, {})

    setFilteredReviews(filtered)
  }
 // Update the handleDeleteReview function
 const handleDeleteReview = async (reviewId: string, productId: string) => {
  try {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete review")
    }

    setGroupedReviews((prev) => {
      const updated = { ...prev }
      if (updated[productId]) {
        updated[productId].reviews = updated[productId].reviews.filter((r) => r._id !== reviewId)
        if (updated[productId].reviews.length === 0) {
          delete updated[productId]
        }
      }
      return updated
    })
    setFilteredReviews((prev) => {
      const updated = { ...prev }
      if (updated[productId]) {
        updated[productId].reviews = updated[productId].reviews.filter((r) => r._id !== reviewId)
        if (updated[productId].reviews.length === 0) {
          delete updated[productId]
        }
      }
      return updated
    })
  } catch (err) {
    console.error("Failed to delete review:", err)
    alert("Failed to delete review. Please try again.")
  }
}


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600">Please check back later or refresh the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Customer Reviews</h1>
        <p className="text-gray-500">
          {Object.keys(filteredReviews).length} products with reviews
        </p>
      </div>
      <SearchBar
        placeholder="Search by product or email..."
        onSearch={handleSearch}
      />
    </div>
  
    {/* Reviews List */}
    <div className="space-y-8">
      {Object.entries(filteredReviews).map(([productId, { product, reviews }]) => (
        <div
          key={productId}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
        >
          {/* Product Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={product.image?.asset?.url || "/placeholder.svg"}
                  alt={product.productName}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {product.productName}
                  <span className="ml-2 text-gray-500 text-sm font-normal">
                    ({reviews.length} review{reviews.length > 1 ? "s" : ""})
                  </span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">{product.category}</p>
              </div>
            </div>
          </div>
  
          {/* Reviews List */}
          <div className="p-6 space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {review.email[0].toUpperCase()}
                    </span>
                  </div>
                </div>
  
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${
                            i < review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review._createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{review.email}</p>
                    <button
                      onClick={() => handleDeleteReview(review._id, productId)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete review"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  
    {/* Empty State */}
    {Object.keys(filteredReviews).length === 0 && !loading && (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="w-24 h-24 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-gray-500 text-lg font-medium">No matching reviews found</h3>
        <p className="text-gray-400 mt-1">Try adjusting your search terms</p>
      </div>
    )}
  </div>
  )
}

export default ReviewPage
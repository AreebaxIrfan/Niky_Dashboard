"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { urlForImage } from "@/lib/sanity.image"
import { sanityClient } from "@/lib/sanity"
import AddProductForm from "@/components/AddProducts"
import SearchBar from "./../../../components/SearchBar"

interface Product {
  _id: string
  productName: string
  category: string
  slug: {
    current: string
  }
  price: number
  inventory: number
  colors: string[]
  status: string
  image: any
  description: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const result = await sanityClient.fetch(`
        *[_type == "product"] {
          _id,
          productName,
          category,
          slug,
          price,
          inventory,
          colors,
          status,
          image {
            asset-> {
              url,
            }
          },
          description
        }
      `)
      setProducts(result)
      setFilteredProducts(result)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to fetch products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowAddForm(true)
  }

  const handleAddOrUpdateProduct = () => {
    fetchProducts()
    setShowAddForm(false)
    setEditingProduct(null)
  }
  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to delete the product "${productName}"?`)) {
      try {
        console.log(`Sending DELETE request for product ID: ${productId}`)
        const response = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
          method: "DELETE",
        })

        console.log(`Received response with status: ${response.status}`)
        const data = await response.json()
        console.log("Response data:", data)

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! status: ${response.status}`)
        }

        if (data.success) {
          setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId))
          console.log(data.message) // Log success message
        } else {
          throw new Error(data.message || "Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      }
    }
  }
  const handleSearch = (searchTerm: string) => {
    const filtered = products.filter((product) => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredProducts(filtered)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      Loading
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
        <h2 className="text-red-700 font-semibold text-lg mb-2">Error Loading Products</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
  {/* Header Section */}
  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Product Management</h1>
      <p className="text-gray-500 text-sm">
        {filteredProducts.length} products available
      </p>
    </div>
    <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
      <SearchBar
        placeholder="Search products..."
        onSearch={handleSearch}
      />
      <button
        onClick={() => {
          setEditingProduct(null);
          setShowAddForm(true);
        }}
        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </button>
    </div>
  </div>

  {/* Product Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredProducts.map((product) => (
      <div
        key={product._id}
        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="p-6">
          {/* Product Image and Details */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <Image
                src={urlForImage(product.image)?.url() || "/placeholder.svg"}
                alt={product.productName}
                width={96}
                height={96}
                className="w-24 h-24 rounded-lg object-cover border border-gray-200"
              />
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {product.productName}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.inventory > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inventory} in stock
                </span>
              </div>
            </div>
          </div>

          {/* Additional Product Details */}
          <div className="space-y-3 border-t border-gray-100 pt-4">
            {/* Colors */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Colors</span>
              <div className="flex gap-1">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="w-5 h-5 rounded-full border border-gray-200 shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "active"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.status}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id, product.productName)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Empty State */}
  {filteredProducts.length === 0 && (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      </div>
      <h3 className="text-gray-500 text-lg font-medium mb-2">No products found</h3>
      <p className="text-gray-400 mb-4">Try adjusting your search or add a new product</p>
      <button
        onClick={() => setShowAddForm(true)}
        className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
      >
        Add New Product
      </button>
    </div>
  )}

  {/* Add/Edit Product Form */}
  {showAddForm && (
    <AddProductForm
      onClose={() => {
        setShowAddForm(false);
        setEditingProduct(null);
      }}
      onProductAdded={handleAddOrUpdateProduct}
      product={editingProduct}
    />
  )}
</div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AddProductFormProps {
  onClose: () => void
  onProductAdded: () => void
  product?: Product | null| undefined
}

interface Product {
  productName: string
  category: string
  price: number
  inventory: number
  colors: string[]
  status: string
  description: string
  image?: {
    asset: {
      _ref: string
    }
  }
  slug:  { current: string }; 
}

export default function AddProductForm({ onClose, onProductAdded, product }: AddProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    inventory: "",
    colors: "",
    status: "",
    description: "",
    slug: "", // Add this line
  })
  const [image, setImage] = useState<File | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        category: product.category,
        price: product.price.toString(),
        inventory: product.inventory.toString(),
        colors: product.colors.join(", "),
        status: product.status,
        description: product.description,
        slug: product.slug.current || "", // Add this line
      })
      setIsEditing(true)
    }
  }, [product])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!image && !isEditing) {
      throw new Error("Image is required")
    }
    try {
      let imageAsset
      if (image) {
        const formData = new FormData()
        formData.append("file", image)
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image")
        }
        const { assetId } = await uploadResponse.json()
        imageAsset = { _type: "image", asset: { _type: "reference", _ref: assetId } }
      }

      const productData = {
        _type: "product",
        productName: formData.productName,
        category: formData.category,
        price: Number.parseFloat(formData.price),
        inventory: Number.parseInt(formData.inventory),
        colors: formData.colors.split(",").map((color) => color.trim()),
        status: formData.status,
        description: formData.description,
        slug: formData.slug, // Add this line
        ...(imageAsset && { image: imageAsset }),
      }

const url = isEditing ? `/api/products/${product?.slug.current}` : "/api/products"
      const method = isEditing ? "PUT" : "POST"

      const productDataWithName = {
        ...productData,
        productName: formData.productName, // Pass productName in the request body
      }
      console.log("Fetching URL:", url)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`, // Add token here
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error("Failed to save product")
      }

      onProductAdded()
      onClose()
      router.refresh()
    } catch (error) {
      console.error("Error saving product:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit" : "Add"} Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
              Inventory
            </label>
            <input
              type="number"
              id="inventory"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="colors" className="block text-sm font-medium text-gray-700">
              Colors (comma-separated)
            </label>
            <input
              type="text"
              id="colors"
              name="colors"
              value={formData.colors}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select status</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              required // Add this line
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              {isEditing ? "Update" : "Add"} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}



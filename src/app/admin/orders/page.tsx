"use client"

import { useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanity"
import Image from "next/image"
import SearchBar from "./../../../components/SearchBar"

interface OrderItem {
  name: string
  quantity: number
  price: number
  size: string
  color: string
  image: string
}

interface Order {
  _id: string
  createdAt: string
  customer: {
    name: string
    phone: number
    email: string
  } | null
  items: OrderItem[]
  total: number
  status: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const result = await sanityClient.fetch(`
     *[_type == "order"]{
  _id,
  customer->{
    name,
    email,
    phone
  },
  createdAt,
  total,
  status,
  items[]{
    name->{
      price,
      image{
        asset->{
          url
        }
      }
    },
    quantity,
    price,
     name,
    size,
    color,
    image
  }
}
    `)
    console.log("Fetched orders:", result)
    setOrders(result)
    setFilteredOrders(result)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleSearch = (searchTerm: string) => {
    const filtered = orders.filter(
      (order) =>
        order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrders(filtered)
  }

  
  return (
    <div className="container mx-auto px-4 py-8">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order Management</h1>
      <SearchBar
        placeholder="Search by name or email..."
        onSearch={handleSearch}
      />
    </div>
  
    {/* Order List */}
    <div className="grid grid-cols-1 gap-6">
      {filteredOrders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
        >
          {/* Order Header */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Order #{order._id.slice(-6)}
              </h2>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-gray-900">
                Total: ${(order.total ?? 0).toFixed(2)}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
  
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
              <p className="text-gray-900">{order.customer?.name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
              <p className="text-gray-900">{order.customer?.phone || "N/A"}</p>
              <p className="text-gray-600 text-sm">{order.customer?.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Status</h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
  
          {/* Order Items */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name || "Product"}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">
                      {item.name || "Unknown Product"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Size:</span> {item.size || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Color:</span> {item.color || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {item.quantity || 0}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> ${item.price?.toFixed(2) || "0.00"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  
    {/* Empty State */}
    {filteredOrders.length === 0 && (
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
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
            />
          </svg>
        </div>
        <h3 className="text-gray-500 text-lg font-medium">No orders found</h3>
        <p className="text-gray-400 mt-1">Try adjusting your search criteria</p>
      </div>
    )}
  </div>
  )
}


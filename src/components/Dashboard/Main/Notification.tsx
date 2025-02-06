"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, InfoIcon, ShoppingCart } from "lucide-react"
import { sanityClient } from "../../../lib/sanity"

interface Order {
  _id: string
  orderId: string
  customer: { name: string }
  createdAt: string
}

interface Review {
  _id: string
  rating: number
  product: { name: string }
  createdAt: string
}

interface Notification {
  id: string
  type: "order" | "review"
  message: string
  time: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const orders = await sanityClient.fetch<Order[]>(`
        *[_type == "order"] | order(createdAt desc)[0...5] {
          _id,
          orderId,
          customer->{name},
          createdAt
        }
      `)

      const reviews = await sanityClient.fetch<Review[]>(`
        *[_type == "review"] | order(createdAt desc)[0...5] {
          _id,
          rating,
          product->{name},
          createdAt
        }
      `)

      const combinedNotifications: Notification[] = [
        ...orders.map((order) => ({
          id: order._id,
          type: "order" as const,
          message: `New order #${order.orderId} from ${order.customer?.name ?? "Unknown Customer"}`,
          time: new Date(order.createdAt).toLocaleString(),
        })),
        ...reviews.map((review) => ({
          id: review._id,
          type: "review" as const,
          message: `New ${review.rating}-star review for ${review.product.name}`,
          time: new Date(review.createdAt).toLocaleString(),
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

      setNotifications(combinedNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const getIcon = (type: "order" | "review") => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />
      case "review":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <InfoIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Your recent notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="flex items-start space-x-4">
              {getIcon(notification.type)}
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{notification.message}</p>
                <p className="text-sm text-gray-500">{notification.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}


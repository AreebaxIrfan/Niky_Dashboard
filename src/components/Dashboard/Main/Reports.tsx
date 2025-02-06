'use client'
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import sanityClient from "../../../../lib/sanityClient";

interface Order {
  _id: string
  customer: {
    name: string
    email: string
    phone: string
  }
  createdAt: string
  total: number
  status: string
  items: Array<{
    name: string
    quantity: number
    price: number
    size: string
    color: string
    image: string
  }>
}

const Reports = () => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const result = await sanityClient.fetch(`
        *[_type == "order"][0...4]{
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
            name,
            quantity,
            price,
            size,
            color,
            image
          }
        }
      `)
      console.log("Fetched orders:", result)
      setOrders(result)
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
        <CardDescription className="text-sm text-gray-500">A list of recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{order.customer.name}</TableCell>
                <TableCell>{order.createdAt}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Reports;
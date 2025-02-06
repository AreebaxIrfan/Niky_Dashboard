'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/Dashboard/overview";
import { RecentSales } from "@/components/Dashboard/recent-sales";
import  Notifications  from "@/components/Dashboard/Main/Notification";
import { Suspense } from "react";
import  Reports  from "@/components/Dashboard/Main/Reports";
import { Analytics } from './Main/Analytic';

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  totalReviews: number;
  orders: any[];
  customers: any[];
  reviews: any[];
}

const CustomTabs = ({ data }: { data: DashboardData }) => {
  const {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    totalReviews,
    orders,
    customers,
    reviews
  } = data;

  const dashboardData = {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    totalReviews,
    orders,
    customers,
    reviews
  };

  // Keep the rest of your existing JSX exactly the same
  return (
    <div>
         <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-lg p-1 shadow-sm">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:scale-105"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:scale-105"
          >
            Analytics
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:scale-105"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg px-4 py-2 transition-all hover:scale-105"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-blue-500"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">${totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-gray-500">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-teal-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-green-500"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{totalOrders}</div>
                <p className="text-xs text-gray-500">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-orange-500"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{totalCustomers}</div>
                <p className="text-xs text-gray-500">+19% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-pink-500"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{totalProducts}</div>
                <p className="text-xs text-gray-500">+201 since last hour</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Sales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 bg-white/80 backdrop-blur-md border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="text-gray-800">Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3 bg-white/80 backdrop-blur-md border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              <CardHeader>
                <CardTitle className="text-gray-800">Recent Sales</CardTitle>
                <CardDescription className="text-gray-500">You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Analytics data={dashboardData} />
          </Suspense>
        </TabsContent>

        {/* Reports Tab Content */}
        <TabsContent value="reports" className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Reports  />
          </Suspense>
        </TabsContent>

        {/* Notifications Tab Content */}
        <TabsContent value="notifications" className="space-y-4">
          <Suspense fallback={<div>Loading...</div>}>
            <Notifications data={dashboardData} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomTabs;

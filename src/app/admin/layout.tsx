import Sidebar from '@/components/Sidebar';
import Link from 'next/link'
import React from 'react'

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
    <div>
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          {/* <aside className="w-64 bg-white shadow-lg">
            <nav className="mt-8">
              <Link
                href="/admin"
                className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="ml-2">Dashboard</span>
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="ml-2">Orders</span>
              </Link>
              <Link
                href="/admin/customers"
                className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="ml-2">Customers</span>
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="ml-2">Products</span>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
              >
                <span className="ml-2">Reviews</span>
              </Link>
            </nav>
          </aside> */}
          <Sidebar/>
          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
    </div>
  )
}

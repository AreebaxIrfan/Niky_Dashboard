'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex  h-screen bg-gray-100">
      {/* Hamburger Icon for Mobile */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 p-2 bg-white rounded-lg shadow-lg z-50 focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white shadow-lg fixed md:relative transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-200 ease-in-out z-40 h-screen`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 overflow-y-auto pt-16 md:pt-4">
            <div className='flex items-center justify-center py-4'>
              <Image
                src="/nike.avif"
                alt="nike-logo"
                width={100}
                height={100}
                className="rounded-lg "
              />
            </div>
            <Link
              href="/admin"
              className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <span className="ml-2">Dashboard</span>
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <span className="ml-2">Orders</span>
            </Link>
            <Link
              href="/admin/customers"
              className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <span className="ml-2">Customers</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <span className="ml-2">Products</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex items-center w-full py-3 px-6 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <span className="ml-2">Reviews</span>
            </Link>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center py-2 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-all duration-200"
            >
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
  <button
    type="button"
    aria-label="Close sidebar overlay"
    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden cursor-pointer"
    onClick={() => setIsSidebarOpen(false)}
  />
)}

    </div>
  );
};


export default Sidebar;

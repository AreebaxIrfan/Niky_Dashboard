"use client"

import { useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanity"
import SearchBar from "./../../../components/SearchBar"

interface Customer {
  _id: string
  name: string
  email: string
  phone: string
  pan: string
  createdAt: string
  address: {
    addressLine1: string
    addressLine2: string
    addressLine3: string
    postalCode: string
    locality: string
    state: string
    country: string
  }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const result = await sanityClient.fetch(`
      *[_type == "customer"] {
        _id,
        name,
        email,
        phone,
        pan,
        createdAt,
        address
      }
    `)
    setCustomers(result)
    setFilteredCustomers(result)
  }
 
const handleDeleteCustomer = async (id: string) => {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    if (response.ok) {
      setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer._id !== id))
      setFilteredCustomers((prevFiltered) => prevFiltered.filter((customer) => customer._id !== id))
    } else if (response.status === 409) {
      // Display more detailed information about the references
      const referenceDetails = data.references
        .map((ref: any) => `${ref._type} (ID: ${ref._id}, Name: ${ref.name || ref.title || "Unnamed"})`)
        .join("\n")

      alert(
        `Cannot delete customer. This customer is referenced by the following document(s):\n\n${referenceDetails}\n\nPlease remove these references before deleting the customer.`,
      )
    } else {
      throw new Error(data.error || "Failed to delete customer")
    }
  } catch (error) {
    console.error("Error deleting customer:", error)
    alert("Failed to delete customer. Please try again.")
  }
}


  const handleSearch = (searchTerm: string) => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCustomers(filtered)
  }

  return (
    <div className="container mx-auto px-4 py-8">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Customers</h1>
      <SearchBar
        placeholder="Search by name or email..."
        onSearch={handleSearch}
      />
    </div>
  
    {/* Customers Table */}
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Name
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Email
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Phone
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              PAN
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Created At
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Address
            </th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer._id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                {customer.name}
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                {customer.email}
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                {customer.phone}
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                {customer.pan}
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                {new Date(customer.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 border-b text-sm text-gray-700">
                <address>
                  {customer.address.addressLine1}
                  <br />
                  {customer.address.addressLine2}
                  <br />
                  {customer.address.addressLine3}
                  <br />
                  {customer.address.locality}, {customer.address.state}{" "}
                  {customer.address.postalCode}
                  <br />
                  {customer.address.country}
                </address>
              </td>
              <td className="py-3 px-4 border-b">
                <button
                  onClick={() => handleDeleteCustomer(customer._id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Empty State */}
    {filteredCustomers.length === 0 && (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-gray-500 text-lg font-medium">No customers found</h3>
        <p className="text-gray-400 mt-1">Try adjusting your search criteria</p>
      </div>
    )}
  </div>
  )
}


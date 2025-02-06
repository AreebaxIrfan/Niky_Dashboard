"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { sanityClient } from "@/lib/sanity";

interface RecentSale {
  _id: string;
  customer: {
    name: string;
    email: string;
    image: string;
  };
  total: number;
}

export function RecentSales() {
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);

  useEffect(() => {
    const fetchRecentSales = async () => {
      const result = await sanityClient.fetch(`
        *[_type == "order"] | order(createdAt desc)[0...5] {
          _id,
          "customer": customer->{
            name,
            email,
            "image": image.asset->url
          },
          total
        }
      `);
      setRecentSales(result);
    };

    fetchRecentSales();
  }, []);

  return (
    <div className="space-y-6">
      {recentSales.map((sale) => (
        <div
          key={sale._id}
          className="flex items-center p-4 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-sm cursor-pointer"
        >
          <Avatar className="h-10 w-10 border-2 border-white shadow-md">
            <AvatarImage src={sale.customer.image} alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {sale.customer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none text-gray-800">
              {sale.customer.name}
            </p>
            <p className="text-sm text-gray-500">{sale.customer.email}</p>
          </div>
          <div className="ml-auto font-medium text-green-600">
            +${sale.total.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
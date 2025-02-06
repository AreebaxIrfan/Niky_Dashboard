"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { sanityClient } from "@/lib/sanity";

export function Overview() {
  const [data, setData] = useState<{ name: string; total: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result: { month: string; total: number }[] = await sanityClient.fetch(`
        *[_type == "order"] {
          "month": dateTime(createdAt).month,
          total
        }
      `);

      const monthlyData = result.reduce((acc: { [x: string]: { name: any; total: any } }, order: { month: any; total: any }) => {
        const month = order.month;
        if (!acc[month]) {
          acc[month] = { name: month, total: 0 };
        }
        acc[month].total += order.total;
        return acc;
      }, {});

      const sortedData = Object.values(monthlyData).sort((a, b) => a.name - b.name);

      setData(sortedData);
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#666" }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          tick={{ fill: "#666" }}
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          contentStyle={{
            background: "rgba(255, 255, 255, 0.9)",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "12px",
          }}
          labelStyle={{ color: "#333", fontWeight: "600" }}
          itemStyle={{ color: "#333" }}
          formatter={(value: number) => `$${value.toFixed(2)}`}
        />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#9333ea" stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <Bar
          dataKey="total"
          fill="url(#barGradient)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
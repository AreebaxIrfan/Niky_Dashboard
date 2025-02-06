import { Suspense } from "react";
import CustomTabs from "@/components/Dashboard/Tabs";

export default async function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h2>
      </div>

      {/* Tabs */}
      <Suspense fallback={<div>Loading...</div>}>
        <CustomTabs />
      </Suspense>
    </div>
  );
}
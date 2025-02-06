// app/components/dashboard-tabs.tsx
import { sanityClient } from "@/lib/sanity";
import CustomTabs from "./Custome-tabs";

export default async function DashboardTabs() {
  const data = await getDashboardData();
  
  return <CustomTabs data={data} />;
}

async function getDashboardData() {
  const orders = await sanityClient.fetch(`*[_type == "order"] { total }`);
  const totalRevenue = orders.reduce((sum: any, order: { total: any }) => sum + (order.total || 0), 0);

  return {
    totalRevenue,
    totalOrders: await sanityClient.fetch(`count(*[_type == "order"])`),
    totalCustomers: await sanityClient.fetch(`count(*[_type == "customer"])`),
    totalProducts: await sanityClient.fetch(`count(*[_type == "product"])`),
    totalReviews: await sanityClient.fetch(`count(*[_type == "review"])`),
    customers: await sanityClient.fetch(`*[_type == "customer"]`),
    reviews: await sanityClient.fetch(`*[_type == "review"]`),
    orders,
  };
}
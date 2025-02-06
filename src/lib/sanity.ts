import { createClient } from "@sanity/client"

export const sanityClient = createClient({
  projectId: "toiwtid6",
  dataset: "production",
  useCdn: false, // set to `true` to fetch from edge cache
  apiVersion: "2025-01-10", // use current date (YYYY-MM-DD) to target the latest API version
  token: process.env.SANITY_API_TOKEN, // Only if you want to update content with the client

})

export async function fetchOrders() {
  return sanityClient.fetch(`
    *[_type == "order"] | order(createdAt desc) {
      _id,
      orderId,
      customer->{name},
      total,
      status,
      createdAt
    }
  `)
}

export async function fetchCustomers() {
  return sanityClient.fetch(`
    *[_type == "customer"] | order(createdAt desc) {
      _id,
      name,
      email,
      "totalOrders": count(*[_type == "order" && references(^._id)]),
      createdAt
    }
  `)
}


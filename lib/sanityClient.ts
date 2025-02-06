import { createClient } from "next-sanity"

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-10',
  useCdn: process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN,
}

const sanityClient = createClient(config)

export default sanityClient


import { client } from "@/sanity/lib/client"
import imageUrlBuilder from "@sanity/image-url"

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  if (!source || !source.asset) {
    return {
      url: () => "/placeholder.svg",
    }
  }

  try {
    return builder.image(source)
  } catch (error) {
    console.error("Error building image URL:", error)
    return {
      url: () => "/placeholder.svg",
    }
  }
}


import { NextResponse } from "next/server"
import client from "./../../../../lib/sanityClient"
import data from "@/data/products.json"

export function GET() {
  return NextResponse.json({ success: true, data: data })
}


export async function POST(req: Request) {
  try {
    const productData = await req.json()

    if (!productData) {
      throw new Error("Missing product data")
    }

    const result = await client.create(productData)

    return NextResponse.json({ success: true, product: result }, { status: 200 })
  } catch (error) {
    console.error("Error adding product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request) {
  try {
    const productData = await req.json()
    if (!productData || !productData.productName) {
      throw new Error("Missing product data or product name")
    }

    // Find the product by name using a more reliable query
    const existingProduct = await client.fetch(`*[_type == "product" && productName == $productName][0]`, {
      productName: productData.productName,
    })

    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 })
    }

    // Update the product using its _id (recommended)
    const result = await client
      .patch(existingProduct._id)
      .set(productData) // Update product with new data
      .commit()

    return NextResponse.json({ success: true, product: result }, { status: 200 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("id")

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing product ID" }, { status: 400 })
    }

    console.log(`Attempting to delete product with ID: ${productId}`)

    await client.delete(productId)

    console.log(`Product deleted successfully: ${productId}`)

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

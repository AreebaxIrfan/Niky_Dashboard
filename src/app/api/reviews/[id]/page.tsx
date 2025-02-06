import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await sanityClient.delete(id)
    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}
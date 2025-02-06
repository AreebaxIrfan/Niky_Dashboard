import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const result = await sanityClient.patch(params.id).set({ status: body.status }).commit()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Error updating order" }, { status: 500 })
  }
}
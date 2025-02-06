import { NextResponse } from "next/server"
import { sanityClient } from "@/lib/sanity"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await sanityClient.create({
      _type: "customer",
      ...body,
      createdAt: new Date().toISOString(),
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error adding customer:", error)
    return NextResponse.json({ error: "Error adding customer" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
      // Check for references and get more details
      const references = await sanityClient.fetch(
        `
        *[references($id)] {
          _type,
          _id,
          title,
          name
        }
      `,
        { id },
      )
  
      if (references.length > 0) {
        // If there are references, return detailed information
        return NextResponse.json(
          {
            error: "Cannot delete customer. This customer is referenced by other documents.",
            references: references,
          },
          { status: 409 },
        ) // 409 Conflict
      }
  
      // If no references, proceed with deletion
      await sanityClient.delete(id)
      return NextResponse.json({ message: "Customer deleted successfully" }, { status: 200 })
    } catch (error) {
      console.error("Error deleting customer:", error)
      return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
     }
  }


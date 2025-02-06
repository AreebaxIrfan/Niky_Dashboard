import sanityClient from './../../lib/sanityClient'

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    await sanityClient.delete(reviewId)
  } catch (error) {
    console.error("Error deleting review:", error)
    throw error
  }
}


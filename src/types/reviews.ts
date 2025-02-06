export interface Product {
  _id: string
  productName: string
  category: string
  image: {
    asset: {
      url: string
    }
  }
}

export interface Review {
  id: string
  comment: string
  rating: number
  email: string
  product: Product
}


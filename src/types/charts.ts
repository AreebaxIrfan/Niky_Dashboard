
export interface OrderItem {
    name: string
    quantity: number
    price: number
    size: string
    color: string
    image: string
  }
  
export interface Order {
    _id: string
    createdAt: string
    customer: {
      name: string
      phone: number
      email: string
    } | null
    items: OrderItem[]
    totalAmount: number
    status: string
  }


export interface Customer {
    _id: string
    name: string
    email: string
    phone: string
    pan: string
    createdAt: string
    address: {
      addressLine1: string
      addressLine2: string
      addressLine3: string
      postalCode: string
      locality: string
      state: string
      country: string
    }
  }
  
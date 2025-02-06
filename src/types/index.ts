import { DefaultSession } from "next-auth"

export type UserRole = 'admin' | 'productManager' | 'shipmentManager'

declare module 'next-auth' {
  interface User {
    role?: UserRole
  }
  interface Session {
    user?: {
      role?: UserRole
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
  }
}
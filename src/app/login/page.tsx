'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const [error, setError] = useState('')
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/admin')
    } else {
      setError('Invalid email or password')
    }
  }

  return (
  <div className="flex justify-center items-center h-screen bg-gray-100">
  <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md w-96">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>

    {/* Email Input */}
    <div className="mb-6">
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
        Email
      </label>
      <input
        {...register('email')}
        type="email"
        id="email"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black placeholder-gray-400 transition duration-200"
        placeholder="your@email.com"
      />
      {errors.email && (
        <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
      )}
    </div>

    {/* Password Input */}
    <div className="mb-6">
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        {...register('password')}
        type="password"
        id="password"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black placeholder-gray-400 transition duration-200"
        placeholder="••••••••"
      />
      {errors.password && (
        <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
      )}
    </div>

    {/* Error Message */}
    {error && (
      <p className="text-sm text-red-600 font-medium mb-4 text-center">{error}</p>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition duration-300"
    >
      Sign In
    </button>
  </form>
</div>
  )
}

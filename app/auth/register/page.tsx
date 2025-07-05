"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", fullName: "", phone: "", pin: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess("Registration successful! You can now log in.")
        setTimeout(() => router.push("/auth/login"), 1500)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>User Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
            <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
            <Input name="pin" type="password" placeholder="Choose a PIN" value={form.pin} onChange={handleChange} required minLength={4} maxLength={20} />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 
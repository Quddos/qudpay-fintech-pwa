"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { User, LogOut, ArrowLeftRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SellPage() {
  const [userName, setUserName] = useState<string | null>(null)
  const [balance, setBalance] = useState<'0'|'pending'|string>('0')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem("userName"))
    }
  }, [])

  useEffect(() => {
    if (userName) {
      fetch("/api/user/balance")
        .then(res => res.json())
        .then(data => {
          if (data.balance === null || data.balance === undefined) setBalance('pending')
          else setBalance(data.balance)
        })
        .catch(() => setBalance('pending'))
    }
  }, [userName])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClick)
    }
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showProfileMenu])

  function handleLogout() {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    localStorage.removeItem("userName")
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 md:px-4 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 bg-white/80 rounded-lg shadow p-4 gap-2 md:gap-0">
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto" onClick={() => router.push("/")}>Home</Button>
          <Button variant="outline" className="w-full md:w-auto" onClick={() => router.push("/exchange")}>Exchange</Button>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="font-semibold text-blue-700 text-sm md:text-base">{userName ? `Welcome, ${userName}` : "Balance: "}{balance === 'pending' ? 'Pending' : balance}</div>
          {userName && (
            <div className="relative" ref={profileMenuRef}>
              <button
                className="ml-2 rounded-full bg-blue-100 p-2 hover:bg-blue-200 transition"
                onClick={() => setShowProfileMenu((v) => !v)}
                aria-label="Profile"
              >
                <User className="h-5 w-5 text-blue-700" />
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Coming Soon Banner */}
      <div className="bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 text-center font-semibold mb-6">
        🚧 Coming Soon: Sell to Us / Invest 🚧
      </div>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <ArrowLeftRight className="h-16 w-16 text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Sell to Us / Invest</h2>
        <p className="text-gray-600 text-center max-w-md">
          This feature will allow you to sell your currency directly to us or invest in our platform. Stay tuned for updates!
        </p>
      </div>
    </div>
  )
} 
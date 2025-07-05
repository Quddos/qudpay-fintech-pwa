"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, CreditCard, Smartphone, Mail, Calculator, Home, ArrowLeft } from "lucide-react"
import { calculateExchange, formatCurrency } from "@/lib/currency-converter"
import { useRouter } from "next/navigation"

// Modal and auth forms
function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState("login")
  const switchToLogin = () => setTab("login")
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="bg-blue-400/60 rounded-lg shadow-lg p-6 w-full max-w-md relative">
        {/* No close button */}
        <Tabs value={tab} onValueChange={setTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <AuthLoginForm onSuccess={onClose} />
          </TabsContent>
          <TabsContent value="register">
            <AuthRegisterForm onSuccess={onClose} switchToLogin={switchToLogin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ) : null
}

function AuthLoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({ email: "", pin: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userName, setUserName] = useState<string | null>(null)
  const router = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setUserName(data.full_name || data.email)
        localStorage.setItem("userName", data.full_name || data.email)
        onSuccess()
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Login failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <Input name="pin" type="password" placeholder="PIN" value={form.pin} onChange={handleChange} required minLength={4} maxLength={20} />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  )
}

function AuthRegisterForm({ onSuccess, switchToLogin }: { onSuccess: () => void, switchToLogin: () => void }) {
  const [form, setForm] = useState({ email: "", fullName: "", phone: "", pin: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
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
        setSuccess("Registration successful! Please log in.")
        setTimeout(() => switchToLogin(), 1200)
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <Input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
      <Input name="phone" placeholder="WhatsApp Number (e.g. +91XXXXXXXXXX)" value={form.phone} onChange={handleChange} />
      <Input name="pin" type="password" placeholder="Choose a PIN" value={form.pin} onChange={handleChange} required minLength={4} maxLength={20} />
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
    </form>
  )
}

function isLoggedIn() {
  // Simple check for auth-token cookie (client-side, not secure for production)
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith("auth-token="))
}

export default function ExchangePage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("receive")
  const [loading, setLoading] = useState(false)
  const [exchangeData, setExchangeData] = useState({
    // Tab 1: Receive details
    receiveMethod: "",
    upiId: "",
    receiverWhatsapp: "",
    displayName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",

    // Tab 2: Email for account details
    email: "",

    // Tab 3: Exchange amount
    amount: "",
    receiptFile: null as File | null,
  })

  const [exchangeResult, setExchangeResult] = useState<any>(null)
  const [accountDetails, setAccountDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [rateLoading, setRateLoading] = useState(false)
  const [rateError, setRateError] = useState<string | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [balance, setBalance] = useState<'0'|'pending'|string>('0')
  const [userName, setUserName] = useState<string | null>(null)

  // Simulate fetching balance (replace with real API later)
  useEffect(() => {
    // TODO: Replace with real API call to get user balance
    setBalance('0')
  }, [])

  useEffect(() => {
    if (!isLoggedIn()) {
      setShowAuth(true)
    }
  }, [])

  useEffect(() => {
    async function fetchRate() {
      setRateLoading(true)
      setRateError(null)
      try {
        const res = await fetch("/api/exchange/rate")
        const data = await res.json()
        setRate(data.ngnToInr?.rate || null)
      } catch (e) {
        setRateError("Failed to fetch rate")
        setRate(null)
      } finally {
        setRateLoading(false)
      }
    }
    fetchRate()
  }, [])

  useEffect(() => {
    if (exchangeData.amount && rate) {
      const amt = Number.parseFloat(exchangeData.amount)
      let convertedAmount = amt * rate
      let platformFee = convertedAmount * 0.045
      let netAmount = convertedAmount - platformFee
      setExchangeResult({
        convertedAmount,
        rate,
        platformFee,
        netAmount,
      })
    } else {
      setExchangeResult(null)
    }
  }, [exchangeData.amount, rate])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem("userName"))
    }
  }, [showAuth])

  const handleInputChange = (field: string, value: string) => {
    setExchangeData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (file: File | null) => {
    setExchangeData((prev) => ({ ...prev, receiptFile: file }))
  }

  const validateReceiveStep = () => {
    if (exchangeData.receiveMethod === "upi") {
      return (
        exchangeData.upiId &&
        exchangeData.displayName &&
        exchangeData.receiverWhatsapp
      )
    } else if (exchangeData.receiveMethod === "bank") {
      return (
        exchangeData.bankName &&
        exchangeData.accountNumber &&
        exchangeData.ifscCode &&
        exchangeData.receiverWhatsapp
      )
    }
    return false
  }

  const sendAccountDetails = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch("/api/exchange/account-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: exchangeData.email }),
      })
      if (response.ok) {
        const details = await response.json()
        setAccountDetails(details)
        setActiveTab("amount")
        setSuccess("Account details sent to your email.")
      } else {
        setError("Failed to send account details. Please try again.")
      }
    } catch (error) {
      setError("Failed to send account details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const submitExchange = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Upload receipt if provided
      let receiptUrl = null
      if (exchangeData.receiptFile) {
        const formData = new FormData()
        formData.append("file", exchangeData.receiptFile)
        formData.append("type", "receipt")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          receiptUrl = url
        }
      }

      // Submit exchange request
      const response = await fetch("/api/exchange/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...exchangeData,
          receiptUrl,
          exchangeResult,
        }),
      })

      if (response.ok) {
        setSuccess("Exchange request submitted successfully!")
        // Redirect to home page instead of dashboard
        router.push("/?exchange=submitted")
      } else {
        setError("Failed to submit exchange request. Please try again.")
      }
    } catch (error) {
      setError("Exchange submission failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
      {/* Exchange Header */}
      <div className="flex items-center justify-between mb-8 bg-white/80 rounded-lg shadow p-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/'}>Home</Button>
          <Button variant="outline" onClick={() => window.location.href = '/kyc'}>KYC</Button>
          <Button variant="outline" onClick={() => window.location.href = '/sell'}>Sell to Us/Invest</Button>
        </div>
        <div className="font-semibold text-blue-700">{userName ? `Welcome, ${userName}` : "Balance: "}{!userName && balance}</div>
      </div>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                Currency Exchange
              </CardTitle>
              <CardDescription>Complete your exchange in 3 simple steps</CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList
                  className="w-full flex overflow-x-auto md:grid md:grid-cols-3 gap-2 md:gap-0"
                  style={{ WebkitOverflowScrolling: "touch" }}
                  aria-label="Exchange Steps"
                >
                  <TabsTrigger
                    value="receive"
                    className="flex-1 min-w-[140px] md:min-w-0 text-center"
                    aria-label="Receive Method"
                  >
                    1. Receive Method
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="flex-1 min-w-[140px] md:min-w-0 text-center"
                    aria-label="Payment Details"
                  >
                    2. Payment Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="amount"
                    className="flex-1 min-w-[140px] md:min-w-0 text-center"
                    aria-label="Exchange Amount"
                  >
                    3. Exchange Amount
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="receive" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">How do you want to receive your funds?</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Card
                        className={`cursor-pointer transition-all ${
                          exchangeData.receiveMethod === "upi" ? "ring-2 ring-blue-600" : ""
                        }`}
                        onClick={() => handleInputChange("receiveMethod", "upi")}
                      >
                        <CardContent className="p-6 text-center">
                          <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <h4 className="font-semibold">UPI Payment</h4>
                          <p className="text-sm text-gray-600">Instant transfer to your UPI ID</p>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-all ${
                          exchangeData.receiveMethod === "bank" ? "ring-2 ring-blue-600" : ""
                        }`}
                        onClick={() => handleInputChange("receiveMethod", "bank")}
                      >
                        <CardContent className="p-6 text-center">
                          <CreditCard className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h4 className="font-semibold">Bank Transfer</h4>
                          <p className="text-sm text-gray-600">Direct transfer to your bank account</p>
                        </CardContent>
                      </Card>
                    </div>

                    {exchangeData.receiveMethod === "upi" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="upiId">UPI ID</Label>
                          <Input
                            id="upiId"
                            value={exchangeData.upiId}
                            onChange={(e) => handleInputChange("upiId", e.target.value)}
                            placeholder="yourname@paytm"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={exchangeData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            placeholder="Name as shown in UPI"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="receiverWhatsapp">WhatsApp Number</Label>
                          <Input
                            id="receiverWhatsapp"
                            value={exchangeData.receiverWhatsapp}
                            onChange={(e) => handleInputChange("receiverWhatsapp", e.target.value)}
                            placeholder="+91XXXXXXXXXX"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {exchangeData.receiveMethod === "bank" && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input
                            id="bankName"
                            value={exchangeData.bankName}
                            onChange={(e) => handleInputChange("bankName", e.target.value)}
                            placeholder="State Bank of India"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={exchangeData.accountNumber}
                            onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                            placeholder="Enter account number"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="ifscCode">IFSC Code</Label>
                          <Input
                            id="ifscCode"
                            value={exchangeData.ifscCode}
                            onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                            placeholder="SBIN0001234"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="receiverWhatsapp">WhatsApp Number</Label>
                          <Input
                            id="receiverWhatsapp"
                            value={exchangeData.receiverWhatsapp}
                            onChange={(e) => handleInputChange("receiverWhatsapp", e.target.value)}
                            placeholder="+91XXXXXXXXXX"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-6"
                      onClick={() => setActiveTab("payment")}
                      disabled={!validateReceiveStep()}
                    >
                      Continue to Payment Details
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Get Our Account Details</h3>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={exchangeData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                        <p className="text-sm text-gray-600 mt-1">We'll send our Naira account details to this email</p>
                      </div>

                      <Button className="w-full" onClick={sendAccountDetails} disabled={loading || !exchangeData.email}>
                        {loading ? "Sending..." : "Get Account Details"}
                      </Button>
                      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}

                      {accountDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-50 p-6 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-4">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold">Account details sent to your email!</span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Bank Name:</strong> {accountDetails.bankName}
                            </p>
                            <p>
                              <strong>Account Name:</strong> {accountDetails.accountName}
                            </p>
                            <p>
                              <strong>Account Number:</strong> {accountDetails.accountNumber}
                            </p>
                            <p className="text-blue-600 font-medium">
                              Please make your payment to this account and proceed to the next step
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amount" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Exchange Amount & Receipt</h3>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="amount">Amount in Naira (NGN)</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={exchangeData.amount}
                          onChange={(e) => handleInputChange("amount", e.target.value)}
                          placeholder="Enter amount in NGN"
                          required
                        />
                      </div>

                      {exchangeResult && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-green-50 p-6 rounded-lg"
                        >
                          <h4 className="font-semibold text-green-800 mb-4">Exchange Summary</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">You Send</p>
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(Number.parseFloat(exchangeData.amount), "NGN")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">You Receive</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(exchangeResult.netAmount, "INR")}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Exchange Rate</p>
                              <p className="font-semibold">1 NGN = ₹{exchangeResult.rate.toFixed(4)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Platform Fee</p>
                              <p className="font-semibold">{formatCurrency(exchangeResult.platformFee, "INR")}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div>
                        <Label>Upload Transaction Receipt</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-4">Upload proof of payment to our Naira account</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement("input")
                              input.type = "file"
                              input.accept = "image/*,.pdf"
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) handleFileChange(file)
                              }
                              input.click()
                            }}
                          >
                            {exchangeData.receiptFile ? "Receipt Uploaded" : "Upload Receipt"}
                          </Button>
                          {exchangeData.receiptFile && (
                            <p className="text-green-600 text-sm mt-2">✓ {exchangeData.receiptFile.name}</p>
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={submitExchange}
                        disabled={loading || !exchangeData.amount || !exchangeData.receiptFile}
                      >
                        {loading ? "Submitting Exchange..." : "Submit Exchange Request"}
                      </Button>
                      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      {/* Mobile Back/Home Buttons */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-4 md:hidden z-50">
        <Button
          variant="outline"
          size="icon"
          aria-label="Back"
          onClick={() => {
            if (activeTab === "payment") setActiveTab("receive")
            else if (activeTab === "amount") setActiveTab("payment")
            else router.push("/")
          }}
          className="rounded-full shadow-lg bg-white"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Home"
          onClick={() => router.push("/")}
          className="rounded-full shadow-lg bg-white"
        >
          <Home className="h-6 w-6" />
        </Button>
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  )
}

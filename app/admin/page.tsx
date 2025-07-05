"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Users, Clock, RefreshCw } from "lucide-react"
import { formatCurrency } from "@/lib/currency-converter"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [rates, setRates] = useState({ inrToNgn: 18.21, ngnToInr: 0.0549 })
  const [balances, setBalances] = useState({ NGN: 0, INR: 0 })
  const [transactions, setTransactions] = useState([])
  const [kycRequests, setKycRequests] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ratesRes, balancesRes, transactionsRes, kycRes] = await Promise.all([
        fetch("/api/admin/rates"),
        fetch("/api/admin/balances"),
        fetch("/api/admin/transactions"),
        fetch("/api/admin/kyc-requests"),
      ])

      if (ratesRes.ok) {
        const ratesData = await ratesRes.json()
        setRates(ratesData)
      }

      if (balancesRes.ok) {
        const balancesData = await balancesRes.json()
        setBalances(balancesData)
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData)
      }

      if (kycRes.ok) {
        const kycData = await kycRes.json()
        setKycRequests(kycData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  const updateRates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      })

      if (response.ok) {
        alert("Exchange rates updated successfully!")
      }
    } catch (error) {
      console.error("Failed to update rates:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateBalance = async (currency: string, amount: number) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/balances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency, amount }),
      })

      if (response.ok) {
        fetchDashboardData()
        alert(`${currency} balance updated successfully!`)
      }
    } catch (error) {
      console.error("Failed to update balance:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveKyc = async (userId: number) => {
    try {
      const response = await fetch("/api/admin/kyc/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        fetchDashboardData()
        alert("KYC approved successfully!")
      }
    } catch (error) {
      console.error("Failed to approve KYC:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">NGN Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(balances.NGN, "NGN")}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">INR Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(balances.INR, "INR")}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Transactions</p>
                    <p className="text-2xl font-bold">
                      {transactions.filter((t: any) => t.status === "pending").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">KYC Requests</p>
                    <p className="text-2xl font-bold">{kycRequests.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="rates" className="space-y-6">
            <TabsList>
              <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
              <TabsTrigger value="balances">Account Balances</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="kyc">KYC Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="rates">
              <Card>
                <CardHeader>
                  <CardTitle>Update Exchange Rates</CardTitle>
                  <CardDescription>Set current exchange rates for the platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inrToNgn">INR to NGN Rate</Label>
                      <Input
                        id="inrToNgn"
                        type="number"
                        step="0.0001"
                        value={rates.inrToNgn}
                        onChange={(e) => setRates((prev) => ({ ...prev, inrToNgn: Number.parseFloat(e.target.value) }))}
                      />
                      <p className="text-sm text-gray-600 mt-1">Current: 1 INR = ₦{rates.inrToNgn}</p>
                    </div>
                    <div>
                      <Label htmlFor="ngnToInr">NGN to INR Rate</Label>
                      <Input
                        id="ngnToInr"
                        type="number"
                        step="0.0001"
                        value={rates.ngnToInr}
                        onChange={(e) => setRates((prev) => ({ ...prev, ngnToInr: Number.parseFloat(e.target.value) }))}
                      />
                      <p className="text-sm text-gray-600 mt-1">Current: 1 NGN = ₹{rates.ngnToInr}</p>
                    </div>
                  </div>
                  <Button onClick={updateRates} disabled={loading}>
                    {loading ? "Updating..." : "Update Rates"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balances">
              <Card>
                <CardHeader>
                  <CardTitle>Account Balances</CardTitle>
                  <CardDescription>Update available balances for each currency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Nigerian Naira (NGN)</h3>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(balances.NGN, "NGN")}</p>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Enter new balance" id="ngnBalance" />
                        <Button
                          onClick={() => {
                            const input = document.getElementById("ngnBalance") as HTMLInputElement
                            updateBalance("NGN", Number.parseFloat(input.value))
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Indian Rupee (INR)</h3>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(balances.INR, "INR")}</p>
                      <div className="flex gap-2">
                        <Input type="number" placeholder="Enter new balance" id="inrBalance" />
                        <Button
                          onClick={() => {
                            const input = document.getElementById("inrBalance") as HTMLInputElement
                            updateBalance("INR", Number.parseFloat(input.value))
                          }}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Monitor all platform transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount Sent</TableHead>
                        <TableHead>Amount Received</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell>#{transaction.id}</TableCell>
                          <TableCell>{transaction.sender_email}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount_sent, "NGN")}</TableCell>
                          <TableCell>{formatCurrency(transaction.amount_received, "INR")}</TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {transaction.status === "pending" && (
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle>KYC Verification Requests</CardTitle>
                  <CardDescription>Review and approve user verification requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {kycRequests.map((request: any) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{request.full_name}</h4>
                            <p className="text-sm text-gray-600">{request.email}</p>
                            <p className="text-sm text-gray-600">School: {request.school_name}</p>
                            <p className="text-sm text-gray-600">Passport: {request.passport_number}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => approveKyc(request.user_id)}>
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}

"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, Clock, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/currency-converter";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [newRate, setNewRate] = useState({ from: "INR", to: "NGN", rate: "" });
  const [rateMessage, setRateMessage] = useState("");
  const [exchangeRequests, setExchangeRequests] = useState<any[]>([]);
  const [kycRequests, setKycRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchExchangeRates();
    fetchExchangeRequests();
    fetchKycRequests();
  }, []);

  async function fetchStats() {
    // TODO: Implement stats API
  }
  async function fetchTransactions() {
    // TODO: Implement transactions API
  }
  async function fetchExchangeRates() {
    const res = await fetch("/api/admin/exchange-rates");
    if (res.ok) setExchangeRates(await res.json());
  }
  async function handleAddRate(e: React.FormEvent) {
    e.preventDefault();
    setRateMessage("");
    const res = await fetch("/api/admin/exchange-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRate),
    });
    if (res.ok) {
      setRateMessage("Rate added/updated!");
      setNewRate({ from: "INR", to: "NGN", rate: "" });
      fetchExchangeRates();
    } else {
      setRateMessage("Failed to add/update rate");
    }
  }
  async function fetchExchangeRequests() {
    const res = await fetch("/api/admin/exchange-requests");
    if (res.ok) setExchangeRequests(await res.json());
  }
  async function fetchKycRequests() {
    const res = await fetch("/api/admin/kyc-requests");
    if (res.ok) setKycRequests(await res.json());
  }

  async function handleKycAction(user_id: number, status: "approved" | "rejected") {
    await fetch("/api/admin/kyc-requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, status }),
    })
    fetchKycRequests()
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <Tabs defaultValue="rates" className="mb-8">
        <TabsList>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          <TabsTrigger value="requests">User Exchange Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="rates">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage Exchange Rates</CardTitle>
              <CardDescription>View, add, or update exchange rates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRate} className="flex flex-wrap gap-2 items-end mb-4">
                <div>
                  <label className="block text-xs">From</label>
                  <Input value={newRate.from} onChange={e => setNewRate(r => ({ ...r, from: e.target.value }))} required className="w-24" />
                </div>
                <div>
                  <label className="block text-xs">To</label>
                  <Input value={newRate.to} onChange={e => setNewRate(r => ({ ...r, to: e.target.value }))} required className="w-24" />
                </div>
                <div>
                  <label className="block text-xs">Rate</label>
                  <Input value={newRate.rate} onChange={e => setNewRate(r => ({ ...r, rate: e.target.value }))} required className="w-24" type="number" step="0.0001" />
                </div>
                <Button type="submit">Add/Update</Button>
                {rateMessage && <span className="ml-2 text-xs text-green-600">{rateMessage}</span>}
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRates.map((rate: any) => (
                    <TableRow key={rate.id}>
                      <TableCell>{rate.from_currency}</TableCell>
                      <TableCell>{rate.to_currency}</TableCell>
                      <TableCell>{rate.rate}</TableCell>
                      <TableCell>{rate.updated_at ? new Date(rate.updated_at).toLocaleString() : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: List recent transactions */}
              <div className="text-gray-500">Coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Passport</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Photo</TableHead>
                    <TableHead>ID Card</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kycRequests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.user_id}</TableCell>
                      <TableCell>{req.full_name || '-'}</TableCell>
                      <TableCell>{req.nationality || '-'}</TableCell>
                      <TableCell>{req.school_name || '-'}</TableCell>
                      <TableCell>{req.passport_number || '-'}</TableCell>
                      <TableCell>{req.student_id || '-'}</TableCell>
                      <TableCell>{req.purpose_of_use || '-'}</TableCell>
                      <TableCell>{req.photo_url ? <a href={req.photo_url} target="_blank" rel="noopener noreferrer">View</a> : '-'}</TableCell>
                      <TableCell>{req.identity_card_url ? <a href={req.identity_card_url} target="_blank" rel="noopener noreferrer">View</a> : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleKycAction(req.user_id, "approved")}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleKycAction(req.user_id, "rejected")}>Reject</Button>
                        </div>
                      </TableCell>
                      <TableCell>{req.created_at ? new Date(req.created_at).toLocaleString() : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>User Exchange Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exchangeRequests.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.user_id}</TableCell>
                      <TableCell>{req.amount}</TableCell>
                      <TableCell>{req.receive_method}</TableCell>
                      <TableCell>{req.email}</TableCell>
                      <TableCell>{req.receiver_whatsapp}</TableCell>
                      <TableCell>{req.receipt_url ? <a href={req.receipt_url} target="_blank" rel="noopener noreferrer">View</a> : "-"}</TableCell>
                      <TableCell>{req.status}</TableCell>
                      <TableCell>{req.created_at ? new Date(req.created_at).toLocaleString() : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
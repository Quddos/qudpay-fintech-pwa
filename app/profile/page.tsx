// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Home, ArrowLeftRight, FileText, TrendingUp, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [kycStatus, setKycStatus] = useState("pending");
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem("userName"));
    }
    fetch("/api/user/kyc-status").then(res => res.json()).then(data => setKycStatus(data.kyc_status || "pending"));
    fetch("/api/user/transactions").then(res => res.json()).then(data => setTotalTransactions(data.total || 0));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white/80 rounded-lg shadow p-4 mb-4">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-blue-700" />
          <span className="font-semibold text-blue-700 text-lg">{userName ? `Welcome, ${userName}` : "Profile"}</span>
        </div>
        <Button variant="outline" onClick={() => router.push("/")}>Home</Button>
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
          <div className="font-semibold">KYC Status</div>
          <div className={`text-sm mt-1 ${kycStatus === "approved" ? "text-green-600" : kycStatus === "rejected" ? "text-red-600" : "text-yellow-600"}`}>{kycStatus}</div>
          <Button size="sm" className="mt-2" onClick={() => router.push("/kyc")}>Update KYC</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
          <div className="font-semibold">Total Transactions</div>
          <div className="text-2xl mt-1">{totalTransactions}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <FileText className="h-8 w-8 text-purple-600 mb-2" />
          <div className="font-semibold">Transaction Receipts</div>
          <Button size="sm" className="mt-2" onClick={() => router.push("/profile/receipts")}>Download Receipts</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <ArrowLeftRight className="h-8 w-8 text-orange-600 mb-2" />
          <div className="font-semibold">Be a Seller / Invest</div>
          <Button size="sm" className="mt-2" onClick={() => router.push("/sell")}>Sell to Us / Invest</Button>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <Home className="h-8 w-8 text-pink-600 mb-2" />
          <div className="font-semibold">Take a Loan</div>
          <Button size="sm" className="mt-2" onClick={() => alert("Loan feature coming soon!")}>Take a Loan</Button>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center py-2 z-50 md:hidden">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}><Home className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" onClick={() => router.push("/exchange")}><ArrowLeftRight className="h-6 w-6" /></Button>
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}><User className="h-6 w-6" /></Button>
      </nav>
    </div>
  );
}
// KYC loading indicator (add to app/kyc/page.tsx, near the submit button):
// {loading && (
//   <div className="flex justify-center items-center py-4">
//     <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></span>
//     <span>Submitting...</span>
//   </div>
// )} 
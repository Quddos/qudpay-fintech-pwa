"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Globe, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateExchange, formatCurrency } from "@/lib/currency-converter"
import Link from "next/link"

export default function LandingPage() {
  const [amount, setAmount] = useState<string>("10000")
  const [fromCurrency, setFromCurrency] = useState<string>("INR")
  const [toCurrency, setToCurrency] = useState<string>("NGN")
  const [exchangeResult, setExchangeResult] = useState<any>(null)

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      const result = calculateExchange(Number.parseFloat(amount), fromCurrency, toCurrency)
      setExchangeResult(result)
    }
  }, [amount, fromCurrency, toCurrency])

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Lightning Fast",
      description: "Money credited within 5-10 minutes",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure & Safe",
      description: "Bank-level security for all transactions",
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "Best Rates",
      description: "Competitive exchange rates with transparency",
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "P2P Marketplace",
      description: "Trade directly with other students",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-blue-600"
          >
            QudPay
          </motion.div>
          <nav className="hidden md:flex space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600">
              How it Works
            </Link>
            <Link href="#rates" className="text-gray-600 hover:text-blue-600">
              Rates
            </Link>
          </nav>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/exchange">Start Exchange</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Send Money Home
            <span className="text-blue-600"> Instantly</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            The fastest and most secure way for Nigerian students in India to exchange money. Get credited within 5-10
            minutes with the best rates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <Link href="/exchange">
                Start Exchange <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Animated Money Flow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🇮🇳</span>
                </div>
                <p className="font-semibold">India</p>
                <p className="text-sm text-gray-600">Send ₹</p>
              </div>

              <motion.div
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="flex-1 flex justify-center"
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">₹</span>
                  </motion.div>
                  <div className="w-16 h-1 bg-blue-200 rounded">
                    <motion.div
                      animate={{ x: [0, 64, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="w-4 h-1 bg-blue-600 rounded"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                    className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm">₦</span>
                  </motion.div>
                </div>
              </motion.div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🇳🇬</span>
                </div>
                <p className="font-semibold">Nigeria</p>
                <p className="text-sm text-gray-600">Receive ₦</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Credited in 5-10 minutes</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Real-time Currency Converter */}
      <section id="rates" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Our Live Rates</h2>
            <p className="text-gray-600">See exactly how much you'll receive before you start</p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="text-lg"
                  />
                </div>

                {exchangeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg"
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-600">You will receive</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(exchangeResult.netAmount, toCurrency)}
                      </p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="text-gray-600">Exchange Rate</p>
                        <p className="font-semibold">
                          1 {fromCurrency} = {exchangeResult.rate.toFixed(4)} {toCurrency}
                        </p>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">Platform Fee</p>
                        <p className="font-semibold">{formatCurrency(exchangeResult.platformFee, toCurrency)}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link href="/exchange">
                      Start Exchange Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QudPay?</h2>
            <p className="text-gray-600">The most trusted platform for student money exchange</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">Complete your exchange in just 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Choose Exchange",
                description: "Select your preferred exchange direction and amount",
                icon: "💱",
              },
              {
                step: "2",
                title: "Make Payment",
                description: "Send money to our secure account and upload receipt",
                icon: "💳",
              },
              {
                step: "3",
                title: "Get Credited",
                description: "Receive your money within 5-10 minutes",
                icon: "✅",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">QudPay</h3>
              <p className="text-gray-400">Secure money exchange for Nigerian students in India</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/exchange">Exchange</Link></li>
                <li><Link href="#rates">Rates</Link></li>
                <li><Link href="#features">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">KYC Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 QudPay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

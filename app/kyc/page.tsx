"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Camera, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function KYCPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    nationality: "Nigerian",
    residentialAddress: "",
    schoolName: "",
    passportNumber: "",
    studentId: "",
    purposeOfUse: "",
    photoFile: null as File | null,
    identityCardFile: null as File | null,
    studentIdFile: null as File | null,
  })

  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Upload files to Vercel Blob
      const uploadFile = async (file: File, type: string) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", type)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")
        const { url } = await response.json()
        return url
      }

      const photoUrl = formData.photoFile ? await uploadFile(formData.photoFile, "photo") : null
      const identityCardUrl = formData.identityCardFile ? await uploadFile(formData.identityCardFile, "identity") : null
      const studentIdUrl = formData.studentIdFile ? await uploadFile(formData.studentIdFile, "student-id") : null

      // Submit KYC data
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photoUrl,
          identityCardUrl,
          studentIdUrl,
        }),
      })

      if (response.ok) {
        router.push("/dashboard?kyc=submitted")
      }
    } catch (error) {
      console.error("KYC submission failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Enter your full name as on passport"
                required
              />
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Select value={formData.nationality} onValueChange={(value) => handleInputChange("nationality", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nigerian">Nigerian</SelectItem>
                  <SelectItem value="Ghanaian">Ghanaian</SelectItem>
                  <SelectItem value="Kenyan">Kenyan</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="residentialAddress">Residential Address in India</Label>
              <Textarea
                id="residentialAddress"
                value={formData.residentialAddress}
                onChange={(e) => handleInputChange("residentialAddress", e.target.value)}
                placeholder="Enter your complete address in India"
                required
              />
            </div>

            <div>
              <Label htmlFor="schoolName">School/University Name</Label>
              <Input
                id="schoolName"
                value={formData.schoolName}
                onChange={(e) => handleInputChange("schoolName", e.target.value)}
                placeholder="Enter your institution name"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Identity Verification</h3>

            <div>
              <Label htmlFor="passportNumber">International Passport Number</Label>
              <Input
                id="passportNumber"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange("passportNumber", e.target.value)}
                placeholder="Enter passport number"
                required
              />
            </div>

            <div>
              <Label htmlFor="studentId">Student ID Number</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                placeholder="Enter student ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="purposeOfUse">Purpose of Using Platform</Label>
              <Select value={formData.purposeOfUse} onValueChange={(value) => handleInputChange("purposeOfUse", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="family-support">Send money to family</SelectItem>
                  <SelectItem value="personal-expenses">Personal expenses</SelectItem>
                  <SelectItem value="education-fees">Education fees</SelectItem>
                  <SelectItem value="business">Business transactions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Document Upload</h3>

            <div>
              <Label>Live Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Take a live photo of yourself</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.capture = "user"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileChange("photoFile", file)
                    }
                    input.click()
                  }}
                >
                  {formData.photoFile ? "Photo Captured" : "Take Photo"}
                </Button>
                {formData.photoFile && (
                  <div className="mt-2 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Photo uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Identity Card (Passport/National ID)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Upload clear photo of your identity card</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileChange("identityCardFile", file)
                    }
                    input.click()
                  }}
                >
                  {formData.identityCardFile ? "Document Uploaded" : "Upload Document"}
                </Button>
                {formData.identityCardFile && (
                  <div className="mt-2 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Document uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Student ID Card</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Upload clear photo of your student ID</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = "image/*"
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileChange("studentIdFile", file)
                    }
                    input.click()
                  }}
                >
                  {formData.studentIdFile ? "Student ID Uploaded" : "Upload Student ID"}
                </Button>
                {formData.studentIdFile && (
                  <div className="mt-2 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Student ID uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Complete Your KYC Verification</CardTitle>
              <CardDescription>
                Step {step} of 3 - We need to verify your identity to ensure secure transactions
              </CardDescription>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </CardHeader>

            <CardContent>
              {renderStep()}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>
                    Previous
                  </Button>
                )}

                <div className="ml-auto">
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={
                        (step === 1 && (!formData.fullName || !formData.residentialAddress || !formData.schoolName)) ||
                        (step === 2 && (!formData.passportNumber || !formData.studentId || !formData.purposeOfUse))
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={loading || !formData.photoFile || !formData.identityCardFile || !formData.studentIdFile}
                    >
                      {loading ? "Submitting..." : "Submit KYC"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

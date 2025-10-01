"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UploadResume from "./UploadResume"
import JobDescription from "./JobDescription"

function InterViewDialog() {
  const router = useRouter()
  const { user } = useUser()
  const [formData, setFormData] = useState<any>({})
  const [isCreating, setIsCreating] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const createVideoInterview = useMutation(api.videoInterviews.createVideoInterview)
  const getUserByEmail = useQuery(
    api.users.getByEmail,
    user?.primaryEmailAddress?.emailAddress ? { email: user.primaryEmailAddress.emailAddress } : "skip",
  )

  const onHandleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleResumeUpload = (files: File[]) => {
    if (files.length > 0) {
      setResumeFile(files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!getUserByEmail?._id) {
      alert("User not found. Please try again.")
      return
    }

    if (!formData.jobTitle) {
      alert("Please provide a job title")
      return
    }

    setIsCreating(true)

    try {
      // Create video interview session in Convex
      const sessionId = await createVideoInterview({
        userId: getUserByEmail._id,
        jobTitle: formData.jobTitle,
        jobDescription: formData.jobDescription,
        // In a real implementation, you would upload the resume file to storage first
        resumeUrl: resumeFile ? `resume_${Date.now()}.pdf` : undefined,
      })

      // Navigate to the video interview page
      router.push(`/video-interview/${sessionId}`)
    } catch (error) {
      console.error("[v0] Error creating video interview:", error)
      alert("Failed to create video interview. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            + Create Video Interview
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-3xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create AI Video Interview</DialogTitle>
              <DialogDescription>
                <Tabs defaultValue="job-description" className="w-full mt-5">
                  <TabsList>
                    <TabsTrigger value="job-description">Job Description</TabsTrigger>
                    <TabsTrigger value="upload-resume">Upload Resume (Optional)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="job-description">
                    <JobDescription onHandleInputChange={onHandleInputChange} />
                  </TabsContent>
                  <TabsContent value="upload-resume">
                    <UploadResume onFileUpload={handleResumeUpload} />
                  </TabsContent>
                </Tabs>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={isCreating}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Start Video Interview"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default InterViewDialog

'use client'
import React, { useState } from 'react'
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
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UploadResume from './UploadResume'
import JobDescription from './JobDescription'

function InterViewDialog() {
    const [formData, setFormData] = useState<any>();

    const onHandleInputChange=(field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    }
    return (
        <div>
            <Dialog>
                <form>
                    <DialogTrigger asChild>
                        <Button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">+ Create Video Interview</Button>
                    </DialogTrigger>
                    <DialogContent className="min-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Submit Your Details</DialogTitle>
                            <DialogDescription>
                                <Tabs defaultValue="upload-resume" className="w-full mt-5">
                                    <TabsList>
                                        <TabsTrigger value="upload-resume">Upload Resume</TabsTrigger>
                                        <TabsTrigger value="job-description">Job Description</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="upload-resume">
                                        <UploadResume />
                                    </TabsContent>
                                    <TabsContent value="job-description">
                                        <JobDescription onHandleInputChange={onHandleInputChange} />
                                    </TabsContent>
                                </Tabs>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </div>
    )
}

export default InterViewDialog
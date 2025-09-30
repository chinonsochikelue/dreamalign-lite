'use client'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'
import { Label } from 'recharts'

function JobDescription({ onHandleInputChange }: { onHandleInputChange: (field: string, value: string) => void }) {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJobTitle(e.target.value);
        onHandleInputChange('jobTitle', e.target.value);
    };

    const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setJobDescription(e.target.value);
        onHandleInputChange('jobDescription', e.target.value);
    };

    return (
        <div className='p-4'>
            <div>
                <Label>Job Title</Label>
                <Input value={jobTitle} onChange={handleJobTitleChange} placeholder='Ex: Software Engineer' className='mb-4' />
            </div>
            <div className='mt-4'>
                <Label>Job Description</Label>
                <Textarea value={jobDescription} onChange={handleJobDescriptionChange} placeholder='Enter or paste your job description here...' className='w-full h-40 p-2 border border-gray-300 rounded-md mt-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500' />
            </div>
        </div>
    )
}

export default JobDescription
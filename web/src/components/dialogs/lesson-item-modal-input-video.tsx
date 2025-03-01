import React, { useCallback, useEffect, useState, memo} from "react"
import { Input } from "@/components/ui/input"
import { useDropzone } from 'react-dropzone'

export const InputVideo = memo(({onUpload, videoFileName}: any) => {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const onDrop = useCallback((acceptedFiles: File[]) => { setVideoFile(acceptedFiles[0]) }, [])
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'video/*': ['.mp4', '.mov', '.mkv'] },
        onDrop,
    })
    
    useEffect(() => {
        onUpload(videoFile)
    }, [videoFile, onUpload])

    return (
        <div className="w-full h-full" {...getRootProps()} >
            <Input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" {...getInputProps()}/>
            <div className="h-full w-full border border-[#F0E9E9] rounded-md flex items-center justify-center text-center bg-[#FBFCFF]">
                {videoFileName || 'Drop Video File (.mp4, .mov, .mkv)'}
            </div>
        </div>
    )
})

export const LessonItemModalInputVideo = memo(InputVideo)
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    BookOpen,
    GraduationCap,
    Users,
    Code,
    Palette,
    ChartBar,
    Search,
    LoaderCircle,
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Router } from 'next/router'
import { useQuery } from '@tanstack/react-query' 
import { useRouter } from 'next/navigation' 
import { getTest } from '../../api/query/test'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
}

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

export default function Component() {

    const { data: courseData, isLoading } = useQuery({
        queryKey: ['get-test'],
        queryFn: async () => {
            return await getTest()
        },
    })
    console.log("COURSE DATA",courseData)
    
    const router = useRouter()

    return (
        <div className="flex flex-col min-h-screen bg-white text-[#121212]">
            
             neek
        </div>
    )
}

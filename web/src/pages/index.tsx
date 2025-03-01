 import { useQuery } from '@tanstack/react-query' 
import { useRouter } from 'next/navigation' 
import { getTest } from '../../api/query/test'
import Tower from '@/components/common/tower'

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
        <div className="flex min-h-screen bg-gradient-to-br from-gray-950 to-indigo-950 text-slate-200 justify-center items-center p-4">
            {/* <Tower /> */}

            <div onClick={()=>router.push("/auth/login")} className="relative group bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold text-lg py-4 px-8 rounded-lg shadow-lg transition-all duration-300 overflow-hidden w-64">
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative z-10">ENTER TOWER</span>
                
                {/* Elegant corner accents */}
                <span className="absolute h-8 w-8 border-t-2 border-l-2 border-white/50 top-1 left-1 rounded-tl-md"></span>
                <span className="absolute h-8 w-8 border-t-2 border-r-2 border-white/50 top-1 right-1 rounded-tr-md"></span>
                <span className="absolute h-8 w-8 border-b-2 border-l-2 border-white/50 bottom-1 left-1 rounded-bl-md"></span>
                <span className="absolute h-8 w-8 border-b-2 border-r-2 border-white/50 bottom-1 right-1 rounded-br-md"></span>
                
                {/* Subtle glow effect */}
                <span className="absolute inset-0 -z-10 bg-cyan-400/30 blur-xl scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></span>
            </div>
        </div>
    )
}

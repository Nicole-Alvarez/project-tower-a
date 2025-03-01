import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const Header = () => {
  return (
 <motion.header 
                className="px-4 lg:px-6 h-16 flex items-center border-b border-[#7632db]/20 "
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="items-center flex">
                    <Link href="/">
                        <img
                            src="/header-logo.png"
                            alt="Logo"
                            className="h-12"
                        />
                    </Link>
                </div>
                <div className="flex items-center ml-4 md:ml-6 mr-4 md:mr-6 flex-1">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            className="pl-8 bg-gray-100 focus:bg-white transition-colors"
                            placeholder="Search courses..."
                            type="search"
                        />
                    </div>
                </div>
                <nav className="flex gap-4 sm:gap-6 items-center">
                    <Link
                        className="text-sm font-medium hover:text-[#7632db]"
                        href="#features"
                    >
                        Features
                    </Link>
                    <Link
                        className="text-sm font-medium hover:text-[#7632db]"
                        href="#"
                    >
                        About
                    </Link>
                    <Link
                        className="text-sm font-medium hover:text-[#7632db]"
                        href="#"
                    >
                        Schedule a demo
                    </Link>
                    <Button
                        onClick={() =>
                            (window.location.href = '/auth/studentsignup')
                        }
                        className="bg-[#10172a] text-white hover:bg-[#7632db]/90"
                        size="sm"
                    >
                        Sign up
                    </Button>
                </nav>
            </motion.header>
  )
}

export default Header

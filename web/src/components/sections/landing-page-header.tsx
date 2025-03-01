import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/router'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export const LandingPageHeader = () => {
    const router = useRouter()
    const {
        session: { token },
    } = useAuth()

    const navItems = [
        { label: 'Categories', onClick: () => {} },
        { label: 'Courses', onClick: () => router.push('/') },
        { label: 'About', onClick: () => {} },
        { label: 'Contact Us', onClick: () => {} },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <img
                    src="/header-logo.png"
                    alt="Logo"
                    className="h-8 w-auto hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={() => router.push('/')}
                />

                {/* Mobile Menu */}
                <div className="lg:hidden">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            {navItems.map((item) => (
                                <DropdownMenuItem
                                    key={item.label}
                                    onClick={item.onClick}
                                    className="cursor-pointer"
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                            {!token && (
                                <>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                            router.push('/auth/studentsignup')
                                        }
                                    >
                                        Sign up
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() =>
                                            router.push('/auth/signin')
                                        }
                                    >
                                        Login
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                {!token && (
                    <div className="hidden lg:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/auth/studentsignup')}
                            className="text-sm font-medium"
                        >
                            Sign up
                        </Button>
                        <Button
                            onClick={() => router.push('/auth/signin')}
                            className="text-sm font-medium"
                        >
                            Login
                        </Button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default LandingPageHeader

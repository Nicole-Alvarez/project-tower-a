import { useRouter } from 'next/router'
import {
    AdminSidebarItems,
    TeacherSidebarItems,
    SidebarItemsType,
    SidebarIcons,
} from './sidebar-items'
import { useAuth } from '@/providers/AuthProvider'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { BookText, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getUnreadMessages } from '../../../api/query/messages'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type SideBarProps = {
    role: string
}

const SideBar = React.memo(({ role }: SideBarProps) => {
    const router = useRouter()
    const { session } = useAuth()
    const [isOpen, setIsOpen] = useState(true)

    const { data: unreadMessages } = useQuery({
        queryKey: ['unread-message', session?.user?.id],
        queryFn: async () => await getUnreadMessages(Number(session?.user?.id)),
        enabled: !!session?.user,
        refetchInterval: 1000,
    })

    const containerControls = useAnimationControls()

    const checkRoute = (link: SidebarItemsType['link']) => {
        return link === '/admin' || link === '/teacher'
            ? router.asPath === link
            : router.asPath.startsWith(link)
    }

    const handleRedirect = (link: SidebarItemsType['link']) => router.push(link)

    const getSidebarItems = useMemo(() => {
        switch (role) {
            case 'ADMIN':
                return AdminSidebarItems
            case 'TEACHER':
                return TeacherSidebarItems
            default:
                return []
        }
    }, [role])

    useEffect(() => {
        const handleResize = () => setIsOpen(window.innerWidth > 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        containerControls.start(isOpen ? 'open' : 'close')
    }, [isOpen, containerControls])

    return (
        <motion.nav
            variants={{
                open: { width: '240px' },
                close: { width: '80px' },
            }}
            animate={containerControls}
            initial="open"
            className="bg-white z-50 h-screen shadow-md flex flex-col border-r border-gray-200"
        >
            <div className="p-4 flex items-center justify-between">
                <div
                    className={cn(
                        'flex items-center',
                        !isOpen && 'justify-center w-full'
                    )}
                >
                    <BookText size={24} className="text-primary mr-2" />
                    {isOpen && (
                        <div>
                            <h1 className="font-bold text-xl text-primary">
                                LMS
                            </h1>
                            <p className="text-xs text-gray-500">
                                Learning Management System
                            </p>
                        </div>
                    )}
                </div>
                {/**<Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn('', !isOpen && 'absolute right-0 top-4')}
                >
                    {isOpen ? (
                        <ChevronLeft size={20} />
                    ) : (
                        <ChevronRight size={20} />
                    )}
                </Button>**/}
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-2">
                    {getSidebarItems.map(
                        (item: SidebarItemsType, index: number) => {
                            const isSelected = checkRoute(item.link)
                            return (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={
                                                    isSelected
                                                        ? 'default'
                                                        : 'ghost'
                                                }
                                                className={cn(
                                                    'w-full justify-start my-1',
                                                    isSelected &&
                                                        'bg-primary text-primary-foreground hover:bg-primary/90',
                                                    !isOpen && 'px-2'
                                                )}
                                                onClick={() =>
                                                    handleRedirect(item.link)
                                                }
                                            >
                                                <SidebarIcons
                                                    icon={item.icon}
                                                    isSelected={isSelected}
                                                />
                                                {isOpen && (
                                                    <span className="flex-grow text-left">
                                                        {item.label}
                                                        {item.label ===
                                                            'Chats' &&
                                                            unreadMessages >
                                                                0 && (
                                                                <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                                                    {
                                                                        unreadMessages
                                                                    }
                                                                </span>
                                                            )}
                                                    </span>
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        {!isOpen && (
                                            <TooltipContent side="right">
                                                <p>{item.label}</p>
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        }
                    )}
                </div>
            </ScrollArea>
        </motion.nav>
    )
})

SideBar.displayName = 'SideBar'

export default SideBar

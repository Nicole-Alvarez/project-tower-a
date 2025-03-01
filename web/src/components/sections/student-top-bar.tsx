import React, { useEffect } from 'react'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Button } from '../ui/button'
import {  LogOut, } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/router'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import AnimatedDiv from '../animated/div'
import { ProfilePicture } from '../modals/manage-profile/edit-user-photo'
import { IUser } from '@/interfaces/user.interface'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../../../api/query/users'
import { getUnreadMessages } from '../../../api/query/messages'

interface Props {
  onSearch?: (value: string) => void,
  search?: string ;
  setSearch?: any;
  loginUserData?:IUser
}

export default function StudentTopBar({ onSearch, search, setSearch, }: Props) {
  const { loading, session, logout } = useAuth();
  const router = useRouter();
  const role = session.user?.userType || ""

  useEffect(() => {
    if (loading) return;
    if (!session.token || !session.user) {
        router.push('/');
        return;
    }

    if (role !== 'STUDENT') {
        logout();
        router.push('/');
        return;
      }
}, [loading, session, router]);

  const handleLogout =  () => {
    logout();
    router.push("/");
  }

  const forEnrolledListMenu = [
    { label: "Courses", route: "/student/courses" },
    { label: "My Enrolled Courses", route: "/student" },
    { label: "My Certificates", route: "/student/certificates" },
    { label: "Profile", route: "/student/profile" },
    { label: "Chats", route: "/student/chats" },
  ];

  const forLessonListMenu = [
    { label: "Browse", route: "/student/courses" },
    { label: "My Courses", route: "/student" },
    { label: "My Certificates", route: "/student/certificates" },
    { label: "Profile", route: "/student/profile" },
    { label: "Chats", route: "/student/chats" },
  ];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['unread-message', session?.user?.id],
    queryFn: async () => {
        return await getUnreadMessages(Number(session?.user?.id))
    },
    enabled: !!session?.user,
    refetchInterval: 1000,
});

  const isActiveRoute = (route: string) => {
    return router.asPath === route || router.asPath.startsWith(route + '/details');
  };

  const {
      data: loginUserData, 
  } = useQuery({
      queryKey: ['user-data', session?.user?.id],
      queryFn: async() => await getUserById(Number(session.user?.id)),
      enabled: !!session?.user?.id
  });

  return (
    <div className="w-full bg-white px-5 py-4 border-b border-b-[#57545D]/10 flex flex-col lg:flex-row items-center justify-between gap-[20px] lg:gap-[50px]">
      <div className="flex gap-[25px] lg:gap-[58px]">
        <img src="/logo-wrapped.png" className="hidden lg:block lg:h-[52px] rounded-sm " />
        <div className="flex items-center gap-[41px]">
          {router.asPath === '/student' ? forEnrolledListMenu.map((item, index) => (
            <AnimatedDiv animation='Bubble'>
              <Link
                key={index}
                href={item.route}
                className={`text-[#292521] text-[12px] lg:text-[16px] font-bold py-3 hover:text-[#7435D9] ${isActiveRoute(item.route) ? 'text-[#7435D9] border-b-2 border-b-[#7435D9]' : ''
                  }`}
              >
                {item.label}
                {item.label === 'Chats' && (<span className="bg-red-400 text-white rounded-full px-2 py-1 ml-1 text-[10px]">{data}</span>)}
              </Link>
            </AnimatedDiv>
          )) : forLessonListMenu.map((item, index) => (
            <AnimatedDiv animation='Bubble'>
              <Link
                key={index}
                href={item.route}
                className={`text-[#292521] text-[12px] lg:text-[16px] font-bold py-3 hover:text-[#7435D9] ${isActiveRoute(item.route) ? 'text-[#7435D9] border-b-2 border-b-[#7435D9]' : ''
                  }`}
              >
                {item.label}
                {item.label === 'Chats' && (<span className="bg-red-400 text-white rounded-full px-2 py-1 ml-1 text-[10px]">{data}</span>)}
              </Link>
            </AnimatedDiv>
          ))}
          <div className="lg:hidden flex justify-end items-center space-x-6">
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={session.user?.profilePicture} />
                  <AvatarFallback >
                    {session.user?.name[0]}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <h1>Account</h1>
                <Separator className='mt-2 mb-4' />
                <Button
                  variant={'secondary'}
                  className='w-full flex items-center gap-2'
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex justify-end items-center space-x-6">
        {router.asPath === '/student' && (
          <p className='text-[16px] font-[700] text-nowrap'>
            {session.user?.name}
          </p>
        )}
        <Popover>
          <PopoverTrigger>
            <Avatar>
              <AvatarImage src={loginUserData?.profilePicture} />
              <AvatarFallback >
                {session.user?.name[0]}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] flex flex-col px-3 mr-2" side="bottom">
            <h1 className="p-2 text-[14px] font-semibold">Account</h1>
            <Separator/>
            <div className="py-2 space-y-2">
                <ProfilePicture 
                    id={session.user?.id} 
                    loginUserData={loginUserData}
                /> 
                <Button className="w-full flex flex-row gap-x-2 items-center" variant="secondary" onClick={handleLogout}>
                    <LogOut size={14} />
                    <p className="font-medium text-[12px]">Logout</p>
                </Button>
            </div>
          </PopoverContent>
          {/* <PopoverContent>
            <div className=' flex items-center  justify-between pl-1 '>
              <h1>Account</h1>
            <ProfilePicture 
              id={session.user?.id} 
              loginUserData={loginUserData}
              refetchLoginUserData={refetchLoginUserData}
            />            
            </div>
            <Separator className='mt-2 mb-4' />
            <Button
              variant={'secondary'}
              className='w-full flex items-center gap-2'
              onClick={logout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </PopoverContent> */}
        </Popover>
        </div>
    </div>
  )
}

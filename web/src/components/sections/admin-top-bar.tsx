import AnimatedDiv from "../animated/div";
import { useAuth } from "@/providers/AuthProvider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ProfilePicture } from "../modals/manage-profile/edit-user-photo";
import { IUser } from "@/interfaces/user.interface";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getAdminById, getUserById } from "../../../api/query/users";

interface TopBarProps {
    LeftSideComponent?: React.ReactNode
    loginUserData?:IUser
}

const AdminTopBar = ({LeftSideComponent }: TopBarProps) => {

    const { session: { user }, logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const { 
        data: loginUserData, 
        refetch: refetchLoginUserData 
    } = useQuery({
        queryKey: ['user-data', user?.id, user?.userType],
        queryFn: async () => {
            if (user?.userType === "ADMIN" ) {
                return await getAdminById(Number(user?.id));
            } else if (user?.userType === 'TEACHER') {
                return await getUserById(Number(user?.id));
            }
        },
        enabled: !!user?.id,
        staleTime: 0,
    });

    return (
        <AnimatedDiv className="" delay={0} animation="SlideDown">
            <div className="bg-white w-full items-center px-[36px] lg:px-[38px] h-[59px]  flex flex-row justify-between sticky top-0 z-10">
                <div className="flex-1">{LeftSideComponent}</div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={loginUserData?.profilePicture} />
                            <AvatarFallback className="bg-[#FF9345] text-white h-[34px] w-[34px] text-[14px] font-bold">
                                {user?.name[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[300px] flex flex-col px-3 mr-2" side="bottom">
                        <h1 className="p-2 text-[14px] font-semibold">Account</h1>
                        <Separator/>
                        <div className="py-2 space-y-2">
                            <ProfilePicture 
                                id={user?.id} 
                                loginUserData={loginUserData}
                            /> 
                            <Button className="w-full flex flex-row gap-x-2 items-center" variant="secondary" onClick={handleLogout}>
                                <LogOut size={14} />
                                <p className="font-medium text-[12px]">Logout</p>
                            </Button>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </AnimatedDiv >
    );
};

export default AdminTopBar;

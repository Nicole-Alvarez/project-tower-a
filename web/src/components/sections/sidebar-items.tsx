import { Button } from "@/components/ui/button";
import {
    FileQuestion,
    LayoutGrid,
    Users,
    Settings,
    LogOut,
    Book,
    FilePenLine,
    MessageCircleMore
} from "lucide-react"

export type SidebarIconsType = {
    icon: string
    isSelected: boolean
    role?: string
}
export type SidebarItemsType = {
    label: string;
    icon: string;
    link: string;
}
type LogoutButtonType = {
    handleLogout: () => void
}
export const AdminSidebarItems: Array<SidebarItemsType> = [
    { label: "Dashboard", icon: "Dashboard", link: "/admin" },
    { label: "Courses", icon: "Courses", link: "/admin/courses" },
    { label: "Accounts", icon: "Accounts", link: "/admin/accounts" },
    { label: "Site Settings", icon: "Settings", link: "/admin/settings" },
]
export const TeacherSidebarItems: Array<SidebarItemsType> = [
    { label: "Dashboard", icon: "Dashboard", link: "/teacher" },
    { label: "Courses", icon: "Courses", link: "/teacher/courses" },
    { label: "Students", icon: "Accounts", link: "/teacher/students" },
    { label: "Quizzes", icon: "FilePenLine", link: "/teacher/quizzes" },
    { label: "Essays", icon: "FilePenLine", link: "/teacher/essays" },
    { label: "Certificates", icon: "Courses", link: "/teacher/certificates" },
    { label: "Profile", icon: "Settings", link: "/teacher/profile" },
    { label: "Chats", icon: "MessageCircleMore", link: "/teacher/chats" },
]

export const SidebarIcons = ({ icon, isSelected, role }: SidebarIconsType) => {

    const color = isSelected ? '#FFFFFF' : '#29252166';
    const size = 18;
    const className = "mr-4";

    switch (icon) {
        case "Dashboard":
            return <LayoutGrid size={size} className={className} color={color} />;
        case "Courses":
            return <Book size={size} className={className} color={color} />;
        case "Accounts":
            return <Users size={size} className={className} color={color} />;
        case "Settings":
            return <Settings size={size} className={className} color={color} />;
        case "FilePenLine":
            return <FilePenLine size={size} className={className} color={color} />;
        case "MessageCircleMore":
            return <MessageCircleMore size={size} className={className} color={color} />;    

        default:
            return <FileQuestion className="mr-2" size={size} />;
    }
};
export const LogoutButton = ({ handleLogout }: LogoutButtonType) => {
    return (
        <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4 rotate-180" />
        </Button>)
}



import { useAuth } from "@/providers/AuthProvider";
import SideBar from "./sidebar";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";

type DashboardLayout = {
    children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayout) => {
    const { loading, session, logout } = useAuth();
    const role = session.user?.userType || ""
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!session.token || !session.user) {
            router.push('/');
            return;
        }

        if (role !== 'ADMIN' && role !== 'TEACHER') {
            logout();
            router.push('/');
            return;
          }
      
        if (role === 'ADMIN' && !router.asPath.startsWith('/admin')) {
            router.push('/admin');
        }
    
        if (role === 'TEACHER' && !router.asPath.startsWith('/teacher')) {
            router.push('/teacher');
        }
    }, [loading, session, router]);


    return (
        <div className="flex overflow-hidden">
            <Head>
                <title>LMS</title>
                <meta name="description" content="LMS" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <SideBar role={role} />
            <div className="w-full overflow-auto h-screen">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;

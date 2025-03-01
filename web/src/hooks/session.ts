import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const useSession = (): { session: any; loading: boolean } => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const routes = router.route.split('/');

    useEffect(() => {
        const sessionData = localStorage.getItem('user');

        if (!sessionData) {
            if (routes.includes('studentsignup')) {
                router.push('/auth/studentsignup');
            } else if (routes.includes('studentlogin')) {
                router.push('/auth/studentlogin');
            }
            setLoading(false);
            return;
        }

        if (sessionData) {
            setSession(JSON.parse(sessionData));
        }

        setLoading(false);
    }, [router]);

    return { session, loading };
};

export default useSession;

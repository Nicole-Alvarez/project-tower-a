import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import { useIdleTimer } from 'react-idle-timer'

const IdleTimer = () => {
    const idleTimerRef = useRef(null)
    const {session: {user}} = useAuth()
    const router = useRouter()

    const userType = user?.userType ?? 'student'

    const onIdle = () => {
        if (user?.id) {
            alert('You have been idle for too long. You will be logged out.')

            // Clear user session from localStorage
            localStorage.removeItem('user')
        }

        // Redirect to login
        router.replace(`/auth/${userType.toLowerCase()}login`)
    }

    useIdleTimer({
        ref: idleTimerRef,
        timeout: 1000 * 60 * 60, // 1 hour
        onIdle: onIdle,
        debounce: 500,
    })

    return <></>
}

export default IdleTimer

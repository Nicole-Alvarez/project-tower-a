import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecoilRoot } from 'recoil'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/providers/AuthProvider'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <RecoilRoot>
                    <ToastProvider>
                        <Toaster />
                        <Component {...pageProps} />
                    </ToastProvider>
                </RecoilRoot>
            </QueryClientProvider>
        </AuthProvider>
    )
}

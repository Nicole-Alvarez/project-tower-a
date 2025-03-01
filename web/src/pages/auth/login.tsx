import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/router';
import { ICredentials } from '@/interfaces/auth.interface';
import { useMutation } from '@tanstack/react-query';
import { userLogin } from '../../../api/mutation/auth';
import { useAuth } from '@/providers/AuthProvider';
import AnimatedDiv from '@/components/animated/div';

const GameLogin = () => { 
  const router = useRouter()
  const { login } = useAuth()
  
  const [logInError, setLogInError] = useState('') 
  const [email, setEmail] = useState('') 

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ICredentials) => await userLogin(data),
    onSuccess: async (data) => {
      if (data?.status === 'not_found') {
        setLogInError('Account not Found')
        return
      } 

      const token = data?.token
      const user = data?.user
      if (!token || !user) {
          setLogInError('Invalid session data')
          return
      }
      login(token, user) 
      router.push('/tower')
    },
    onError: async (error) => {
        setLogInError(error.message) 
    },
  })

  const onSubmit = async (values: any) => {
      mutate({email: values})
  }  

  console.log("email: ", email)

  return (
    <div   className="flex min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 text-slate-200 justify-center items-center p-4">
      <AnimatedDiv animation={'FadeIn'}>
        <Card className="w-full max-w-md bg-slate-900 border-purple-500 border shadow-lg shadow-purple-500/20">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 bg-purple-600 p-2 rounded-full w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M6 11h4a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1z" />
                <path d="M14 10h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1z" />
                <path d="M7 19h10a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1z" />
                <line x1="12" y1="2" x2="12" y2="22" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-white">COSMOS TOWER</CardTitle>
            <CardDescription className="text-purple-300">Enter your email to continue your adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="commander@cosmos-quest.com"
                className="bg-slate-800 border-slate-700 text-slate-200 focus:ring-purple-500 focus:border-purple-500"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            
            <Alert className="bg-indigo-900/50 border-indigo-500 text-indigo-200">
              <AlertDescription>
                {logInError === "" ? "A magic link will be sent to your email to verify your identity." : logInError}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={()=>onSubmit(email)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6">
              BEGIN JOURNEY
            </Button>
            <div className="text-sm text-center text-slate-400">
              New to Cosmos Quest? <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">Create an account</a>
            </div>
          </CardFooter>
        </Card>
      </AnimatedDiv>
    </div>
  );
};

export default GameLogin;
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, UserCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateUserImage } from '../../../../api/mutation/user'
import { IUser, IupdateImageUser } from '@/interfaces/user.interface'

const formSchema = z.object({
  profilePicture: typeof window !== 'undefined' && typeof File !== 'undefined' 
    ? z.instanceof(File).optional() 
    : z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>

interface SessionProps {
  id?: number 
  loginUserData?:IUser
}

export function ProfilePicture({ id, loginUserData }: SessionProps) {
  const [open, setOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const queryClient = useQueryClient();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const {mutate: updatePictureMutate, isPending} = useMutation({
    mutationFn: async(data: IupdateImageUser) => await updateUserImage(data),
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['teacher-info-by-id'] })
      queryClient.refetchQueries({ queryKey: ['student-info-by-id'] })
      queryClient.refetchQueries({ queryKey: ['user-data'] })
      toast({
        variant: 'default',
        title: 'Profile Picture Updated Successfully',
      });
      queryClient.refetchQueries({queryKey: ['user-data']})
      setOpen(false);
      setUploadedFile(null);
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Update Failure',
        description: error.message,
      });
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = (values: FormValues) => {
    if (!uploadedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image file',
      })
      return
    } 
    updatePictureMutate({id:id ,userType:loginUserData?.userType,image:uploadedFile})
  }

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUploadedFile(null)
      form.reset()
    }
    setOpen(newOpen)
  }

  return (
    <div className="flex flex-col items-center space-y-4">

        <Dialog open={open} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger className='w-full'>
              <Button
                variant="outline"
                className="w-full flex text-xs rounded-sm"
              >
                Edit Photo
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Profile Picture</DialogTitle>
              <DialogDescription>
                Upload a profile picture here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-col items-center space-y-4">
                          {uploadedFile ? (
                            <img
                              src={URL.createObjectURL(uploadedFile)}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover"
                            />
                          ) : (

                           <>
                           {loginUserData?.profilePicture?
                             <img
                              src={loginUserData.profilePicture}
                              alt="Profile"
                              className="w-32 h-32 rounded-full object-cover"
                            />
                           :
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserCircle className="h-12 w-12 text-gray-400" />
                              </div>}
                             
                            </>
                          )}
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="max-w-xs"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </div>
  )
}
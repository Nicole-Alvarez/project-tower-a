import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IUser } from '@/interfaces/user.interface'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '../../../api/mutation/user'
import { useToast } from '../ui/use-toast'
import { Check, LoaderPinwheel, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Full name is required',
    }),
    email: z
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .email({
            message: 'Invalid email address',
        }),
})

interface Props {
    defaultValues: IUser
}
export default function UserProfileForm({ defaultValues }: Props) {
    const [imageSrc, setImageSrc] = useState('')
    const [profilePicture, setProfilePicture] = useState<File>()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...defaultValues,
        },
    })

    const { mutate: updateMutate, isPending: updating } = useMutation({
        mutationFn: async (data: FormData) =>
            await updateUser({
                id: Number(defaultValues.id),
                data,
            }),
        onSuccess: () => {
            queryClient.refetchQueries({ queryKey: ['teacher-info-by-id'] })
            queryClient.refetchQueries({ queryKey: ['student-info-by-id'] })
            queryClient.refetchQueries({ queryKey: ['user-data'] })
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <Check size={20} className="text-green-500" />
                        <p className="text-[14px] text-primary">
                            User updated successfully
                        </p>
                    </div>
                ),
            })
        },
        onError: (error) => {
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <X size={20} className="text-red-500" />
                        <p className="text-[14px] text-primary">
                            {error.message}
                        </p>
                    </div>
                ),
            })
        },
    })

    useEffect(() => {
        if (defaultValues.profilePicture) {
            setImageSrc(defaultValues.profilePicture)
        }
    }, [defaultValues.profilePicture])

    function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString())
            }
        })
        if (profilePicture) {
            formData.append('image', profilePicture)
        }
        formData.append('userType', defaultValues.userType as string)
        updateMutate(formData)
    }

    const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setProfilePicture(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                setImageSrc(e.target.result as string)
            }
        }
        reader.readAsDataURL(file)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-full max-w-[1057px] flex flex-col md:flex-row justify-between mx-auto mt-[22px] px-[19px] mb-[13px]">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-[#444444] text-[14px] font-[600]">
                            Teacher profile
                        </h3>
                        <p className="text-[#777777] text-[14px] font-[400]">
                            Update your photo and details here.
                        </p>
                    </div>
                    <div className="flex items-center gap-[9px]">
                        <Button
                            type="submit"
                            className="flex gap-2 text-[14px] w-full md:min-w-[139px] h-[40px]"
                            disabled={updating}
                        >
                            {updating && (
                                <LoaderPinwheel
                                    size={18}
                                    className="animate-spin"
                                />
                            )}
                            Save changes
                        </Button>
                    </div>
                </div>
                <Separator />
                <div className="w-full max-w-[1057px] flex flex-col md:flex-row mx-auto px-[19px] py-[17px]">
                    <div className="w-full max-w-[300px] mb-4 md:mb-0">
                        <h3 className="text-[#444444] text-[14px] font-[600]">
                            User details
                        </h3>
                        <p className="text-[#777777] text-[12px] font-[400]">
                            Manage your personal details
                        </p>
                    </div>
                    <div className="w-full max-w-[377px] space-y-[12px]">
                        <div className="text-[12px] text-[#777777] mt-[12px] ml-1">
                            Full name
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            onChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="First Name"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <div className="text-[12px] text-[#777777] mt-[12px] ml-1">
                            Email
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            onChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Email"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[12px]" />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Separator />
                <div className="w-full max-w-[1057px] flex flex-col md:flex-row mx-auto px-[19px] pt-[20px] pb-[30px]">
                    <div className="w-full max-w-[300px] mb-4 md:mb-0">
                        <h3 className="text-[#444444] text-[14px] font-[600]">
                            Profile photo
                        </h3>
                        <p className="text-[#777777] text-[12px] font-[400]">
                            Update your profile photo here
                        </p>
                    </div>
                    <div className="w-full max-w-[377px] space-y-[12px]">
                        <Image
                            src={imageSrc ? imageSrc : '/polygon-group-2.png'}
                            height={80}
                            width={80}
                            className="h-[80px] w-[80px] rounded-full bg-secondary border border-white object-cover"
                            alt="user photo"
                            unoptimized
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={handleProfileChange}
                        />
                    </div>
                </div>
                <Separator />
            </form>
        </Form>
    )
}


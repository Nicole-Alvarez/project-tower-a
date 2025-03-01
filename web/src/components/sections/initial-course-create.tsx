import Image from 'next/image'
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
import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { LoaderPinwheel, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { createCourse } from '../../../api/mutation/courses'
import { useRouter } from 'next/router'
import { Textarea } from '../ui/textarea'
import { useAuth } from '@/providers/AuthProvider'

const formSchema = z.object({
    title: z.string()
        .min(1, "Course title is required")
        .refine((val) => !/^\s|\s$/.test(val), {
            message: "Course title cannot start or end with a space",
        }),
    overview: z.string()
        .min(1, "Course description is required")
        .refine((val) => !/^\s|\s$/.test(val), {
            message: "Course description cannot start or end with a space",
        }),
});

export default function InitialCourseCreation() {
    const { session: { user } } = useAuth()
    const [imageSrc, setImageSrc] = useState('')
    const [courseImage, setCourseImage] = useState<File>()
    const router = useRouter()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
           title: "",
           overview:""
        },
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: FormData) =>
            await createCourse(data),
        onSuccess: (data) => {
            const userType = user?.userType.toLocaleLowerCase();
            const courseId = data.id;
            router.push({
                pathname: `/${userType}/courses/${courseId}/manage`,
            })
        },
        onError: (error) => {
            console.error(error);
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <X size={20} className="text-red-500" />
                        <p className="text-[14px] text-primary">
                            Something went wrong!
                        </p>
                    </div>
                ),
            })
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!courseImage) {
            toast({
                description: (
                    <div className="flex items-center gap-2">
                        <X size={20} className="text-red-500" />
                        <p className="text-[14px] text-primary">
                            Course image is required
                        </p>
                    </div>
                ),
            })
            return
        }

        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString())
            }
        })
        formData.append('image', courseImage as File)
        mutate(formData)
    }

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
        setCourseImage(file)
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e.target?.result) {
                setImageSrc(e.target.result as string)
            }
        }
        reader.readAsDataURL(file)
    }

    return (
        <>
        {user && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-full space-y-[12px]">
                    <div className="text-[12px]  mt-[12px] ml-1">
                        Course Title
                    </div>
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            form.trigger("title");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-[12px]" />
                            </FormItem>
                        )}
                    />
                    <div className="text-[12px] mt-[12px] ml-1">
                        Course Description
                    </div>
                    <FormField
                        control={form.control}
                        name="overview"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value);
                                            form.trigger("overview");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-[12px]" />
                            </FormItem>
                        )}
                    />
                    <div className="w-full max-w-[377px] space-y-[12px]">
                        <Image
                            src={imageSrc ? imageSrc : '/polygon-group-2.png'}
                            height={80}
                            width={80}
                            className="h-[80px] w-[80px] rounded-[5px] bg-secondary border border-white object-cover"
                            alt="course photo"
                            unoptimized
                        />
                        <Input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className="w-full mt-10">
                    <div className="flex items-center gap-[9px]">
                        <Button
                            type="submit"
                            className="flex gap-2 text-[14px] w-full md:min-w-[139px] h-[40px]"
                            disabled={isPending}
                        >
                            {isPending && (
                                <LoaderPinwheel
                                    size={18}
                                    className="animate-spin"
                                />
                            )}
                            Create
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
        )}
        </>
    )
}


import { Skeleton } from '@/components/ui/skeleton'

export const CategoryLoader = () => (
    <div className="w-full flex flex-row space-x-4">
        {Array.from({ length: 5 }).map((_, index) => (
            <div
                key={index}
                className="w-[180px] h-[62px] rounded-[15px] flex justify-center items-center bg-[#E2E0E6] opacity-0 animate-fadeInRight"
                style={{ animationDelay: `${index * 0.2}s` }}
            >
                <Skeleton className="w-full h-full" />
            </div>
        ))}
    </div>
)

export const CourseLoader = () => (
    <div className="w-[260px] h-[286px] mr-4 mb-4 rounded-3xl border-white bg-white">
        <Skeleton className="w-full h-[159px] rounded-t-3xl" />
        <div className="flex flex-row px-4 py-2">
            <div className="w-3/4">
                <Skeleton className="mb-2 h-4 w-3/4 rounded" />
                <Skeleton className="mb-2 h-4 w-1/2 rounded" />
                <Skeleton className="mb-2 h-4 w-1/3 rounded" />
                <Skeleton className="h-4 w-1/4 rounded" />
            </div>
            <div className="w-1/4">
                <Skeleton className="h-4 w-full rounded" />
            </div>
        </div>
    </div>
)

export const CourseDetailsLoader = () => {
    return (
        <div className="w-full h-full px-10 py-5 space-y-4">
            <div className="w-full h-[340px] bg-[#6E22DD] rounded-[50px] flex items-center p-2">
                <Skeleton className="bg-[#8B4EE4] w-[444px] h-[321px] rounded-[50px]" />
                <div className="w-full h-[235px] flex flex-col justify-between px-10">
                    <div className="text-white space-y-2">
                        <Skeleton className="w-1/4 h-6" />
                        <Skeleton className="w-2/4 h-8" />
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-full h-4" />
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <Skeleton className="w-6 h-6" />
                                <Skeleton className="w-16 h-6" />
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="flex flex-row">
                                    <Skeleton className="w-4 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                    <Skeleton className="w-4 h-4" />
                                </div>
                                <Skeleton className="w-16 h-6" />
                            </div>
                        </div>
                    </div>
                    <Skeleton className="w-[152px] h-[43px] rounded-full" />
                </div>
            </div>
            <div className="w-full h-full bg-white rounded-[50px] border py-12 px-16 space-y-4">
                <div className="space-y-2">
                    <Skeleton className="w-1/4 h-8" />
                    <Skeleton className="w-full h-4" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="w-1/4 h-8" />
                    <div className="flex h-[68px] border border-[#292521]/20 rounded-[20px] px-10 items-center"></div>
                </div>
            </div>
        </div>
    )
}

export const CourseCardOverViewLoaders = () => {
    return (
        <div className="h-[296px] w-[291px] mr-4 mb-4 rounded-xl border-white bg-white">
            <Skeleton className="w-full h-[107px] rounded-t-xl" />
            <div className="flex flex-col px-4 py-2">
                <div className="w-full flex flex-row space-x-3 ml-16 pb-4">
                    <Skeleton className="w-2/4 h-4" />
                    <Skeleton className="w-1/4 h-4" />
                </div>
                <div className="w-full flex flex-col mb-2">
                    <Skeleton className="mb-4 h-4 w-full rounded" />
                    <Skeleton className="mb-2 h-4 w-3/4 rounded" />
                    <Skeleton className="mb-2 h-4 w-3/4 rounded" />
                    <Skeleton className="mb-2 h-4 w-3/4 rounded" />
                </div>
                <div className="w-full flex flex-col">
                    <Skeleton className="h-5 w-4/4 rounded" />
                </div>
            </div>
        </div>
    )
}

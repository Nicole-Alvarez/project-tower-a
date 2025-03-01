import StarRating from '@/components/common/star-rating'
import getPercentage from '@/hooks/get-percentage'
import { ICourse } from '@/interfaces/course.interface';
import { useRouter } from 'next/router'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'

interface Props {
    course: ICourse;
    cardIndex: number;
}

export const CourseCardList = ({ course, cardIndex }: Props) => {
    const router: any = useRouter()

    const progressPercentage = getPercentage(course)

    return (
        <div
            key={cardIndex}
            className="w-full flex lg:flex-row flex-col justify-between items-center border-b border-[#F9F2F2] py-[21px] px-[41px] opacity-0 animate-fadeInRight"
            style={{
                animationDelay: `${cardIndex * 0.2}s`,
            }}
            onClick={() =>
                router.push({
                    pathname: '/student/enrolledcourse',
                    query: {
                        id: String(course?.id),
                    },
                })
            }
        >
            <div className="w-full lg:w-1/3 flex flex-row space-x-5 items-center transform transition-transform duration-300 hover:scale-110">
                <div>
                    {course?.image === null ||
                    course?.image === undefined ? (
                        <div className="w-[50px] h-[50px] rounded-[8px] bg-[#7435D9]"></div>
                    ) : (
                        <Image
                            src={course?.image}
                            alt="Course Image"
                            width={1600}
                            height={600}
                            className="w-[50px] h-[50px] rounded-[8px] object-cover"
                        />
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row space-x-3">
                        <div className="text-[12px] text-[#292521]/70">
                            {course?.category?.name}
                        </div>
                        <div className="text-[12px] text-[#292521]/70">
                            {course?.CourseLesson?.length} Lesson
                            {course?.CourseLesson?.length > 1 ? 's' : ''}
                        </div>
                    </div>
                    <div className="text-[#292521] text-[16px] font-bold">
                        {course?.title}
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-row space-x-2 py-1 items-center lg:justify-center pl-[60px]">
                <StarRating rating={course?.averageRating || 0} />
                <div className="text-[12px] text-[#292521]/70">{course?.Reviews?.length} Reviews</div>
            </div>
            <div className="w-full lg:w-1/3 flex lg:justify-end lg:px-4 pl-[60px]">
                {progressPercentage < 100 && (
                    <div
                        onClick={() =>
                            router.push({
                                pathname: '/coursedetails',
                                query: {
                                    id: String(course?.id),
                                },
                            })
                        }
                        className="bg-[#7435D9] rounded-[15px] drop-shadow-md font-bold text-[12px] text-white flex items-center justify-center w-[104px] h-[29px] hover:cursor-pointer transform transition-transform duration-300 hover:scale-110"
                    >
                        {progressPercentage.toFixed() ?? 0}% Progress
                    </div>
                )}
                {progressPercentage >= 100 && (
                    <div
                        onClick={() =>
                            router.push({
                                pathname: '/coursedetails',
                                query: {
                                    id: String(course?.id),
                                },
                            })
                        }
                        className="bg-[#34DF64] rounded-[15px] drop-shadow-md font-bold text-[12px] text-white flex items-center justify-center w-[79px] h-[29px] hover:cursor-pointer transform transition duration-300 hover:scale-110"
                    >
                        {progressPercentage ?? 0}%
                    </div>
                )}
            </div>
        </div>
    )
}

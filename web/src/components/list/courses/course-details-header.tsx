import StarRating from '@/components/common/star-rating'
import { ICourse } from '@/interfaces/course.interface'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/router'
import { GrLanguage } from 'react-icons/gr'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
    courseData: ICourse
}

export const CourseDetailsHeader = ({ courseData }: Props) => {
    const router: any = useRouter()
    const { session } = useAuth()

    const averageRating =
        courseData?.Reviews?.length > 0
            ? courseData?.Reviews.reduce(
                  (acc, review) => acc + review.rating,
                  0
              ) / courseData?.Reviews?.length
            : 0

    return (
        <Card className="w-full bg-gradient-to-r from-[#10172a] to-[#000000] text-white overflow-hidden">
            <CardContent className="p-6 flex flex-col lg:flex-row items-start gap-6">
                {courseData?.image && (
                    <img
                        src={courseData?.image || '/polygon-group-2.png'}
                        className="w-full lg:w-[150px] h-[150px] object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                        alt={courseData?.title}
                    />
                )}
                <div className="flex flex-col justify-between w-full space-y-4">
                    <div className="space-y-2">
                        <Badge
                            variant="secondary"
                            className="text-xs font-semibold"
                        >
                            {courseData?.category?.name}
                        </Badge>
                        <h1 className="text-3xl font-bold">
                            {courseData?.title}
                        </h1>
                        <p className="text-gray-300 line-clamp-2">
                            {courseData?.overview}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-2">
                                <GrLanguage className="text-white" />
                                <span>{courseData?.language}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <StarRating
                                    rating={Math.round(averageRating)}
                                />
                                <span>
                                    ({courseData?.Reviews?.length} Reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-800 p-4 flex justify-between items-center">
                {!session.token ? (
                    <Button
                        onClick={() => router.push('/auth/studentsignup')}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                    >
                        Get access
                    </Button>
                ) : (
                    <Button
                        onClick={() =>
                            router.push({
                                pathname: '/student/enrolledcourse',
                                query: { id: String(courseData?.id) },
                            })
                        }
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
                    >
                        Start Course
                    </Button>
                )}
                <span className="text-sm text-gray-300">
                    Last updated: May 1, 2023
                </span>
            </CardFooter>
        </Card>
    )
}

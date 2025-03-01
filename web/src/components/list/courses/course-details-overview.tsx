import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ICourseLesson } from '@/interfaces/course-lesson.interface'
import { ICourse } from '@/interfaces/course.interface'
import { Video, File, BookOpen } from 'lucide-react'

interface Props {
    courseData?: ICourse
}

const CourseDetailsOverview = ({ courseData }: Props) => {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">
                    {courseData?.title}
                </CardTitle>
                <CardDescription className="mt-2 text-base text-gray-600">
                    {courseData?.overview}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {courseData?.CourseLesson &&
                    courseData.CourseLesson.length > 0 && (
                        <>
                            <h2 className="mb-1 text-base font-semibold text-gray-800">
                                Course Content
                            </h2>
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {courseData.CourseLesson.map(
                                    (lesson: ICourseLesson, index: number) => (
                                        <AccordionItem
                                            key={index}
                                            value={`lesson-${index}`}
                                        >
                                            <AccordionTrigger className="text-left">
                                                <div className="flex items-center">
                                                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                                                    <span className="font-medium">
                                                        {lesson.title}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                {lesson?.CourseLessonItem
                                                    ?.length > 0 ? (
                                                    lesson.CourseLessonItem.map(
                                                        (
                                                            lessonItem: any,
                                                            itemIndex: number
                                                        ) => (
                                                            <div
                                                                key={itemIndex}
                                                                className="flex items-center py-2 pl-6"
                                                            >
                                                                {lessonItem?.type ===
                                                                'VIDEO' ? (
                                                                    <Video className="mr-2 h-4 w-4 text-blue-500" />
                                                                ) : (
                                                                    <File className="mr-2 h-4 w-4 text-green-500" />
                                                                )}
                                                                <span className="text-sm text-gray-700">
                                                                    {
                                                                        lessonItem?.title
                                                                    }
                                                                </span>
                                                            </div>
                                                        )
                                                    )
                                                ) : (
                                                    <p className="pl-6 text-sm text-gray-500">
                                                        No content available
                                                    </p>
                                                )}
                                            </AccordionContent>
                                            {index <
                                                courseData.CourseLesson.length -
                                                    1 && (
                                                <Separator className="my-2" />
                                            )}
                                        </AccordionItem>
                                    )
                                )}
                            </Accordion>
                        </>
                    )}
            </CardContent>
        </Card>
    )
}

export default CourseDetailsOverview


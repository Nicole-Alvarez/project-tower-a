import { useRouter } from 'next/router'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { FaCheckCircle } from 'react-icons/fa'
import { MdCloudDownload, MdVideoLibrary } from 'react-icons/md'

export const CourseDetailsLessons = ({ courseData }: any) => {
    const router: any = useRouter()

    let token: string | null = null

    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token')
    }

    const handleLessonItem = (type: string) => {
        if (token === null) {
            router.push('/auth/studentsignup')
        }
    }

    const lessonIcon = (type: string) => {
        return type === 'VIDEO' ? (
            <MdVideoLibrary className="text-[28px] text-[#A394DB]" />
        ) : type === 'QUESTIONNAIRE' ? (
            <MdCloudDownload className="text-[28px] text-[#A394DB]" />
        ) : (
            <>
                <MdCloudDownload className="text-[28px] text-[#A394DB]" />
            </>
        )
    }

    const lessonActionText = (type: string) => {
        return type === 'QUESTIONNAIRE' ? 'Download' : 'Click to open'
    }

    return (
        <div className="w-full h-full bg-white rounded-[50px] border py-12 px-16 space-y-5">
            <div className="space-y-2">
                <div className="font-bold text-[24px] text-[#292521]">
                    Course Overview
                </div>
                <div
                    className="font-normal text-[14px] text-[#292521]/60  opacity-0 animate-fadeInRight "
                    style={{
                        animationDelay: `${0.4}s`,
                    }}
                >
                    {courseData?.data?.overview}
                </div>
            </div>
            <div className="space-y-1">
                <div className="font-bold text-[24px] text-[#292521]">
                    Lessons
                </div>
                <div>
                    <Accordion type="multiple">
                        {courseData?.data?.CourseLesson.map(
                            (item: any, index: number) => {
                                const questionnaireCount =
                                    item?.CourseLessonItem.filter(
                                        (lessonItem: any) =>
                                            lessonItem.type === 'QUESTIONNAIRE'
                                    ).length
                                return (
                                    <AccordionItem
                                        key={index}
                                        value={String(index)}
                                        className="space-y-1"
                                    >
                                        <AccordionTrigger
                                            className="flex h-[68px] border border-[#292521]/20 rounded-[20px] px-10 items-center opacity-0 animate-fadeInUp "
                                            style={{
                                                animationDelay: `${
                                                    index * 0.3
                                                }s`,
                                            }}
                                        >
                                            <div className="flex flex-row space-x-10">
                                                <div className="font-bold text-[#292521] text-[16px]  capitalize">
                                                    {item?.title}
                                                </div>
                                                <div className="text-[#292521]/70 text-[16px] flex flex-row space-x-2">
                                                    <div>
                                                        {item?.CourseLessonItem
                                                            .length -
                                                            questionnaireCount}
                                                    </div>
                                                    <div> Lessons</div>
                                                </div>
                                                <div className="text-[#292521]/70 text-[16px] flex flex-row space-x-2">
                                                    <div>
                                                        {questionnaireCount}
                                                    </div>
                                                    <div> Quiz</div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <div className="flex flex-col rounded-[20px] pb-2">
                                            <AccordionContent className="border border-[#292521]/20 rounded-[20px]">
                                                {item?.CourseLessonItem.map(
                                                    (
                                                        item: any,
                                                        index: number
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className={`${
                                                                index !== 0
                                                                    ? 'border-t  border-[#292521]/20 '
                                                                    : ''
                                                            } px-6 py-4 w-full flex flex-row items-start space-x-4 `}
                                                        >
                                                            <div className="w-[5%] flex justify-center ">
                                                                {lessonIcon(
                                                                    item?.type
                                                                )}
                                                            </div>
                                                            <div className="w-full flex flex-col space-y-2">
                                                                <div className="font-bold text-[#292521] text-[16px] capitalize">
                                                                    {
                                                                        item?.title
                                                                    }
                                                                </div>
                                                                <div
                                                                    className="font-bold text-[#1E83F9] text-[14px] hover:cursor-pointer"
                                                                    onClick={() =>
                                                                        handleLessonItem(
                                                                            item?.type
                                                                        )
                                                                    }
                                                                >
                                                                    {lessonActionText(
                                                                        item?.type
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="w-[5%] flex justify-center">
                                                                {token ===
                                                                null ? (
                                                                    <></>
                                                                ) : (
                                                                    <FaCheckCircle className="text-[24px] text-[#5EED75]" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </AccordionContent>
                                        </div>
                                    </AccordionItem>
                                )
                            }
                        )}
                    </Accordion>
                </div>
            </div>
        </div>
    )
}

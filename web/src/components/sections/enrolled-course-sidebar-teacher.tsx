import { TvMinimalPlay, File, Square, Lock, Info, ChevronLeft, BookText } from 'lucide-react'
import { IoCheckbox } from 'react-icons/io5'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import getPercentage from '@/hooks/get-percentage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { CourseLessonProgressStatus, ICourseLessonProgress } from '@/interfaces/course-lesson-progress.interface'
import { useEffect, useState } from 'react'
import { fetchCourseProgress } from '../../../api/query/courses'
import { ICourse } from '@/interfaces/course.interface'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { IUser } from '@/interfaces/user.interface'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface SideBarProps {
    courseData: ICourse,
    onSelectLessonItem: any,
    selectedLesson: any,
    selectedLessonItem: any,
    courseLessonProgress: ICourseLessonProgress[],
    isLessonItemCompleted: any,
    studentId: number;
    profile?: IUser;
    lessonProgressLatestUpdate: any;
}
export const EnrolledCourseTeacherSideBar = ({
    courseData,
    onSelectLessonItem,
    selectedLesson,
    selectedLessonItem,
    courseLessonProgress,
    isLessonItemCompleted,
    studentId,
    profile,
    lessonProgressLatestUpdate,
}: SideBarProps) => {
    const progressPercentage = getPercentage(courseData, studentId);
    const [processingLessons, setProcessingLessons] = useState(false);
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [openedItems, setOpenedItems] = useState<string[]>(["0"]);

    const handleAccordionChange = (value: string[]) => {
        setOpenedItems(value);
    };
   

    const {data: courseProgress, isLoading: loadingCourseProgress, refetch: refetchCourseProgress} = useQuery({
        queryKey: ['teacher-course-progress', courseData],
        queryFn: async() => await fetchCourseProgress(courseData?.id),
        enabled: !!courseData?.id,
    });

    useEffect(() => {
        const handleResize = () => setIsOpen(window.innerWidth > 768);
        handleResize();
        
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    useEffect(() => {
        if (!courseData || !courseProgress) return;
    
        setProcessingLessons(true);
        const lockedLessonsArray: number[] = [];
    
        courseData.CourseLesson.forEach((lesson, index) => {
            if (lesson.progressionType === 'FREE' || lesson.ordinalNumber === 1) return;
    
            let lastStrictLesson = null;
            for (let i = index - 1; i >= 0; i--) {
                if (courseData.CourseLesson[i].progressionType !== 'FREE') {
                    lastStrictLesson = courseData.CourseLesson[i];
                    break;
                }
            }
    
            if (!lastStrictLesson) return;
    
            const isLastStrictLessonLocked = lastStrictLesson.CourseLessonItem.some(lessonItem => {
                const progress = courseProgress.find(item => item.lessonItemId === lessonItem.id);
                return !progress || progress.status !== CourseLessonProgressStatus.COMPLETED;
            });
    
            if (isLastStrictLessonLocked) {
                lockedLessonsArray.push(lesson.id);
            }
        });
        setProcessingLessons(false);
    
    }, [courseData, courseProgress]);

    const handleProgressCount = (courseLessonProgress: ICourseLessonProgress[], lesson: any) => {
        return (
            courseLessonProgress?.filter(item =>
                item?.lessonId === lesson?.id &&
                item?.studentId === studentId 
            ).length ?? 0
        )
    }

    const handleIsLessonSelected = (lesson: any, lessonItem: any) => {
        return (
            selectedLesson?.id === lesson?.id &&
            selectedLessonItem?.id === lessonItem?.id
        )
    }

    

    const lessonIcon = (type: string) => {
        return type === 'VIDEO' ? (
            <TvMinimalPlay className="text-[17px] stroke-[1px]" size={16}/>
        ) : type === 'QUESTIONNAIRE' ? (
            <File className="text-[17px] stroke-[1px]" size={16}/>
        ) : (
            <File className="text-[17px] stroke-[1px]" size={16}/>
        )
    }

    return (
        <div className={`w-${isOpen ? '1/3' : '16'} flex flex-col border-r-2 border-[#F5F4F8] overflow-hidden transition-width duration-300`}>
            <div className="w-full border-b-2 border-[#F5F4F8] space-y-[26px]">
                <div className="w-full flex flex-row px-[24px] pt-[18px] border-b-2 border-[#F5F4F8] pb-[18px]">
                    <div className="w-full flex flex-row space-x-3 items-center">
                        {isOpen && (
                            <>
                                <Avatar>
                                    <AvatarImage src={profile?.profilePicture} />
                                    <AvatarFallback className="bg-[#FF9345] text-white h-[34px] w-[34px] text-[14px] font-bold">
                                        {profile?.name[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-[#292521] text-[12px] font-bold">{profile?.name}</div>
                            </>)}
                    </div>
                    <Button onClick={() => setIsOpen(!isOpen)} className='bg-transparent hover:bg-transparent border-none p-0 focus:outline-none'>
                        {isOpen ? <ChevronLeft size={24} color="#292521" /> : <BookText size={24} color="#292521" />}
                    </Button>
                </div>
                <div className="w-full flex flex-row px-[24px] pt-[12px]">
                    <div className=" w-full text-[#292521] font-bold text-[16px] ">
                        {isOpen ? courseData?.title : ''} 
                    </div>
                </div>
                {isOpen && (
                <div className="flex flex-col space-y-[4px] px-[24px] pb-[15px]">
                    <div className="flex flex-row text-[10px] text-[#292521]/50 space-x-1 items-center">
                        <div className="font-bold">
                            {progressPercentage.toFixed(0)}%{' '}
                        </div>
                        <div>completed</div>
                    </div>
                    <Progress
                        value={progressPercentage}
                        className="bg-[#F2EAEA] h-[10px]"
                    />
                </div>
                )}
            </div>
            {isOpen && (
                <div
                    className="flex flex-col flex-grow pb-[24px] mb-[50px] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {(processingLessons || loadingCourseProgress) ? (
                        <div>
                            {Array.from({length: 20}, (_, index) => (
                                <>
                                    <Skeleton className='h-[56px] w-full '/>
                                    <Separator />
                                </>
                            ))}
                        </div>
                    ) : (
                        <Accordion type="multiple" value={openedItems} onValueChange={handleAccordionChange}>
                            {courseData?.CourseLesson.map((lesson, index: number) => {
                                return (
                                    <AccordionItem
                                        key={index}
                                        value={String(index)}
                                        className="space-y-2 border-b-2 border-[#F5F4F8] px-[24px]"
                                    >
                                        <AccordionTrigger>
                                            <div className="w-full flex flex-row space-x-2 items-center justify-between pr-3">
                                                <div className={`text-[#292521] text-[12px] font-bold  text-start`}>
                                                    {lesson?.title}
                                                </div>
                                                <div className="text-[#292521]/50 text-[12px] ">
                                                    {handleProgressCount(
                                                        courseLessonProgress,
                                                        lesson
                                                    )}
                                                    /{lesson?.CourseLessonItem?.length}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="">
                                            {lesson?.CourseLessonItem?.map(
                                                (
                                                    lessonItem: any,
                                                    lessonIndex: number
                                                ) => (
                                                    <div
                                                        key={lessonIndex}
                                                        className={`${handleIsLessonSelected(
                                                            lesson,
                                                            lessonItem
                                                        )
                                                            ? 'bg-[#ECF1F6] rounded-[2px]'
                                                            : ''
                                                            } flex flex-row items-center space-x-[8px] py-2 hover:cursor-pointer px-[7px]`}
                                                    >
                                                        <div
                                                        >
                                                            {isLessonItemCompleted(
                                                                lessonItem?.id
                                                            ) ? (
                                                                <IoCheckbox
                                                                    className="text-[#6E22DD] "
                                                                    size={16}
                                                                />
                                                            ) : (
                                                                <Square className="text-[#6E22DD] stroke-[1px] text-[12px]" size={16}/>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="w-full flex flex-row  space-x-[8px] items-center text-[12px]"
                                                            onClick={() =>
                                                                onSelectLessonItem(
                                                                    lesson,
                                                                    lessonItem
                                                                )
                                                            }
                                                        >
                                                            <div>
                                                                {lessonIcon(
                                                                    lessonItem?.type
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col gap-1">
                                                                <div>{lessonItem?.title}</div> 
                                                                <div className="text-[10px] text-[#292521]/50">{lessonProgressLatestUpdate(lessonItem?.id)}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    )}
                </div>
            )}
        </div>
    )
}

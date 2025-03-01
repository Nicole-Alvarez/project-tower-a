import { IoClose } from 'react-icons/io5'
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
import { useAuth } from '@/providers/AuthProvider'
import { removeCourseLessonProgress } from '../../../api/mutation/course-lesson'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CourseLessonProgressStatus, IAddCourseLessonProgress, ICourseLessonProgress } from '@/interfaces/course-lesson-progress.interface'
import { useEffect, useState } from 'react'
import { fetchCourseProgress } from '../../../api/query/courses'
import { ICourse } from '@/interfaces/course.interface'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Skeleton } from '../ui/skeleton'
import { Separator } from '../ui/separator'
import { toast } from '../ui/use-toast'
import { Button } from '../ui/button'

interface SideBarProps {
    courseData: ICourse,
    onSelectLessonItem: any,
    selectedLesson: any,
    selectedLessonItem: any,
    courseLessonProgress: ICourseLessonProgress[],
    isLessonItemCompleted: any,
    onAddProgress: (data: IAddCourseLessonProgress) => void,
}
export const SideBar = ({
    courseData,
    onSelectLessonItem,
    selectedLesson,
    selectedLessonItem,
    courseLessonProgress,
    isLessonItemCompleted,
    onAddProgress,
}: SideBarProps) => {
    const { session: { user } } = useAuth();
    const progressPercentage = getPercentage(courseData);
    const [lockedLessons, setLockedLessons] = useState<number[]>([]);
    const [processingLessons, setProcessingLessons] = useState(false);
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
   

    const {data: courseProgress, isLoading: loadingCourseProgress, refetch: refetchCourseProgress} = useQuery({
        queryKey: ['course-progress', courseData],
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
    
        setLockedLessons(lockedLessonsArray);
        setProcessingLessons(false);
    
    }, [courseData, courseProgress]);

    const {mutate: removeProgressMutate} = useMutation({
        mutationFn: async(progressId: number) => await removeCourseLessonProgress(progressId),
        onSuccess() {
            refetchCourseProgress();
            queryClient.refetchQueries({queryKey: ['course-lesson-progress']});
        },
        onError(error) {
            toast({
                variant: 'destructive',
                title: 'Remove Failure',
                description: error.message,
            });
        } 
    })

     const [updatingItems, setUpdatingItems] = useState<number[]>([]);

     const toggleProgress = (lessonId: any, lessonItemId: any) => {
         if (updatingItems.includes(lessonItemId)) {
             return; 
         }
 
         setUpdatingItems(prev => [...prev, lessonItemId]);
 
         const completed = isLessonItemCompleted(lessonItemId);
         if (completed) {
             const progress = courseLessonProgress?.find(item =>
                 item?.lessonId === lessonId &&
                 item?.lessonItemId === lessonItemId &&
                 item?.studentId === user?.id
             );
             if (progress) {
                 removeProgressMutate(progress.id);
             }
         } else {
             onAddProgress({
                 enrolledCourseId: courseData?.EnrolledCourse?.[0]?.id,
                 studentId: Number(user?.id),
                 lessonId: lessonId,
                 lessonItemId: lessonItemId,
                 status: CourseLessonProgressStatus.COMPLETED,
             });
         }
 
         setTimeout(() => {
             setUpdatingItems(prev => prev.filter(id => id !== lessonItemId));
         }, 300); 
     };

    const handleProgressCount = (courseLessonProgress: ICourseLessonProgress[], lesson: any) => {
        return (
            courseLessonProgress?.filter(item =>
                item?.lessonId === lesson?.id &&
                item?.studentId === user?.id
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
            <TvMinimalPlay className="text-[17px] stroke-[1px]" />
        ) : type === 'QUESTIONNAIRE' ? (
            <File className="text-[17px] stroke-[1px]" />
        ) : (
            <File className="text-[17px] stroke-[1px]" />
        )
    }

    return (
        <div className={`w-${isOpen ? '1/4' : '16'} flex flex-col border-r-2 border-[#F5F4F8] overflow-hidden transition-width duration-300`}>
            <div className="w-full border-b-2 border-[#F5F4F8] space-y-[26px]">
                <div className="w-full flex flex-row px-[24px] pt-[18px]">
                    <div className=" w-full text-[#292521] font-bold text-[24px] ">
                        {isOpen ? courseData?.title : ''} 
                    </div>
                    <Button onClick={() => setIsOpen(!isOpen)} className='bg-transparent hover:bg-transparent border-none p-0 focus:outline-none'>
                        {isOpen ? <ChevronLeft size={24} color="#292521" /> : <BookText size={24} color="#292521" />}
                    </Button>
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
                    className="flex flex-col flex-grow h-[200px] pb-[24px] overflow-y-auto "
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
                        <Accordion type="multiple">
                            {courseData?.CourseLesson.map((lesson, index: number) => {
                                return (
                                    <AccordionItem
                                        key={index}
                                        value={String(index)}
                                        className="space-y-2 border-b-2 border-[#F5F4F8] px-[24px]"
                                        disabled={lockedLessons.includes(lesson.id)}
                                    >
                                        <AccordionTrigger>
                                            <div className="w-full flex flex-row space-x-2 items-center pr-4">
                                                <div className={`${lockedLessons.includes(lesson.id) ? 'text-[#29252167]' : 'text-[#292521]'} text-[16px] font-bold  text-start`}>
                                                    {lesson?.title}
                                                </div>
                                                <div className="text-[#292521]/50 text-[14px] ">
                                                    {handleProgressCount(
                                                        courseLessonProgress,
                                                        lesson
                                                    )}
                                                    /{lesson?.CourseLessonItem?.length}
                                                </div>
                                            </div>
                                            {lockedLessons.includes(lesson.id) && (
                                                <HoverCard>
                                                    <HoverCardTrigger>
                                                        <Lock size={18} className='mr-2 cursor-pointer'/>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className='flex gap-2'>
                                                        <Info size={18}/>
                                                        <p className='flex-1 text-[12px] text-left'>This course is locked. To unlock it, please complete the items from previous lessons.</p>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            )}
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
                                                            } flex flex-row space-x-[8px] py-2 hover:cursor-pointer px-[7px]`}
                                                    >
                                                        <div
                                                        >
                                                            {isLessonItemCompleted(
                                                                lessonItem?.id
                                                            ) ? (
                                                                <IoCheckbox
                                                                    className="text-[#6E22DD] "
                                                                    size={24}
                                                                />
                                                            ) : (
                                                                <Square className="text-[#6E22DD] stroke-[1px] text-[15px]" />
                                                            )}
                                                        </div>
                                                        <div
                                                            className="w-full flex flex-row  space-x-[8px] items-center"
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
                                                            <div>
                                                                {lessonItem?.title}
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

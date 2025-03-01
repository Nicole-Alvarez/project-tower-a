import React from 'react'
import { LessonItemVideo } from './lesson-item-video'
import { ICourseLessonItem } from '@/interfaces/course-lesson-item.interface';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface Props {
    selectedLessonItem: ICourseLessonItem,
    onPressNextLesson: () => void
    isLastLessonItem: boolean;
    isCompleted: boolean
    onPressPreviousLesson: ()=> void
    isFirstLessonItem:boolean
}

export const Video = ({ selectedLessonItem, onPressNextLesson , isLastLessonItem, isCompleted,onPressPreviousLesson,isFirstLessonItem }: Props) => {
    return (
        <div className="w-full h-full p-[24px] overflow-y-auto opacity-0 animate-fadeInRight">
            {!selectedLessonItem?.CourseLessonItemAsset ? (
                <div className="w-full h-[70%] rounded-[5px] bg-slate-200 flex justify-center items-center">
                    <div className="font-bold text-[34px] text-[#292521]/70">
                        NO VIDEO FOUND
                    </div>
                </div>
            ) : (
                <LessonItemVideo url={selectedLessonItem.CourseLessonItemAsset.url} />
            )}
            <div className="font-bold text-[24px] text-[#292521] ">
                    {selectedLessonItem?.title}
                </div>
            <div className={`flex  ${isFirstLessonItem?'justify-end':'justify-between'} items-center py-[40px]  opacity-0 animate-fadeInUp`}>
                
                  <Button
                    onClick={onPressPreviousLesson}
                    className={` ${isFirstLessonItem?"hidden":"flex"} bg-white hover:bg-secondary h-[35px] w-[159px]  items-center justify-center border border-[#C4D4C1] rounded-[5px] font-bold text-[12px] text-[#292521]`}
                >
                    Previous Lesson
                </Button>
                {(isLastLessonItem && isCompleted) ? (
                    <div className='flex items-center gap-1 text-green-500'>
                        <Trophy size={18}/>
                        <span>Course Completed</span>
                    </div>
                ) : (
                    <Button
                        onClick={onPressNextLesson}
                        className={`bg-white hover:bg-secondary cursor-pointer h-[35px] w-[159px] flex items-center justify-center border border-[#C4D4C1] rounded-[5px] font-bold text-[12px] text-[#292521] `}
                    >
                        {isLastLessonItem ? 'Finish' : 'Next Lesson'}
                    </Button>
                )}
            </div>
            <div className="mb-[100px]"></div>
        </div>
    )
}

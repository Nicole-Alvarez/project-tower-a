import React from 'react'
import draftToHtml from 'draftjs-to-html'
import { ICourseLessonItem } from '@/interfaces/course-lesson-item.interface'
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface Props {
    selectedLessonItem: ICourseLessonItem;
    onPressNextLesson: () => void;
    onPressPreviousLesson: () => void;
    isLastLessonItem: boolean;
    isCompleted: boolean;
    isFirstLessonItem:boolean

    
}
export const TeacherWYSIWYG = ({ selectedLessonItem, onPressNextLesson, isLastLessonItem, isCompleted ,onPressPreviousLesson,isFirstLessonItem}: Props) => {
    
    const renderContent = (content: any) => {
        const exampleData = JSON.parse(content)
        const contentAsHtml = draftToHtml({
            blocks: exampleData.blocks,
            entityMap: exampleData.entityMap,
        })
        return <div className='prose' dangerouslySetInnerHTML={{ __html: contentAsHtml }} />
    }
    return (
        <div className="w-full h-full overflow-y-auto opacity-0 animate-fadeInRight">
            <div className="font-bold text-[16px] text-[#292521] p-4">
                    {selectedLessonItem.title}
            </div>
            <div className={`p-[24px] flex ${isFirstLessonItem?' justify-end':'justify-between'} items-center opacity-0 animate-fadeInUp `}>
                <Button
                    onClick={onPressPreviousLesson}
                    className={` ${isFirstLessonItem?"hidden":"flex"} bg-white hover:bg-secondary h-[35px] w-[159px] items-center justify-center border border-[#C4D4C1] rounded-[5px] font-bold text-[12px] text-[#292521]`}
                >
                    Previous Lesson
                </Button>
                
                {(isLastLessonItem && isCompleted) ? (
                    <div className='flex items-center gap-1 text-green-500 text-[12px]'>
                        <Trophy size={16}/>
                        <span>Course Completed</span>
                    </div>
                ) : (
                    <Button
                        onClick={onPressNextLesson}
                        className={`bg-white hover:bg-secondary h-[35px] w-[159px] flex items-center justify-center border border-[#C4D4C1] rounded-[5px] font-bold text-[12px] text-[#292521]`}
                    >
                        {isLastLessonItem ? 'Finish' : 'Next Lesson'}
                    </Button>
                )}
            </div>
            <div className='p-[24px]'>
                {!selectedLessonItem.content ? (
                    <div className="w-full h-[548px] rounded-[5px] bg-slate-200 flex justify-center items-center">
                        <div className="font-bold text-[34px] text-[#292521]/70">
                            NO WYSIWYG FOUND
                        </div>
                    </div>
                ) : (
                    <div>
                        {renderContent(selectedLessonItem?.content)}
                    </div>
                )}
            </div>

            <div className="mb-[100px]"></div>
        </div>
    )
}

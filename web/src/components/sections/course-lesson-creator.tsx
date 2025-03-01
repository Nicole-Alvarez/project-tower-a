import React, { MouseEvent, useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Folder, Loader2, Pencil, Trash, Trash2 } from 'lucide-react'
import { CourseLessonProgressionType, ICourseLesson, IUpdateCourseLesson } from '@/interfaces/course-lesson.interface'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCourseLessonItems, updateCourseLesson } from '../../../api/mutation/course-lesson'
import { toast } from '../ui/use-toast'
import { AddLessonItemModal } from '../modals/add-lesson-item'
import { CourseLessonItemType, ICourseLessonItem, IUpdateLessonItemsOrderData } from '@/interfaces/course-lesson-item.interface'
import { updateLessonItemsOrder } from '../../../api/mutation/course-lesson-item'
import draftToHtml from 'draftjs-to-html'
import { DraggableAccordion } from '../common/draggable-accordion'
import Player from 'next-video/player'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'
import { EditLessonItemModal } from '../modals/edit-lesson-item'
import { Checkbox } from '../ui/checkbox'
import LessonListSkeleton from '../skeletons/lesson-list'
import { DeleteLessonItemModal } from '../modals/delete-lesson-item'

interface ILessonUpdateData {
  title: string;
  description: string;
  progressionType: CourseLessonProgressionType | null;
}

interface Props {
  lesson: ICourseLesson
}

const lessonItemLabelMap: Record<CourseLessonItemType, string> = {
  'VIDEO': 'Video',
  'QUESTIONNAIRE': 'Quiz',
  'WYSIWYG': 'Custom'
}

export default function CourseLessonCreator({lesson}: Props) {
  const [lessonUpdateData, setLessonUpdateData] = useState<ILessonUpdateData>({
    title: '',
    description: '',
    progressionType: null
  });
  const [lessonItemToEdit, setLessonItemToEdit] = useState<ICourseLessonItem | null>(null);
  const [lessonItemToDelete, setLessonItemToDelete] = useState<ICourseLessonItem | null>(null);
  const [openLessonItemEditModal, setOpenLessonItemEditModal] = useState(false);
  const [openLessonItemDeleteModal, setOpenLessonItemDeleteModal] = useState(false);


  const queryClient =  useQueryClient();

  const {
    data: lessonItems, 
    isLoading: loadingLessonItems, 
    isRefetching: refetchingLessonItems, 
    refetch: refetchLessonItems
  } = useQuery({
    queryKey: ['lesson-items', lesson.id],
    queryFn: async() => await getCourseLessonItems(lesson.id)
  });

  const {mutate: updateCourseMutate, isPending: updatingLesson} = useMutation({
    mutationFn: async(data: IUpdateCourseLesson) => await updateCourseLesson(data),
    onSuccess() {
      queryClient.refetchQueries({queryKey: ['course']})
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Update Failure',
        description: error.message,
      });
    }
  });

  const {mutate: updateLessonItemsOrderMutate} = useMutation({
    mutationFn: async(data: IUpdateLessonItemsOrderData[]) => await updateLessonItemsOrder(data),
    onSuccess() {
      refetchLessonItems();
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    }
  });

  useEffect(() => {
    if(lesson) {
      setLessonUpdateData({
        title: lesson.title,
        description: lesson.description,
        progressionType: lesson.progressionType
      })
    }
  }, [lesson]);

  useEffect(() => {
    if(lessonUpdateData.progressionType) {
      handleSaveLesson();
    }
  }, [lessonUpdateData.progressionType]);

  const handleSaveLesson = () => {
    updateCourseMutate({
      id: lesson.id,
      ...lessonUpdateData
    })
  }

  const handleChangeProgression = (value: CourseLessonProgressionType) => {
    setLessonUpdateData((prev) => ({...prev, progressionType: value}));
  }

  const handleUpdateLessonItemsOrder = (items: ICourseLessonItem[]) => {
    const data = items.map(item => ({id: item.id, ordinalNumber: item.ordinalNumber}));
    updateLessonItemsOrderMutate(data);
  }

  const renderWYSIWYG = (content: string) => {
    if (!content) {
      console.error('Content is empty or null');
      return <div>No content available</div>;
    }
  
    let exampleData;
    try {
      exampleData = JSON.parse(content);
    } catch (error) {
      console.error('Invalid JSON:', error);
      return <div>Error parsing content</div>;
    }
  
    const contentAsHtml = draftToHtml({
      blocks: exampleData.blocks,
      entityMap: exampleData.entityMap,
    });
  
    return (
      <div
        className="prose text-[14px]"
        dangerouslySetInnerHTML={{ __html: contentAsHtml }}
      />
    );
  };  

  const handleEditCourseLesson = (event: MouseEvent<SVGSVGElement>, item: ICourseLessonItem) => {
    event.stopPropagation();
    setLessonItemToEdit(item);
    setOpenLessonItemEditModal(true);
  }

  const handleDeleteCourseLesson = (event: MouseEvent<SVGSVGElement>, item: ICourseLessonItem) => {
    event.stopPropagation();
    setLessonItemToDelete(item);
    setOpenLessonItemDeleteModal(true);
  }

  return (
    <div className='px-[26px] py-[21px]'>
      {updatingLesson && (
        <div className='w-full h-4 relative'>
          <div className='absolute w-full flex items-center justify-center gap-1 text-muted-foreground'>
            <Loader2 size={14} className='animate-spin' />
            <span className='text-[12px]'>Saving...</span>
          </div>
        </div>
      )}
      <div className='space-y-[15px]'>
        <div className='space-y-[10px]'>
          <Label className='text-[12px] font-[500]'>Lesson Title</Label>
          <Input
            value={lessonUpdateData.title}
            onChange={(event) => setLessonUpdateData({...lessonUpdateData, title: event.target.value})}
            onBlur={handleSaveLesson}
            className='h-[40px] border border-[#EEDDEE] text-[14px] text-[#29252199]'
            placeholder='Title'
          />
        </div>
        <div className='space-y-[10px]'>
          <Label className='text-[12px] font-[500]'>Lesson Description</Label>
          <Input
            value={lessonUpdateData.description}
            onChange={(event) => setLessonUpdateData({...lessonUpdateData, description: event.target.value})}
            onBlur={handleSaveLesson}
            className='h-[40px] border border-[#EEDDEE] text-[14px] text-[#29252199]'
            placeholder='Description'
          />
        </div>
        <div className='space-y-[10px]'>
          <Label className='text-[12px] font-[500]'>Progression type</Label>
          <RadioGroup 
            value={lessonUpdateData.progressionType || 'FREE'} 
            disabled={updatingLesson}
            className='text-muted-foreground flex items-center gap-4'
            onValueChange={handleChangeProgression}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="FREE" id="r1" />
              <Label htmlFor="r1" className='cursor-pointer text-[#A9A8A6] text-[12px]'>
                Free progression
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="STRICT" id="r2" />
              <Label htmlFor="r2" className='cursor-pointer text-[#A9A8A6] text-[12px]'>
                Strict progression
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className='pt-[41px]'>
        <div className='flex items-center gap-[24px] mb-[15px]'>
          <h1 className='text-[12px] font-[500]'>Lesson Items</h1>
          <AddLessonItemModal
            lesson={lesson}
          />
        </div>
        {(loadingLessonItems || refetchingLessonItems) ? (
          <LessonListSkeleton />
        ) : (
          <div className='bg-white border border-[#EEE6E6] rounded-[10px]'>
            {lessonItemToEdit && (
              <EditLessonItemModal 
                open={openLessonItemEditModal}
                onOpenChange={(value) => setOpenLessonItemEditModal(value)}
                lessonItem={lessonItemToEdit}
              />
            )}
            {lessonItemToDelete && (
              <DeleteLessonItemModal 
                open={openLessonItemDeleteModal}
                onOpenChange={(value) => setOpenLessonItemDeleteModal(value)}
                lessonItem={lessonItemToDelete}
              />
            )}
            {(lessonItems && lessonItems.length > 0) ? (
              <DraggableAccordion
                data={lessonItems}
                onDragSave={handleUpdateLessonItemsOrder}
                renderTrigger={(item) => (
                  <div className='w-full flex justify-between items-center pr-[15px]'>
                    <div className='flex flex-col items-start'>
                      <span className='text-[#A9A8A6] text-[8px]'>{lessonItemLabelMap[item.type]}</span>
                      <h1 className='text-[12px]'>{item.title}</h1>
                    </div>
                     <div className='flex row gap-3'>
                      <Pencil 
                        size={16} 
                        className='z-50 text-[#7F9CF3]'
                        onClick={(event) => handleEditCourseLesson(event, item)}
                      />
                      <Trash
                        size={16} 
                        className='z-50 text-[#bd463e]'
                        onClick={(event) => handleDeleteCourseLesson(event, item)}
                      />
                    </div>
                  </div>
                )}
                renderContent={(item) => (
                  <>
                    {item.type === 'VIDEO' && (
                      <Player
                        src={item.CourseLessonItemAsset?.url}
                        className="w-full h-[400px] rounded-[5px] bg-slate-200"
                        accentColor="#6E22DD"
                        style={{
                          zIndex: 0
                        }}
                      />
                    )}
                    {item.type === 'WYSIWYG' && (
                      renderWYSIWYG(item?.content ?? '')
                    )}
                    {item.type === 'QUESTIONNAIRE' && (
                      <div className='px-2 space-y-4'>
                        {item.CourseLessonQuestionnaireItem.map(questionnaireItem => (
                          <div className='space-y-2'>
                            <h1 className='text-[12px]'>
                              {`${questionnaireItem.ordinalNumber}. ${questionnaireItem.question}`}
                            </h1>
                            {questionnaireItem.type === 'MULTIPLE_CHOICE' && (
                              <div className="grid grid-cols-4 gap-2">
                                {questionnaireItem.choices?.map((choice, index) => (
                                  <div className="flex items-center space-x-2 pl-2">
                                    <Checkbox />
                                    <Label className="hover:cursor-pointer text-[12px]">
                                      {choice}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            )}
                            {questionnaireItem.type === 'SINGLE_CHOICE' && (
                              <RadioGroup defaultValue="video" className="grid grid-cols-4 gap-2">
                                {questionnaireItem.choices?.map((choice, index) => (
                                  <div className="flex items-center space-x-2 pl-2">
                                    <RadioGroupItem value={choice} id={choice + index}/>
                                    <Label className="hover:cursor-pointer text-[12px]">
                                      {choice}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            )}
                            {questionnaireItem.type === 'ESSAY' && (
                                <Textarea
                                  placeholder='Start writing your answer...'
                                  className='bg-gray-50'
                                />
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              />
            ) : (
              <div className='flex flex-col items-center justify-center h-[150px] text-muted-foreground'>
                <Folder size={20}/>
                <p className='text-[12px]'>Empty lesson items</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

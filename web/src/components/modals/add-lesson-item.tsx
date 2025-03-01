import { useCallback, useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../common/modal'
import { Label } from '@radix-ui/react-label'
import { Loader2, PlusCircle, XCircle } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { EditorState, convertToRaw } from 'draft-js'
import { EditorProps } from 'react-draft-wysiwyg'
import { useDropzone } from 'react-dropzone'
import { LessonItemType } from '@/utils/constants'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ICourseLesson } from '@/interfaces/course-lesson.interface'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../ui/use-toast'
import { createCourseLessonItem } from '../../../api/mutation/course-lesson-item'
import { IQuestionnaireItemData } from '@/interfaces/questionnaire.interface'
import Player from 'next-video/player'
import QuestionnaireItemCreator from '../sections/questionnaire-item-creator'

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

const formSchema = z.object({
  lessonTitle: z.string().min(2, {
    message: 'Lesson title must be at least 2 characters.',
  }),
})

interface Props {
  lesson: ICourseLesson,
}

export const AddLessonItemModal = ({lesson}: Props) => {
  const [open, setOpen] = useState(false);
  const [questionnaireItems, setQuestionnaireItems] = useState<IQuestionnaireItemData[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState<LessonItemType>('VIDEO')
  const [isErrorMsgVisible, setIsErrorMsgVisible] = useState<boolean>(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonTitle: '',
    },
  });

  const {mutate: addItemMutate, isPending: addingItem} = useMutation({
    mutationFn: async(data: FormData) => await createCourseLessonItem(data),
    onSuccess() {
      toast({
        variant: 'default',
        title: 'Lesson item added successfully',
      });
      queryClient.refetchQueries({queryKey: ['lesson-items']})
      setOpen(false);
      handleResetFields();
      setUploadedFile(null);
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Update Failure',
        description: error.message,
      });
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFile(acceptedFiles[0])
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov', '.mkv'] },
    onDrop,
  })

  const handleOnEditorStateChange = (editorState: any) => {
    setEditorState(editorState)
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    setIsErrorMsgVisible(false);

    if(selectedType === "VIDEO" && !uploadedFile) {
      setIsErrorMsgVisible(true)
      return
    }

    if(selectedType === "QUESTIONNAIRE" && questionnaireItems.length === 0) {
      setIsErrorMsgVisible(true)
      return
    }

    formData.append('title', values.lessonTitle);
    formData.append('type', selectedType);
    formData.append('courseLessonId', String(lesson.id));

    switch (selectedType) {
      case 'VIDEO':
        formData.append('video', uploadedFile as File);
        break
      case 'WYSIWYG':
        const contentState = editorState.getCurrentContent()
        const asset = JSON.stringify(convertToRaw(contentState))
        formData.append('content', asset);
        break
      case 'QUESTIONNAIRE':
        formData.append('questionnaireItems', JSON.stringify(questionnaireItems));
        break
    }
    addItemMutate(formData);
  }

  const handleResetFields = () =>{ 
    form.setValue("lessonTitle", "")
    setEditorState(EditorState.createEmpty())
    setQuestionnaireItems([])
  }

  const handleOnCancelClick = (e: any) => {
    e.stopPropagation()
    setOpen(false)
    handleResetFields()
  }

  const handleSelectType = (selectedType: LessonItemType) => {
    setSelectedType(selectedType)
  }

  return (
    <>
      <Modal open={open} onOpenChange={(value) => setOpen(value)}>
        <ModalTrigger>
          <Button 
            size={'sm'} variant={'ghost'} 
            className='text-[#37E31C] gap-1 h-[25px]'
          >
            <span className='text-[12px]'>Add</span>
            <PlusCircle size={12}/>
          </Button>
        </ModalTrigger>
        <ModalContent
          className="font-DM max-h-[90vh] min-w-[1027px] w-full flex flex-col overflow-hidden"
          onOverlayClick={(e) => handleOnCancelClick(e)}
        >
          <ModalHeader className="h-1/6">
            <ModalTitle>
              <div className="space-y-[6px]">
                <p className="text-xs text-[#29252160]">
                  {lesson.title}
                </p>
                <p>Add Lesson Item</p>
              </div>
            </ModalTitle>
          </ModalHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <ModalDescription className="flex-1 flex flex-col">
                <div className="flex flex-1 flex-col py-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="lessonTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <p>Lesson Title</p>
                            <Input
                              {...field}
                              placeholder="Lesson Title"
                              className="w-[472px] h-10"
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <RadioGroup defaultValue={selectedType} className="flex flex-row space-x-3">
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="VIDEO"
                          id="VIDEO"
                          onClick={() => handleSelectType('VIDEO')}
                        />
                        <Label htmlFor="VIDEO" className="hover:cursor-pointer">
                          Video
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="WYSIWYG"
                          id="WYSIWYG"
                          onClick={() => handleSelectType('WYSIWYG')}
                        />
                        <Label htmlFor="WYSIWYG" className="hover:cursor-pointer">
                          WYSIWYG
                        </Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem
                          value="QUESTIONNAIRE"
                          id="QUESTIONNAIRE"
                          onClick={() =>handleSelectType('QUESTIONNAIRE')}
                        />
                        <Label htmlFor="QUESTIONNAIRE" className="hover:cursor-pointer">
                          Questionnaire
                        </Label>
                      </div>
                  </RadioGroup>

                  <div className="flex flex-1 w-full min-h-[300px] h-full max-h-full">
                    {selectedType === 'VIDEO' && (
                      <>
                        {uploadedFile ? (
                          <div className='relative w-full flex flex-col items-center border rounded-md'>
                            <XCircle
                              className='text-gray-400 cursor-pointer absolute top-2 right-2 z-20'
                              onClick={() => setUploadedFile(null)}
                            />
                            <Player
                              src={URL.createObjectURL(uploadedFile)}
                              className="w-full h-[400px] rounded-[5px] bg-slate-200"
                              accentColor="#6E22DD"
                              style={{
                                zIndex: 0
                              }}
                            />
                          </div>
                        ) : (
                          <div className={`w-full h-full min-h-[300px] flex flex-col`} {...getRootProps()}>
                            <Input
                              type="file"
                              accept="video/mp4,video/x-m4v,video/*"
                              className="hidden"
                              {...getInputProps()}
                            />
                            <div className={`flex-1 h-full border border-[#F0E9E9] rounded-md flex flex-col items-center justify-center bg-[#FBFCFF] hover:bg-muted cursor-pointer ${isErrorMsgVisible && 'border-destructive'}`}>
                              <p>Drop Video File (.mp4, .mov, .mkv)</p>
                              {isErrorMsgVisible && (
                                <p className='text-destructive text-[12px]'>
                                  Please upload a video file
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    {selectedType === 'WYSIWYG' && (
                      <div className="w-full min-h-[300px] max-h-[300px] h-full border border-gray-200 rounded-md p-3 flex flex-col">
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={
                            handleOnEditorStateChange
                          }
                          editorClassName="p-1 h-full max-h-full" 
                          wrapperClassName="w-full h-full max-h-full overflow-auto"
                          placeholder="Begin typing..."
                        />
                      </div>
                    )}
                    {selectedType === 'QUESTIONNAIRE' && (
                      <QuestionnaireItemCreator 
                        questionnaireItems={questionnaireItems}
                        onChange={(value) => setQuestionnaireItems(value)}
                      />
                    )}
                  </div>
                </div>
              </ModalDescription>
              <ModalFooter className="flex items-center h-20">
                <ModalClose className="flex flex-row space-x-3">
                  <Button
                    type="submit"
                    size={'sm'}
                    variant={'ghost'}
                    className="text-[#37E31C] text-md gap-1"
                    onClick={(e) => e.stopPropagation()}
                    disabled={addingItem}
                  >
                    {addingItem && (
                      <Loader2 size={14} className='animate-spin'/>
                    )}
                    <span>Save</span>
                  </Button>
                  <Button
                    type="button"
                    variant={'link'}
                    className="text-[#9DB39A] hover:no-underline text-md"
                    onClick={(e) => handleOnCancelClick(e)}
                    disabled={addingItem}
                  >
                    Cancel
                  </Button>
                </ModalClose>
              </ModalFooter>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </>
  )
}

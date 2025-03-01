import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from '../common/modal'
import { Label } from '@radix-ui/react-label'
import { Loader2, XCircle } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import { EditorProps } from 'react-draft-wysiwyg'
import { useDropzone } from 'react-dropzone'
import { LessonItemType } from '@/utils/constants'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../ui/use-toast'
import { deleteCourseLessonItem, editCourseLessonItem } from '../../../api/mutation/course-lesson-item'
import { IQuestionnaireItemData } from '@/interfaces/questionnaire.interface'
import Player from 'next-video/player'
import QuestionnaireItemCreator from '../sections/questionnaire-item-creator'
import { ICourseLessonItem } from '@/interfaces/course-lesson-item.interface'

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
  lessonItem: ICourseLessonItem;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const DeleteLessonItemModal = ({lessonItem, open, onOpenChange}: Props) => {
  const [questionnaireItems, setQuestionnaireItems] = useState<IQuestionnaireItemData[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedType, setSelectedType] = useState<LessonItemType>('VIDEO')
  const [isErrorMsgVisible, setIsErrorMsgVisible] = useState<boolean>(false)
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonTitle: '',
    },
  });

  useEffect(() => {
    if (lessonItem) {
      form.reset({
        lessonTitle: lessonItem.title
      });
      if (lessonItem.content) {
        const contentState = convertFromRaw(JSON.parse(lessonItem.content as string));
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
      const data: IQuestionnaireItemData[] = lessonItem.CourseLessonQuestionnaireItem.map(item => ({
        id: item.id,
        ordinalNumber: item.ordinalNumber,
        question: item.question,
        type: item.type,
        choices: item.choices.map(choice => ({choice, isAnswer: item.correctAnswer.includes(choice)}))
      }));
      setQuestionnaireItems(data);
      setSelectedType(lessonItem.type)
    }
  }, [lessonItem]);

  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: async () => await deleteCourseLessonItem(lessonItem.id),
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Lesson item deleted successfully',
      });
      queryClient.refetchQueries({ queryKey: ['lesson-items'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Delete Failure',
        description: error.message,
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  const handleDeleteClick = () => {
    setIsDeleting(true);
    deleteItemMutate();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFile(acceptedFiles[0])
  }, []);

 
  const handleOnCancelClick = (e: any) => {
    e.stopPropagation()
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="font-DM max-h-[90vh] min-w-[250px] w-full flex flex-col overflow-hidden"
        onOverlayClick={(e) => handleOnCancelClick(e)}
      >
        <ModalHeader className="h-1/6">
          <ModalTitle>
            <div className="align-center space-y-[1px]">
              <p>Delete Lesson Item</p>
              <p className="text-xs text-[#29252160]">
                Are you sure you want to delete " {lessonItem.title} " ?
              </p>
            </div>
          </ModalTitle>
        </ModalHeader>
        <ModalFooter className="flex items-center h-10">
                <ModalClose className="flex flex-row space-x-2">
                <Button
                    type="submit"
                    size={'sm'}
                    variant={'ghost'}
                    className="text-[#bd463e] text-md gap-1 hover:bg-[#bd463e] hover:text-white"
                    onClick={handleDeleteClick} 
                    disabled={isDeleting}
                    >
                    {isDeleting && <Loader2 size={14} className="animate-spin" />}
                    <span>Delete</span>
                    </Button>
                  <Button
                    type="button"
                    variant={'link'}
                    className="text-[#9DB39A] hover:no-underline text-md"
                    onClick={(e) => handleOnCancelClick(e)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </ModalClose>
              </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

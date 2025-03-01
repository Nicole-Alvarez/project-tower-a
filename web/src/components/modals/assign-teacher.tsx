import { useEffect, useState } from 'react'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from '../common/modal'
import { Button } from '@/components/ui/button'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '../ui/use-toast'
import { getTeachers } from '../../../api/query/users'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import AnimatedDiv from '../animated/div'
import { CircleCheck, Loader2 } from 'lucide-react'
import { IAssignTeacher } from '@/interfaces/course.interface'
import { assignCourseTeacher } from '../../../api/mutation/courses'
import { Separator } from '../ui/separator'

interface Props {
  courseId: number,
  action: 'ASSIGN' | 'REASSIGN';
  currentTeacher: number | null;
}

export const AssignTeacherModal = ({courseId, action, currentTeacher}: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);

  const {mutate: assignTeacherMutate, isPending: assigning} = useMutation({
    mutationFn: async(data: IAssignTeacher) => await assignCourseTeacher(data),
    onSuccess() {
      toast({
        variant: 'default',
        title: 'Teacher assigned successfully',
      });
      queryClient.refetchQueries({queryKey: ['course-details']})
      setOpen(false);
    },
    onError(error) {
      toast({
        variant: 'destructive',
        title: 'Update Failure',
        description: error.message,
      });
    }
  });

  const {data: teachers} = useQuery({
    queryKey: ['teachers'],
    queryFn: async() => await getTeachers()
  });

  useEffect(() => {
    if (teachers || currentTeacher) {
      const teach = currentTeacher || teachers?.users?.[0].id || null;
      setSelectedTeacher(teach);
    }
  }, [teachers, currentTeacher]);

  const handleSave = () => {
    if (!selectedTeacher) {
      return toast({
        className: 'z-50',
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a teacher',
      });
    }

    if (selectedTeacher === currentTeacher) {
      return toast({
        style: {zIndex: 999},
        variant: 'destructive',
        title: 'Error',
        description: 'Please select another teacher',
      });
    }
    
    assignTeacherMutate({
      courseId,
      teacherId: selectedTeacher
    })
  }

  return (
    <Modal open={open} onOpenChange={(value) => setOpen(value)}>
      <ModalTrigger>
        <Button size={'sm'} variant={'secondary'} className='w-[100px] text-[12px] font-semibold'>
          {action === 'ASSIGN' ? 'Assign' : 'Reassign'}
        </Button>
      </ModalTrigger>
      <ModalContent className="font-DM min-h-[400px] max-h-[500px] min-w-[700px] w-full flex flex-col overflow-hidden">
        <ModalHeader className="h-1/6">
          <ModalTitle>
            {action === 'ASSIGN' ? 'Assign Teacher' : 'Reassign Teacher'}
          </ModalTitle>
        </ModalHeader>
        <Separator />
        <AnimatedDiv 
          className='flex-1 overflow-y-auto space-y-1'
          animation='EaseInLeft' delay={0} scale={1.02}
        >
          {teachers?.users.map((user, index) => (
            <div 
              key={index} 
              className={`
                flex items-center gap-2 p-2 border 
                ${selectedTeacher === user.id ? 'border-green-500' : 'border-white'} 
                ${currentTeacher === user.id && 'border-green-500 bg-green-50'} 
                hover:border-green-500 rounded-lg cursor-pointer
              `}
              onClick={() => setSelectedTeacher(user.id)}
            >
              <Avatar>
                <AvatarImage src={user.profilePicture}/>
                <AvatarFallback>
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 flex flex-col '>
                <h1 className='text-[14px] font-semibold'>{user.name}</h1>
                <span className='text-[12px] text-[#292521]/50'>{user.email}</span>
              </div>
              {(currentTeacher && currentTeacher === user.id) && (
                <CircleCheck size={18} className='text-green-500'/>
              )}
            </div>
          ))}
        </AnimatedDiv>
        <Separator />
        <ModalFooter>
          <ModalClose>
            <Button 
              variant={'secondary'} className='w-[100px]'
              disabled={assigning}
            >
              Cancel
            </Button>
          </ModalClose>
          <Button 
            className='w-[100px] gap-1'
            disabled={assigning}
            onClick={handleSave}
          >
            {assigning && (
              <Loader2 size={18} className='animate-spin'/>
            )}
            <span>Save</span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

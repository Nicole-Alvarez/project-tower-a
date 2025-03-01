import { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from '../common/modal';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { ICourse } from '@/interfaces/course.interface';
import { deleteCourse } from '../../../api/mutation/courses';


interface Props {
  course: ICourse;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const DeleteCourseModal = ({ course, open, onOpenChange }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  
  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: async () => await deleteCourse(course.id),
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Course Deleted Successfully',
      });
      queryClient.refetchQueries({ queryKey: ['courses'] });
      onOpenChange(false);
      window.history.back();
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
 
  const handleOnCancelClick = (e: any) => {
    e.stopPropagation();
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        className="font-DM max-h-[90vh] min-w-[250px] w-full flex flex-col overflow-hidden"
        onOverlayClick={(e) => handleOnCancelClick(e)}
      >
        <ModalHeader className="h-1/6">
          <ModalTitle>
            <p className="text-lg font-semibold">Permanently delete "{course?.title}"?</p>
          </ModalTitle>
        </ModalHeader>
        <ModalFooter className="flex items-center h-10">
          <ModalClose className="flex flex-row space-x-2">
            <Button
              type="button"
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
              onClick={handleOnCancelClick}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

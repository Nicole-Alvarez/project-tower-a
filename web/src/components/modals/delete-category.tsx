import { useCallback, useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  ModalClose,
} from '../common/modal'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '../ui/use-toast'
import { ICategory } from '@/interfaces/category.interface'
import { deleteCategory } from '../../../api/mutation/category'


interface Props {
  category: ICategory;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const DeleteCategoryModal = ({category, open, onOpenChange}: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  

  const { mutate: deleteItemMutate } = useMutation({
    mutationFn: async () => await deleteCategory(category.id),
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Category deleted successfully',
      });
      queryClient.refetchQueries({ queryKey: ['categories'] });
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
              <p>Delete Category</p>
              <p className="text-xs text-[#29252160]">
                Are you sure you want to delete " {category.name} " ?
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

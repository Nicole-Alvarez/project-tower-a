import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, ModalClose } from '../common/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { ICategory } from '@/interfaces/category.interface';
import { updateCategoryTitle } from '../../../api/mutation/category';

const formSchema = z.object({
    categoryTitle: z.string().min(2, {
      message: 'Title must be at least 2 characters.',
    }),
  });
  
  interface Props {
    category: ICategory;
    open: boolean;
    onOpenChange: (value: boolean) => void;
  }
  
  export const EditCategoryModal = ({ category, open, onOpenChange }: Props) => {
    const queryClient = useQueryClient();
  
    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        categoryTitle: '',
      },
    });
  
    useEffect(() => {
      if (category) {
        form.reset({ categoryTitle: category.name });
      }
    }, [category, form]);
  
    const { mutate: editItemMutate, isPending: updating } = useMutation({
      mutationFn: async (data: { categoryTitle: string }) => 
        await updateCategoryTitle(category.id, data.categoryTitle), // Calls the updated mutation function
      onSuccess: () => {
        toast({ variant: 'default', title: 'Category title updated successfully' });
        queryClient.refetchQueries({ queryKey: ['categories'] });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
      },
    });
  
    const handleSubmit = (values: { categoryTitle: string }) => {
      editItemMutate(values);
    };
  
    return (
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit Category</ModalTitle>
          </ModalHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Input
              {...form.register('categoryTitle')}
              placeholder="Category Title"
              className="w-full"
            />
            <ModalFooter className="flex items-center pt-[10px]">
              <Button type="submit" disabled={updating}>Save</Button>
              <Button type="button" variant="link" onClick={() => onOpenChange(false)} disabled={updating}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };
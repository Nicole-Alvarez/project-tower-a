import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '../common/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { createCategory } from '../../../api/mutation/category'; // Import your mutation function

const formSchema = z.object({
  categoryTitle: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
});

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export const CreateCategoryModal = ({ open, onOpenChange }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryTitle: '',
    },
  });

  const { mutate: createItemMutate, isPending: creating } = useMutation({
    mutationFn: async (data: { categoryTitle: string }) => 
      await createCategory(data.categoryTitle),
    onSuccess: () => {
      toast({ variant: 'default', title: 'Category created successfully' });
      queryClient.refetchQueries({ queryKey: ['categories'] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', title: 'Create Failed', description: error.message });
    },
  });

  const handleSubmit = (values: { categoryTitle: string }) => {
    createItemMutate(values);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Category</ModalTitle>
        </ModalHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Input
            {...form.register('categoryTitle')}
            placeholder="Category Title"
            className="w-full"
          />
          <ModalFooter className="flex items-center pt-[10px]">
            <Button type="submit" disabled={creating}>Save</Button>
            <Button type="button" variant="link" onClick={() => onOpenChange(false)} disabled={creating}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

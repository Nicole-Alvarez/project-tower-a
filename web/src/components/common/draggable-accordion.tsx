import { useEffect, useRef, useState } from 'react';
import { GripVertical } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '../ui/separator';

interface DraggableAccordionProps<T> {
  data: T[];
  onDragSave: (updatedItems: T[]) => void;
  renderTrigger: (item: T, index: number) => React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
}

export const DraggableAccordion = <T extends {ordinalNumber: number}>({
  data,
  onDragSave,
  renderTrigger,
  renderContent,
}: DraggableAccordionProps<T>) => {
  const [items, setItems] = useState<T[]>(data);
  const [sortedItems, setSortedItems] = useState<T[]>(
    [...items].sort((a, b) => a.ordinalNumber  - b.ordinalNumber)
  );
  const [isDragging, setIsDragging] = useState(false);
  const draggedItemRef = useRef<number>(0);
  const draggedOverItemRef = useRef<number>(0);

  const handleOnDragStart = (index: number) => {
    draggedItemRef.current = index;
    setIsDragging(true);
  };

  const handleOnDragEnd = () => {
    setIsDragging(false);
    let updatedItems = [...items];
    const draggedIndex = draggedItemRef.current;
    const draggedOverIndex = draggedOverItemRef.current;

    if (
      draggedIndex === draggedOverIndex ||
      draggedIndex < 0 ||
      draggedOverIndex < 0 ||
      draggedIndex >= updatedItems.length ||
      draggedOverIndex >= updatedItems.length
    ) {
      return;
    }

    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(draggedOverIndex, 0, draggedItem);

    const finalItems = updatedItems.map((item, index) => ({
      ...item,
      ordinalNumber: index + 1,
    }));

    onDragSave(finalItems);
    setItems(finalItems);
  };

  useEffect(() => {
    setItems(data);
  }, [data]);

  useEffect(() => {
    if (items) {
      const newSortedItems = [...items].sort((a, b) => a.ordinalNumber - b.ordinalNumber);
      setSortedItems(newSortedItems);
    }
  }, [items]);

  return (
    <Accordion type="single" collapsible className="h-full w-full rounded-[10px]">
      {sortedItems.map((item, index) => (
        <AccordionItem key={String(index)} value={index.toString()}>
          {(index > 0) && <Separator />}
          <AccordionTrigger 
            className={`p-0 h-[58px] w-full z-0 px-4 bg-white rounded-[10px]`}
            draggable
            onDragStart={() => handleOnDragStart(index)}
            onDragEnter={() => (draggedOverItemRef.current = index)}
            onDragEnd={handleOnDragEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
          >
            <div>
              <GripVertical 
                color="#A9A8A6" size={24}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              />
            </div>
            {renderTrigger(item, index)}
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t">
            {renderContent(item)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

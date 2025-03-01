import { GripVertical } from 'lucide-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react'

interface DraggableListProps<T> {
  data: T[];
  onDragSave: (updatedItems: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}
export const DraggableList = <T extends {ordinalNumber: number}>({
  data,
  onDragSave,
  renderItem
}: DraggableListProps<T>) => {
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
    <>
      {sortedItems.map((item, index) => (
        <div
          draggable
          onDragStart={() => handleOnDragStart(index)}
          onDragEnter={() => (draggedOverItemRef.current = index)}
          onDragEnd={handleOnDragEnd}
          style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </>
  );
}

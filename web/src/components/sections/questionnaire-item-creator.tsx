import React, { MouseEvent, useState } from 'react'
import { AddQuestionnaireModal } from '../modals/add-questionnaire-item'
import { Pencil } from 'lucide-react'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'
import { IQuestionnaireItemData } from '@/interfaces/questionnaire.interface'
import { EditQuestionnaireModal } from '../modals/edit-questionnaire-item'
import { DraggableAccordion } from '../common/draggable-accordion'

interface Props {
  questionnaireItems: IQuestionnaireItemData[];
  onChange: (value: IQuestionnaireItemData[]) => void;
}

export default function QuestionnaireItemCreator({questionnaireItems, onChange}: Props) {
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [questionnaireItemToEdit, setQuestionnaireItemToEdit] = useState<IQuestionnaireItemData | null>(null);

  const handleSaveQuestionnaireItem = (value: IQuestionnaireItemData) => {
    const sortedItems = questionnaireItems
      .filter((item) => item.ordinalNumber !== null)
      .sort((a, b) => (a.ordinalNumber! - b.ordinalNumber!));
    let highest = sortedItems[sortedItems.length - 1]?.ordinalNumber || 0;
    onChange([...questionnaireItems, {...value, ordinalNumber: ++highest}]);
  }

  const handleEditQuestionnaireItem = (event: MouseEvent<SVGSVGElement>, item: IQuestionnaireItemData) => {
    event.stopPropagation();
    setQuestionnaireItemToEdit(item);
    setOpenEditItemModal(true);
  }

  const handleUpdateQuestionnaireItem = (value: IQuestionnaireItemData) => {
    const newItemValue = questionnaireItems.map(item => 
      item.ordinalNumber === value.ordinalNumber
      ? {...item, ...value}
      : item
    );

    onChange(newItemValue);
  }

  return (
    <div className="w-full h-[300px]">
      <AddQuestionnaireModal 
        onSave={handleSaveQuestionnaireItem}
      />
      {questionnaireItemToEdit && (
        <EditQuestionnaireModal
          open={openEditItemModal}
          onOpenChange={setOpenEditItemModal}
          onSave={handleUpdateQuestionnaireItem}
          questionnaireItem={questionnaireItemToEdit}
        />
      )}
      {questionnaireItems.length > 0 ? (
        <div className='border flex flex-1 w-full overflow-auto rounded-[10px]'>
          <DraggableAccordion 
            data={questionnaireItems}
            onDragSave={onChange}
            renderTrigger={(item) => (
              <div className='w-full flex justify-between items-center px-2'>
                <h1 className='text-[12px]'>{item.question}</h1>
                <Pencil 
                  size={16} 
                  className='text-[#37E31C] cursor-pointer'
                  onClick={(event) => handleEditQuestionnaireItem(event, item)}
                />
              </div>
            )}
            renderContent={(item) => (
              <>
                {item.type === 'MULTIPLE_CHOICE' && (
                  <div className='px-2 space-y-4'>
                    <h1 className='font-medium text-primary'>Choices</h1>
                    <div className="grid grid-cols-4 space-x-2">
                      {item.choices?.map((item, index) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox id={String(index)}/>
                          <Label htmlFor={String(index)} className="hover:cursor-pointer">
                            {item.choice}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {item.type === 'SINGLE_CHOICE' && (
                  <div className='px-2 space-y-4'>
                    <h1 className='font-medium text-primary'>Choices</h1>
                    <RadioGroup defaultValue="video" className="flex flex-row flex-wrap space-x-3">
                      {item.choices?.map((item, index) => (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={item.choice} id={String(index)}/>
                          <Label htmlFor={String(index)} className="hover:cursor-pointer">
                            {item.choice}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
                {item.type === 'ESSAY' && (
                  <Textarea
                    placeholder='Start writing your answer...'
                    className='bg-gray-50'
                  />
                )}
              </>
            )}
          />
        </div>
      ) : (
        <div className='border h-full flex items-center justify-center'>
          <span>No questionnaire items yet.</span>
        </div>
      )}
    </div>
  )
}

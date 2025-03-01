import { ChangeEvent, useEffect, useState } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalFooter,
    ModalClose,
    ModalDescription,
} from '../common/modal'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { CheckCircle, CirclePlus, Pencil, Undo2Icon } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { IQuestionnaireItemData, QuestionnaireItemChoice, QuestionnaireItemType } from '@/interfaces/questionnaire.interface'

interface Props {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    questionnaireItem: IQuestionnaireItemData;
    onSave: (value: IQuestionnaireItemData) => void
}

const choiceDefaultItem = {
    choice: '',
    isAnswer: false
}
 
export const EditQuestionnaireModal = (props: Props) => {
    const {open, onOpenChange, questionnaireItem,  onSave} = props;
    const [choices, setChoices] = useState<QuestionnaireItemChoice[]>([]);
    const [question, setQuestion] = useState('');
    const [questionError, setQuestionError] = useState('');
    const [choiceErrors, setChoiceErrors] = useState<string[]>([]);
    const [choicesError, setChoicesError] = useState<string>('');
    const [questionnaireType, setQuestionnaireType] = useState<QuestionnaireItemType>('MULTIPLE_CHOICE');

    useEffect(() => {
        if(questionnaireItem) {
            setChoices(questionnaireItem.choices || [choiceDefaultItem]);
            setQuestion(questionnaireItem.question);
            setQuestionnaireType(questionnaireItem.type);
        }
    }, [questionnaireItem]);

    const handleSave = () => {
        if(!question) return setQuestionError('Question cannot be empty');

        if(questionnaireType === 'MULTIPLE_CHOICE' || questionnaireType === 'SINGLE_CHOICE') {
            if(choices.length <= 0) {
                return setChoicesError('Please add at least on choice.');
            }
            
            const choiceErrors = choices.map((item) => (item.choice.trim() === '' ? 'Choice cannot be empty' : ''));
            if(!choiceErrors.every((error) => error === '')) {
                return setChoiceErrors(choiceErrors);
            }

            onSave({
                ordinalNumber: questionnaireItem.ordinalNumber,
                choices,
                question,
                type: questionnaireType
            });
        }

        if(questionnaireType === 'ESSAY') {
            onSave({
                ordinalNumber: questionnaireItem.ordinalNumber,
                choices: null,
                question,
                type: questionnaireType
            });
        }
        
        setChoices([choiceDefaultItem]);
        onOpenChange(false);
    }

    const handleChangeQuestion = (event: ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value);
        setQuestionError('');
    }

    const handleAddChoice = () => {
        const newErrors = choices.map((item) => (item.choice.trim() === '' ? 'Choice cannot be empty' : ''));
        // Add new choice if no errors
        if (newErrors.every((error) => error === '')) {
            setChoices([...choices, choiceDefaultItem]);
        }
        setChoiceErrors(newErrors);
    }

    const selectQuestionnaireType = (type: QuestionnaireItemType) => {
        setQuestionnaireType(type);
        setChoices([choiceDefaultItem])
    }

    const handleChoiceInputChange = (value: string, index: number) => {
        setChoices((prev) => 
            prev.map((choice, i) => i === index ? { ...choice, choice: value } : choice)
        );
        setChoiceErrors((prev) => 
            prev.map((error, i) => i === index ? '' : error)
        );
    }

    const handleSetAsAnswer = (index: number) => {
        setChoices((prev) => 
            prev.map((choice, i) => i === index ? { ...choice, isAnswer: true } : choice)
        );
    }

    const handleRemoveAnswer = (index: number) => {
        setChoices((prev) => 
            prev.map((choice, i) => i === index ? { ...choice, isAnswer: false } : choice)
        );
    }

    return (
        <div className="font-DM">
            <Modal open={open} onOpenChange={onOpenChange}>
                <ModalContent className="font-DM h-auto min-w-[785px] w-full flex flex-col justify-between">
                    <ModalHeader>
                        <ModalTitle>
                            <div className="space-y-[6px]">
                                <p className="text-xs text-[#29252160]">
                                    {questionnaireItem.question}
                                </p>
                                <p>Edit Questionnaire Item</p>
                            </div>
                        </ModalTitle>
                        <div className="pt-[17px] space-y-2">
                            <div>
                                <Label className="text-[12px]">Question</Label>
                                <Input
                                    placeholder="Enter your question"
                                    className="w-full h-10 border-[#EEDDEE]"
                                    value={question}
                                    onChange={handleChangeQuestion}
                                />
                                {questionError && <span className='text-destructive text-[12px]'>{questionError}</span>}
                            </div>
                                        
                            <RadioGroup 
                                defaultValue="multiple-choice"
                                className="flex flex-row space-x-[30px] pt-[7px]"
                                disabled
                            >
                                <div className="flex items-center space-x-[13px]">
                                    <RadioGroupItem
                                        value="multiple-choice"
                                        id="multiple-choice"
                                        checked={questionnaireType === 'MULTIPLE_CHOICE'}
                                        onClick={() => selectQuestionnaireType('MULTIPLE_CHOICE')}
                                    />
                                    <Label htmlFor="multiple-choice" className="hover:cursor-pointer text-[12px]">
                                        Multiple Choice
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-[13px]">
                                    <RadioGroupItem
                                        value="single-choice"
                                        id="single-choice"
                                        checked={questionnaireType === 'SINGLE_CHOICE'}
                                        onClick={() => selectQuestionnaireType('SINGLE_CHOICE')}
                                    />
                                    <Label htmlFor="single-choice" className="hover:cursor-pointer text-[12px]">
                                        Single Choice
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-[13px]">
                                    <RadioGroupItem
                                        value="essay"
                                        id="essay"
                                        checked={questionnaireType === 'ESSAY'}
                                        onClick={() => selectQuestionnaireType('ESSAY')}
                                    />
                                    <Label htmlFor="essay" className="hover:cursor-pointer text-[12px]">
                                        Essay
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </ModalHeader>
                    <ModalDescription className='mt-5'>
                        {(questionnaireType === 'MULTIPLE_CHOICE' || questionnaireType === 'SINGLE_CHOICE') && (
                            <>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        type='button'
                                        variant={'ghost'}
                                        className="w-fit h-[25px] px-0 gap-1 hover:bg-transparent"
                                        onClick={handleAddChoice}
                                    >
                                        <span className="text-[#37E31C] ">Add</span>
                                        <CirclePlus size={12} color="#37E31C" />
                                    </Button>
                                    <span className='text-destructive text-[14px]'>
                                        {choicesError}
                                    </span>
                                </div>
                                {choices.map((item, index: number) => {
                                    const hasAnswer = choices.some(item => item.isAnswer === true);
                                    const canSetAsAnswer = (() => {
                                        if(questionnaireType === 'MULTIPLE_CHOICE' && !item.isAnswer) {
                                            return true;
                                        }
                                        if (questionnaireType === 'SINGLE_CHOICE' && !hasAnswer) {
                                            return true;
                                        }
                                        return false;
                                    })();
                                    return (
                                        <div className='space-y-1 py-2'>
                                            <div className='flex items-center gap-4'>
                                                <p className="text-[#292521] text-[12px]">
                                                    Choice {index + 1}
                                                </p>
                                                {item.isAnswer && (
                                                    <div className='flex items-center gap-1 py-1'>
                                                        <CheckCircle className='text-[#37E31C]' size={12}/>
                                                        <span className='text-[#292521] text-[12px]'>Correct answer</span>
                                                        <Undo2Icon 
                                                            className='text-muted-foreground ml-2 cursor-pointer'
                                                            size={14}
                                                            onClick={() => handleRemoveAnswer(index)}
                                                        />
                                                    </div>
                                                )}
                                                {canSetAsAnswer && (
                                                    <Button
                                                        type='button'
                                                        variant={'ghost'}
                                                        className="h-[25px] px-2"
                                                        onClick={() => handleSetAsAnswer(index)}
                                                    >
                                                        <p className="text-[#37E31C] text-[12px] font-bold ">
                                                        Set as answer
                                                        </p>
                                                    </Button>
                                                )}
                                            </div>
                                            <Input
                                                value={item.choice}
                                                placeholder="Enter your choice"
                                                onChange={(event) => handleChoiceInputChange(event.target.value, index)}
                                            />
                                            {choiceErrors[index] && (
                                                <span className='text-[12px] text-destructive'>{choiceErrors[index]}</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </>
                        )}
                    </ModalDescription>
                    <ModalFooter className="flex items-center h-20">
                        <Button
                            variant={'link'}
                            className="text-[#37E31C] hover:no-underline text-md"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                        <ModalClose>
                            <Button
                                type="button"
                                variant={'link'}
                                className="text-[#71876e] hover:no-underline text-md"
                            >
                                Cancel
                            </Button>
                        </ModalClose>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

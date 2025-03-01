import { useRef, useState } from 'react'
import {
    Modal,
    ModalTrigger,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalDescription,
    ModalFooter,
    ModalClose,
} from '../common/modal'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { CirclePlus } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { QuestionnaireType } from '@/utils/constants'

const formSchema = z.object({
    question: z.string().min(2, {
        message: 'Question must be at least 2 characters.',
    }),
})

export const QuestionnaireEditModal = ({
    index,
    questionnaireItem,
    onSave,
}: any) => {
    const mappedCorrectAnswerIndices = questionnaireItem.correctAnswer.map((item: number) => questionnaireItem?.choices.indexOf(item))
    const [choices, setChoices] = useState<string[]>(questionnaireItem?.choices || [''])
    const [selectedQuestionnaireType, setSelectedQuestionnaireType] = useState<QuestionnaireType>(questionnaireItem?.type || 'multiple-choice')
    const [correctAnswer, setCorrectAnswer] = useState<number[]>(mappedCorrectAnswerIndices || [])
    const questionnaireEditModalCloseRef = useRef<HTMLButtonElement | null>(null)
    const questionnaireEditModalForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: questionnaireItem?.question || '',
        },
    })

    const handleOnAddChoicesClick = () => {
        let newChoices = [...choices]
        newChoices.push('')
        setChoices(newChoices)
    }

    const handleOnChoicesChange = (value: any, index: number) => {
        const newChoices = [...choices]
        let newCorrectAnswer =[...correctAnswer]
        newChoices[index] = value

        if(!value && newCorrectAnswer.includes(index)) {
            const indexOfAnswer = newCorrectAnswer.indexOf(index)
            newCorrectAnswer.splice(indexOfAnswer, 1)
            setCorrectAnswer(newCorrectAnswer)
        }

        setChoices(newChoices)
    }

    const onSaveClick = (values: z.infer<typeof formSchema>) => {
        let correctAnswers = correctAnswer.map(item => choices[item])

        const newData = {
            question: values.question,
            type: selectedQuestionnaireType,
            choices: selectedQuestionnaireType !== 'essay' ? choices : [],
            correctAnswer:
                selectedQuestionnaireType !== 'essay' ? correctAnswers : [],
        }
        onSave(newData, index)
        questionnaireEditModalCloseRef.current?.click()
    }

    const handleOnSaveClick = (e: React.MouseEvent) => {
        e.stopPropagation()

        const emptyChoices = choices.filter(item => item === '')
        
        if(selectedQuestionnaireType === "essay" || correctAnswer.length && choices.length > 0 && emptyChoices.length === 0) {
            questionnaireEditModalForm.handleSubmit(onSaveClick)();
        }
    }

    const handleOnCancelClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setChoices(questionnaireItem?.choices || [''])
        setSelectedQuestionnaireType(questionnaireItem?.type || 'multiple-choice')
        setCorrectAnswer(mappedCorrectAnswerIndices || [])
        questionnaireEditModalForm.setValue("question", questionnaireItem?.question)
        questionnaireEditModalCloseRef.current?.click()
    }

    const handleOnSelectQuestionnaireType = (questionnaireType: QuestionnaireType) => {
        setCorrectAnswer([])
        setSelectedQuestionnaireType(questionnaireType)
    }

    const handleSetAsAnswer = (selectedAnswer: string, selectedAnswerIndex: number, e: React.MouseEvent) => {
        e.stopPropagation()
        let newCorrectAnswer = [...correctAnswer]
        if (!selectedAnswer) {
            return
        }
        if (
            selectedQuestionnaireType === 'multiple-choice' &&
            !newCorrectAnswer.includes(selectedAnswerIndex)
        ) {
            newCorrectAnswer.push(selectedAnswerIndex)
        }

        if (selectedQuestionnaireType === 'single-choice') {
            newCorrectAnswer = [selectedAnswerIndex]
        }
        setCorrectAnswer(newCorrectAnswer)
    }

    const handleUnsetAsAnswer = (selectedAnswer: number, e: React.MouseEvent) => {
        e.stopPropagation()
        let newCorrectAnswer = [...correctAnswer]
        if (selectedAnswer === null) {
            return
        }
        if (
            selectedQuestionnaireType === 'multiple-choice' &&
            newCorrectAnswer.includes(selectedAnswer)
        ) {
            const indexOfAnswer = newCorrectAnswer.indexOf(selectedAnswer)
            newCorrectAnswer.splice(indexOfAnswer, 1)
        }

        if (selectedQuestionnaireType === 'single-choice') {
            newCorrectAnswer = []
        }
        setCorrectAnswer(newCorrectAnswer)
    }

    return (
        <div className="font-DM">
            <Modal>
                <ModalTrigger>
                    <div className="flex flex-row items-center space-x-1 hover:cursor-pointer">
                        <Pencil size={16} color="#37E31C" />
                    </div>
                </ModalTrigger>
                <ModalContent className="font-DM h-auto min-w-[785px] w-full flex flex-col justify-between">
                    <Form {...questionnaireEditModalForm}>
                        <form onSubmit={questionnaireEditModalForm.handleSubmit(onSaveClick)}>
                            <ModalHeader>
                                <ModalTitle>
                                    <div className="space-y-[6px]">
                                        <p className="text-xs text-[#29252160]">
                                            Questionnaire Item {index + 1}
                                        </p>
                                        <p>Edit Questionnaire Item</p>
                                    </div>
                                </ModalTitle>
                                <div className="pt-[17px] space-y-2">
                                    <FormField
                                            control={questionnaireEditModalForm.control}
                                            name="question"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <>
                                                            <p className="text-[12px]">Question</p>
                                                            <Input
                                                                {...field}
                                                                placeholder="Enter your question"
                                                                className="w-full h-10 border-[#EEDDEE]"
                                                            />
                                                        </>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    <RadioGroup defaultValue="multiple-choice" className="flex flex-row space-x-[30px] pt-[7px]">
                                        <div className="flex items-center space-x-[13px]">
                                            <RadioGroupItem value="multiple-choice" id="multiple-choice" onClick={() => handleOnSelectQuestionnaireType('multiple-choice')}/>
                                            <Label htmlFor="multiple-choice" className="hover:cursor-pointer">
                                                Multiple Choice
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-[13px]">
                                            <RadioGroupItem value="single-choice" id="single-choice" onClick={() => handleOnSelectQuestionnaireType('single-choice')}/>
                                            <Label htmlFor="single-choice" className="hover:cursor-pointer">
                                                Single Choice
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-[13px]">
                                            <RadioGroupItem value="essay" id="essay" onClick={() => handleOnSelectQuestionnaireType('essay')}/>
                                            <Label htmlFor="essay" className="hover:cursor-pointer">
                                                Essay
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                    
                            </ModalHeader>
                            <ModalDescription className='mt-5'>
                                    {selectedQuestionnaireType !== 'essay' && (
                                        <>
                                            <div className='flex flex-col space-y-3'>
                                                <div className="flex flex-row items-center space-x-1 hover:cursor-pointer" onClick={handleOnAddChoicesClick}>
                                                    <p className="text-[#37E31C]">Add</p>
                                                    <CirclePlus size={12} color="#37E31C" />
                                                </div>
                                                {!correctAnswer.length && choices.length > 0 && (
                                                    <div>
                                                        <p className='text-[#FF3838]'>Please set an answer</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="h-auto max-h-[240px] overflow-auto mb-2 pt-[6px] space-y-3">
                                                {choices.map(
                                                    (item: any, index: number) => {
                                                        return (
                                                            <div className="px-2">
                                                                <div className="flex flex-row space-x-2 space-y-0 p-0 items-center">
                                                                    <p className="text-[#292521] text-[12px]">
                                                                        Choice{' '}
                                                                        {index + 1}
                                                                    </p>
                                                                    {!correctAnswer.includes(index) && (
                                                                        <Button
                                                                            type='button'
                                                                            variant={'link'}
                                                                            className="hover:no-underline"
                                                                            onClick={(e) => handleSetAsAnswer(item, index, e)}
                                                                        >
                                                                            <p className="text-[#37E31C]">
                                                                                Set as answer
                                                                            </p>
                                                                        </Button>
                                                                    )}

                                                                    {correctAnswer.includes(
                                                                        index
                                                                    ) && (
                                                                        <Button
                                                                            type='button'
                                                                            variant={'link'}
                                                                            className="hover:no-underline"
                                                                            onClick={(e) => handleUnsetAsAnswer(index,e)}
                                                                        >
                                                                            <p className="text-[#FF3838]">
                                                                                Unset as answer
                                                                            </p>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <Input
                                                                    placeholder="Enter your choice "
                                                                    value={item}
                                                                    className="w-full mb-1"
                                                                    style={{
                                                                        borderColor: item !== '' ? '#EEDDEE': '#FF3838'
                                                                    }}
                                                                    onChange={(e: any) => handleOnChoicesChange(e.target.value,index)
                                                                    }
                                                                />
                                                                {item === '' && (
                                                                    <p className='text-sm text-[#FF3838]'>Required</p>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </>
                                    )}
                            </ModalDescription>
                            <ModalFooter className="flex items-center h-20">
                                <ModalClose className="flex flex-row space-x-8" ref={questionnaireEditModalCloseRef}>
                                        <Button
                                            type='button'
                                            variant={'link'}
                                            className="text-[#37E31C] hover:no-underline text-md"
                                            onClick={(e) => handleOnSaveClick(e)}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={'link'}
                                            className="text-[#71876e] hover:no-underline text-md"
                                            onClick={(e) => handleOnCancelClick(e)}
                                        >
                                            Cancel
                                        </Button>
                                </ModalClose>
                            </ModalFooter>
                        </form>
                    </Form>
                </ModalContent>
            </Modal>
        </div>
    )
}

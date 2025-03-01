import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useToast } from '@/components/ui/use-toast'
import { upsertQuestionnaireAnswer } from '../../../../api/mutation/questionnaire'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Trophy, X } from 'lucide-react'
import { ICourseLessonQuestionnaireItem } from '@/interfaces/questionnaire.interface'
import AnimatedDiv from '@/components/animated/div'
import { fetchQuestionAnswer } from '../../../../api/query/question-answer'
import { ICourseLessonItem } from '@/interfaces/course-lesson-item.interface'
import { IUpsertQuestionnaireAnswer } from '@/interfaces/questionnaire-answer.interface'
import { Button } from '@/components/ui/button'

interface Props {
    selectedLesson: any;
    onPressPreviousLesson: () => void; 
    selectedLessonItem: ICourseLessonItem;
    onPressNextLesson: any;
    isLastLessonItem: boolean;
    isCompleted: boolean
    isFirstLessonItem:boolean
}
export const Questionnaire = ({
    selectedLesson,
    selectedLessonItem,
    onPressNextLesson,
    isLastLessonItem,
    isCompleted,
    onPressPreviousLesson,
    isFirstLessonItem,
}: Props) => {
    const [currentQuestion, setCurrentQuestion] = useState<ICourseLessonQuestionnaireItem | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [moveTo, setMoveTo] = useState<'PREV' | 'NEXT' | null>(null);

    const { toast } = useToast();
    
    const sortedQuestions = selectedLessonItem.CourseLessonQuestionnaireItem.sort(
        (a, b) => a.ordinalNumber - b.ordinalNumber
    );
    const {data: questionnaireAnswer} = useQuery({
        queryKey: ['questionnaire-answer', currentQuestion?.id],
        queryFn: async() => {
            if (currentQuestion?.id) {
                return await fetchQuestionAnswer(currentQuestion.id);
            }
        },
        enabled: !!currentQuestion?.id
    });

    useEffect(() => {
        if (questionnaireAnswer?.answer) {
            setAnswers(questionnaireAnswer.answer);
        } else {
            setAnswers([]);
        }
    }, [questionnaireAnswer, currentQuestion])

    const { mutate: upsertQuestionnaireAnswerMutate, isPending: upsertPending } = useMutation({
        mutationFn: async (data: IUpsertQuestionnaireAnswer) => await upsertQuestionnaireAnswer(data),
        onSuccess: () => {
            handleNavigateLesson()
        },
        onError: (error) => {
            toast(
                <div className='flex items-center gap-2'>
                    <X size={20} className='text-red-500' />
                    <p className='text-[14px] text-primary'>{error.message}</p>
                </div>,
            );
        }
    });

    useEffect(() => {
        if (selectedLessonItem) {
            setCurrentQuestion(sortedQuestions[0]);
        }
    }, [selectedLessonItem])

    const [direction, setDirection] = useState('right')
    
    const handlePreviousQuestion = () => {
        if (!currentQuestion) return;

        setMoveTo('PREV');
        
        upsertQuestionnaireAnswerMutate({
            answer: answers,
            questionId: currentQuestion.id,
            lessonId: selectedLesson?.id,
            lessonItemId: selectedLessonItem?.id,
        });
    }

    const handleNextQuestion = () => {
        if (!currentQuestion) {
            onPressNextLesson();
            return;
        }

        if (answers.length <= 0 && currentQuestion.requiredToAnswer) {
            toast({
                description: (
                    <div className='flex items-center gap-2'>
                        <X size={20} className='text-red-500' />
                        <p className='text-[14px] text-primary'>
                            This question is required to answer.
                        </p>
                    </div>
                ),
            });
            return;
        }
        
        setMoveTo('NEXT');

        upsertQuestionnaireAnswerMutate({
            answer: answers,
            questionId: currentQuestion.id,
            lessonId: selectedLesson?.id,
            lessonItemId: selectedLessonItem?.id,
        });
    }

    const handleMultipleChoiceChange = (answer: string) => {
        setAnswers((prev) => {
            if (prev.includes(answer)) {
                return prev.filter(item => item !== answer)
            }
            return [...prev, answer]
        });
    }

    const handleNavigateLesson = () => {
        if (!currentQuestion) return;

        if (moveTo === 'PREV') {
            if (currentQuestion.ordinalNumber <= 1) {
                return;
            }
            const foundQuestion = sortedQuestions.find(
                item => item.ordinalNumber === (currentQuestion.ordinalNumber - 1)
            );
            if (foundQuestion) setCurrentQuestion(foundQuestion);
            return;
        }

        if (moveTo === 'NEXT') {
            if (currentQuestion.ordinalNumber >= sortedQuestions.length) {
                onPressNextLesson();
                return;
            }
            const foundQuestion = sortedQuestions.find(
                item => item.ordinalNumber === (currentQuestion.ordinalNumber + 1)
            );
            if (foundQuestion) setCurrentQuestion(foundQuestion);
        }
    }

    const isLastQuestion = (currentQuestion?.ordinalNumber ?? 0) >= sortedQuestions.length

    return (
        <div className="pt-[38px]  w-full animate-fadeInUp  px-24">
            <div className={`flex  ${isFirstLessonItem?'justify-end':'justify-between'}`}>
                {upsertPending || (Number(currentQuestion?.ordinalNumber ?? 0) <= 1)
                ?
                <Button
                    onClick={onPressPreviousLesson}
                    className={` ${isFirstLessonItem?"hidden":"flex"} bg-white hover:bg-secondary w-[159px] h-[35px] border border-[#C4D4C1] font-bold text-[12px] text-[#292521] rounded-[5px] items-center justify-center`}
                >
                    Previous Lesson
                </Button>
                :
                <Button
                    onClick={handlePreviousQuestion}
                    className="bg-white hover:bg-secondary w-[159px] h-[35px] border border-[#C4D4C1] font-bold text-[12px] text-[#292521] rounded-[5px] items-center flex justify-center"
                >
                    Previous Question
                </Button>}
             
                {(isLastLessonItem && isCompleted && isLastQuestion) ? (
                    <div className='flex items-center gap-1 text-green-500'>
                        <Trophy size={18}/>
                        <span>Course Completed</span>
                    </div>
                ) : (
                    <Button
                        onClick={handleNextQuestion}
                        className={`bg-white hover:bg-secondary w-[159px] h-[35px] border border-[#C4D4C1] font-bold text-[12px] text-[#292521] rounded-[5px] items-center flex justify-center`}
                        disabled={upsertPending}
                    >
                        {isLastLessonItem && isLastQuestion ? 'Finish' : isLastQuestion ? 'Next Lesson' : 'Next Question'}
                    </Button>
                )}
            </div>
            <div className="flex space-x-[6px] pt-[37px] pb-[43px] items-center opacity-0 animate-fadeInRight">
                {sortedQuestions.length > 0 && sortedQuestions.map(
                    (item) => currentQuestion?.ordinalNumber === item.ordinalNumber ? (
                        <div
                            className={` bg-white w-[14px] h-[14px] rounded-full border border-[#A77DE0] flex items-center justify-center`}
                        >
                            <div
                                className={` bg-[#A77DE0] w-[10px] h-[10px] rounded-full `}
                            />
                        </div>
                    ) : (
                        <div
                            className={`${currentQuestion && currentQuestion.ordinalNumber > item.ordinalNumber
                                ? 'bg-[#A77DE0]'
                                : 'bg-[#D9D9D9]'
                                } w-[10px] h-[10px] rounded-full `}
                        />
                    )
                )}
            </div>

            {currentQuestion?.type === 'SINGLE_CHOICE' && (
                <div>
                     <div className=' flex  items-center gap-4'> 
                        <div
                            className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                                } opacity-0 w-[96px] h-[25px] flex items-center justify-center rounded-[5px] border border-[#DFD7E9] text-[10px]`}
                        >
                            Single Choice
                        </div>
                        <div
                            className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft' 
                                } opacity-0 w-[106px] h-[25px] flex items-center justify-center rounded-[5px] border border-[#DFD7E9] text-[10px] ${currentQuestion?.requiredToAnswer?"":"hidden"} `}
                        >
                            Required to answer
                        </div>
                    </div> 
                    <div
                        className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                            } opacity-0 pt-[14px] pb-[42px] text-[24px] text-[#292521]`}
                    >
                        {currentQuestion?.question}
                    </div>
                    <div className="border-t-2 border-[#DFD7E9] w-full pt-[26px] space-y-[15px] ">
                        <RadioGroup className="flex flex-col justify-center">
                            {currentQuestion?.choices.map(
                                (item: any, index: number) => (
                                    <AnimatedDiv animation='Bubble' delay={0} scale={1.02}>
                                        <div
                                            key={index}
                                            className={`${
                                                answers?.includes(item)
                                                ? 'bg-[#C1F9B8]'
                                                : 'bg-[#F5F4F8]'
                                                } h-auto rounded-[50px] py-4 flex items-center px-[13px] space-x-[8px] hover:cursor-pointer opacity-0 animate-fadeInUp`}
                                            style={{
                                                animationDelay: `${index * 0.2}s`,
                                            }}
                                            onClick={() => setAnswers([item])}
                                        >
                                            <RadioGroupItem
                                                value={item}
                                                className=""
                                                checked={answers.includes(item)}
                                            />
                                            <div className="text-[16px] text-[#292521] flex-1 line-clamp-1">
                                                {item}
                                            </div>
                                        </div>
                                    </AnimatedDiv>
                                )
                            )}
                        </RadioGroup>
                    </div>
                </div>
            )}

            {currentQuestion?.type === 'MULTIPLE_CHOICE' && (
                <div>
                    <div className=' flex  items-center gap-4'> 
                        <div
                            className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                                } opacity-0 w-[96px] h-[25px] flex items-center justify-center rounded-[5px] border border-[#DFD7E9] text-[10px]`}
                        >
                            Multiple Choice
                        
                        </div>
                        <div
                            className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft' 
                                } opacity-0 w-[106px] h-[25px] flex items-center justify-center rounded-[5px] border border-[#DFD7E9] text-[10px] ${currentQuestion?.requiredToAnswer?"":"hidden"} `}
                        >
                            Required to answer
                        </div>
                    </div> 
                    <div
                        className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                            } opacity-0 pt-[14px] pb-[42px] text-[24px] text-[#292521]`}
                    >
                        {currentQuestion?.question}
                    </div>
                    <div className="border-t-2 border-[#DFD7E9] w-full pt-[26px] space-y-[15px]">
                        {currentQuestion?.choices.map(
                            (item: any, index: number) => (
                                <AnimatedDiv animation='Bubble' scale={1.01}>
                                    <div
                                        key={index}
                                        className={`${
                                            answers.includes(item)
                                            ? 'bg-[#C1F9B8]'
                                            : 'bg-[#F5F4F8]'
                                            } h-[43px] rounded-[5px] w-full flex items-center px-[21px] space-x-[23px] hover:cursor-pointer opacity-0 animate-fadeInUp`}
                                        style={{
                                            animationDelay: `${index * 0.2}s`,
                                        }}
                                        onClick={() => handleMultipleChoiceChange(item)}
                                    >
                                        <Checkbox
                                            value={item}
                                            className="border-[#EAE7F2] bg-white"
                                            checked={answers.includes(item)}
                                        />
                                        <div className="text-[14px] text-[#292521]/70">
                                            {item}
                                        </div>
                                    </div>
                                </AnimatedDiv>
                            )
                        )}
                    </div>
                </div>
            )}

            {currentQuestion?.type === 'ESSAY' && (
                <div>
                    <div
                        className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                            } opacity-0 w-[67px] h-[25px] flex items-center justify-center rounded-[5px] border border-[#DFD7E9] text-[10px]`}
                    >
                        Essay
                    </div>
                    <div
                        className={`animate-${direction === 'right' ? 'fadeInRight' : 'fadeInLeft'
                            } opacity-0 pt-[14px] pb-[42px] text-[24px] text-[#292521]`}
                    >
                        {currentQuestion?.question}
                    </div>
                    <div className="border-t-2 border-[#DFD7E9] w-full pt-[26px] space-y-[15px] opacity-0 animate-fadeInUp">
                        <Textarea
                            className="w-full h-[55px] px-[30px] border-[#E7E5EE] placeholder:text-[#292521]/60 text-[#292521]/60 text-[14px]"
                            placeholder="Your answer goes here"
                            style={{ boxShadow: 'none' }}
                            maxLength={500}
                            value={answers[0] ?? ''}
                            onChange={(e) => setAnswers([e.target.value])}
                        />
                        <div className="text-[#292521]/60 text-[12px] px-2">
                            {answers[0]?.length ?? 0}
                            /500
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

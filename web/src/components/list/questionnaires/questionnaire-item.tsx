import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@radix-ui/react-label'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

export const QuestionnaireItem = ({
    questionnaireIndex,
    questionnaire,
}: any) => {
    const { question, type, choices } = questionnaire

    return (
        <div className="flex flex-col space-y-2">
            <p className="text-base font-bold">{`${questionnaireIndex}. ${question}`}</p>
            {type === 'single-choice' && (
                <RadioGroup
                    defaultValue="video"
                    className="flex flex-row flex-wrap"
                >
                    {choices.map((item: any, index: number) => (
                        <div className="flex items-center space-x-1 px-3">
                            <RadioGroupItem
                                value={item}
                                id={`${questionnaireIndex}-radio-${item}-${index}`}
                            />
                            <Label
                                htmlFor={`${questionnaireIndex}-radio-${item}-${index}`}
                                className="hover:cursor-pointer"
                            >
                                {item}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            )}

            {type === 'multiple-choice' && (
                <div className="flex flex-row flex-wrap">
                    {choices.map((item: any, index: number) => (
                        <div className="flex items-center space-x-1 px-3">
                            <Checkbox
                                id={`${questionnaireIndex}-checkbox-${item}-${index}`}
                            />
                            <Label
                                htmlFor={`${questionnaireIndex}-checkbox-${item}-${index}`}
                                className="hover:cursor-pointer"
                            >
                                {item}
                            </Label>
                        </div>
                    ))}
                </div>
            )}
            {type === 'essay' && (
                <div className="flex flex-row flex-wrap">
                    <Input
                        type="text"
                        className="h-8"
                        placeholder="Please enter your answer"
                        maxLength={500}
                    />
                </div>
            )}
        </div>
    )
}

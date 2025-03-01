import { Separator } from "@/components/ui/separator";
import { ICourseStudentQuizResult } from "@/interfaces/course.interface";
import { Check, X } from "lucide-react";

interface Props {
  data: ICourseStudentQuizResult;
}
export default function StudentExamDetails({ data }: Props) {
  return (
    <>
        <div className="w-full max-w-[1057px] flex flex-col md:flex-row justify-between mx-auto mt-[22px] px-[19px] mb-[13px]">
          <div className="mb-4 md:mb-0">
            <h3 className="text-[#444444] text-[14px] font-[600]">{data?.course?.title}</h3>
            <p className="text-[#777777] text-[14px] font-[400]">{data?.course?.overview}</p>
          </div>
        </div>
        <Separator />
        {data?.course?.CourseLesson && data?.course?.CourseLesson.length > 0 
             && data?.course?.CourseLesson.map((lesson: any) => 
        <>
            {lesson?.CourseLessonItem && lesson?.CourseLessonItem.length > 0 && lesson?.CourseLessonItem.map((lessonItem: any) => {
                let correctAnswersCount = 0;

                return (
                    <div className="w-full max-w-[1057px] flex flex-col mx-auto px-[19px] py-[17px]">
                        <div className="w-full max-w-[300px] mb-4 md:mb-0">
                            <h3 className="text-[#444444] text-[14px] font-[600]">{lessonItem?.title}</h3>
                            <p className="text-[#777777] text-[12px] font-[400]"></p>
                        </div>
                        <div className="flex flex-col w-full">
                        {lessonItem?.CourseLessonQuestionnaireItem && lessonItem?.CourseLessonQuestionnaireItem.length > 0 
                            && lessonItem?.CourseLessonQuestionnaireItem.map((question: any, index: number) =>
                                <div className="w-full max-w-[377px]">
                                    <div className="text-[12px] text-[#777777] mt-[12px] ml-1">{(index + 1) + ". " + question?.question}</div>
                                    <div className="flex flex-col lg:flex-row gap-1 w-full">
                                        {question?.choices && question?.choices.length > 0 
                                            && question?.choices.map((choice: any) =>
                                                <div className="text-[12px] text-[#777777] ml-10">{choice}</div>
                                            )}
                                    </div>
                                    
                                    {question?.CourseLessonQuestionnaireAnswer && question?.CourseLessonQuestionnaireAnswer.length > 0 
                                        && question?.CourseLessonQuestionnaireAnswer.map((answer: any) => {
                                            
                                            if (answer?.status === "CORRECT") {
                                                correctAnswersCount += 1;
                                            }

                                            return (
                                                <div className="text-[12px] text-[#777777] mt-3 ml-5 flex flex-row items-center">
                                                    {answer?.status === "CORRECT" && <Check size={14} color={"green"} />}
                                                    {answer?.status === "INCORRECT" && <X size={14} color={"red"} />} 
                                                    <span className="ml-2">Answered:</span>
                                                    <div className="text-[12px] text-[#777777]">
                                                        {answer?.answer && answer?.answer.length > 0 && 
                                                            answer.answer.map((hisAnswer: any) => (
                                                            <span className="ml-2 font-semibold italic text-[11px]">{hisAnswer + ", "}</span>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>    
                        <div className="text-[#444444] text-[11px] mt-4">
                            Total Correct Answers for this Quiz: <span className="font-semibold">{correctAnswersCount}</span>
                        </div>
                    </div>    
                );
            })}
            <Separator />
        </>
    )}
      </>
  )
}
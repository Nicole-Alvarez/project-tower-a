import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuizResultDataTable } from '@/components/tables/course-quiz-results-data'
import { quizResultColumns } from '@/components/tables/course-quiz-results-columns'
import { ICourse, ICourseQuizResult } from '@/interfaces/course.interface'
import { getCourseQuizResults } from '../../../../api/query/courses'

interface Props {
  courses: ICourse[]
}
export default function CourseQuizResults({courses}: Props) {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
    const [filteredQuizResults, setFilteredQuizResults] = useState<ICourseQuizResult[]>([]);

    const { data: courseQuizResults, isLoading: loadingCourseQuizResults } = useQuery({
      queryKey: ['course-quiz-results', selectedCourse],
      queryFn: async () => {
        if (!selectedCourse) return;
        return await getCourseQuizResults(selectedCourse);
      },
      enabled: !!selectedCourse,
    });

    useEffect(() => {
      if (courses && courses.length > 0) {
        setSelectedCourse(courses[0].id ?? null)
      }
    }, [courses])

    useEffect(() => {
      if (courseQuizResults?.length) {
        setSelectedQuiz(courseQuizResults[0]?.courseLessonItem.id ?? null);
      }
    }, [courseQuizResults]);

    useEffect(() => {
      if (selectedQuiz) {
        const filtered = courseQuizResults?.filter(
          item => item.courseLessonItem.id === selectedQuiz
        );
        setFilteredQuizResults(filtered ?? []);
      }
    }, [selectedQuiz, courseQuizResults]);

    const uniqueQuizItems = Array.from(
      new Map(
        courseQuizResults?.map(item => [item.courseLessonItem.id, item.courseLessonItem])
      ).values()
    );

  return (
    <div className="mt-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
        <h1 className="text-[16px] text-[#292521] font-DM font-[700]">
          Quiz Results
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Select
            value={String(selectedCourse)}
            onValueChange={(value) => setSelectedCourse(Number(value))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course, index) => (
                <SelectItem key={index} value={String(course.id)}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select 
            value={String(selectedQuiz)}
            onValueChange={(value) => setSelectedQuiz(Number(value))}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select quiz" />
            </SelectTrigger>
            <SelectContent>
              {(!uniqueQuizItems || uniqueQuizItems.length <= 0) ? (
                <div className='p-2 text-[14px] text-muted-foreground '>
                  No quizzes yet.
                </div>
              ) : (
                <>
                  {uniqueQuizItems.map((quiz, index) => (
                    <SelectItem key={index} value={String(quiz.id)}>
                      {quiz.title}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <QuizResultDataTable 
        columns={quizResultColumns} 
        data={filteredQuizResults}
        loading={loadingCourseQuizResults}
      />
  </div>
  )
}

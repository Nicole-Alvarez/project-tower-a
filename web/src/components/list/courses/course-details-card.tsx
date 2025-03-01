import { CourseDetailsLoader } from '@/components/common/loaders'
import { CourseDetailsHeader } from './course-details-header'
import { CourseDetailsLessons } from './course-details-lessons'
import { CourseDetailsLessonsV2 } from './course-details-lessons-v2'

export const CourseDetailsCard = ({ courseData }: any) => {
    return (
        <div>
            {courseData?.isPending ? (
                <CourseDetailsLoader />
            ) : (
                <div className="w-full h-full px-10 py-5 space-y-4">
                    <CourseDetailsHeader courseData={courseData} />
                    <CourseDetailsLessonsV2 courseData={courseData} />
                </div>
            )}
        </div>
    )
}

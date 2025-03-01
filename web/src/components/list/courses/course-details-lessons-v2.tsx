import { useRouter } from 'next/router'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { FaCheckCircle } from 'react-icons/fa'
import { MdCloudDownload, MdVideoLibrary } from 'react-icons/md'
import CourseDetailsOverview from '@/components/list/courses/course-details-overview'

export const CourseDetailsLessonsV2 = ({ courseData }: any) => {
    return (
        <div className="w-full h-full bg-white rounded-[20px] border py-12 px-16 space-y-5">
            <CourseDetailsOverview courseData={courseData} />
        </div>
    )
}

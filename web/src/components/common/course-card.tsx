import AnimatedDiv from "@/components/animated/div"
import { Button } from "@/components/ui/button"
import { CourseCardType, ICourseCardProps } from "@/interfaces/course.interface"
import Image from "next/image"
import StarRating from "./star-rating"
import { useRouter } from "next/router"
import { Label } from "../ui/label"


const CommonCourseCard = ({ course, type, handleClick ,progress}: ICourseCardProps) => {

    
    const renderCallToActionButton = () => {
        let callToActionLabel
        let style = ''

        switch (type) {
            case CourseCardType.PUBLIC:
                callToActionLabel = 'Get Access';
                break;
            case CourseCardType.UNENROLLED:
                callToActionLabel = 'Enrol Now'
                style = 'bg-[#37E31C]'
                break;
            case CourseCardType.ENROLLED:
                callToActionLabel = progress === "100%"?`${progress}`:`${progress} in progress`
        }
        return (
            <Button className={`bottom-2 right-2 w-[120px] text-xs  font-light h-[29px] rounded-[18px] ${progress === "100%"?"bg-[#34DF64]":"bg-[#7435D9]"}  z-50 absolute ${style}`}
                onClick={handleClick}
            >{callToActionLabel}</Button>
        )
    }

    return (
        <AnimatedDiv
            animation="Bubble" className="w-full lg:w-[260px] md:w-[260px]">
            <div
                className={` 
                     mr-4 mb-4 rounded-[20px] border-white bg-white drop-shadow-md opacity-0 animate-fadeInUp group flex flex-col justify-between cursor-pointer`}
                onClick={() => { }}
            >

                <div className="h-[159px] w-full relative overflow-hidden">
                    <Label></Label>
                    <Image
                        src={course?.image || '/polygon-group-2.png'}
                        alt={course?.title || 'Course Image'}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-[20px] "
                        style={{
                            background: 'linear-gradient(90deg, #6E22DD 0%, #C81CE3 100%)'
                        }}
                    />
                    {renderCallToActionButton()}
                </div>
                <div className="h-1/2 w-full rounded-b-[20px] flex flex-col px-6 py-2">

                    <div className="flex flex-row justify-between">
                        <p className="font-DM text-[12px] text-[#29252170]">
                            {course?.category?.name ?? ""}
                        </p>
                        <p className="font-DM text-[12px] text-[#29252170]">
                            {course?.CourseLesson && course.CourseLesson.length > 0
                                ? `${course.CourseLesson.length} ${course.CourseLesson.length !== 1 ? 'Lessons' : 'Lesson'}`
                                : 'No lessons'}
                        </p>
                    </div>

                    <p className="font-DM font-bold text-[16px] text-black overflow-hidden"
                        style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2, 
                            height: '50px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>{course?.title}
                    </p>

                    <p className="font-DM text-[12px] text-[#29252170]">
                        {course?.EnrolledCourse && course.EnrolledCourse.length > 0
                            ? `${course.EnrolledCourse.length} ${course.EnrolledCourse.length !== 1 ? 'Students' : 'Student'}`
                            : 'No students yet'}
                    </p>

                    <div className="flex flex-row space-x-2 py-1 mt-2">
                        <StarRating rating={course?.averageRating || 0} />
                        <p className="font-DM text-[12px] text-[#29252170]">
                            {course?.Reviews && course.Reviews.length > 0
                                ? `${course.Reviews.length} ${course.Reviews.length !== 1 ? 'Reviews' : 'Review'}`
                                : 'No reviews yet'}
                        </p>
                    </div>
                </div>
                
                <div className={` px-6 py-2 ${progress?"":"hidden"}`}>
                <div className={`mb-2 my-2 w-full justify-center rounded-full border-spacing-x-1 shadow-sm drop-shadow-sm flex 
                    ${progress === "100%" ? "hover:bg-green-50" : "hover:bg-orange-50"}`} onClick={handleClick}>
                    <Label className={`cursor-pointer ${progress === "100%" ? "hover:bg-green-50 text-[#25c652]" : "hover:bg-orange-50 text-[#7435D9]"} p-2 rounded-md text-xs font-semibold`}>
                        {progress === "100%" ? "Completed" : "Resume Lesson"}
                    </Label>
                    </div>
                </div>

            </div>

        </AnimatedDiv>
    )

}

export default CommonCourseCard

import React from 'react'
import { useRouter } from 'next/router'
import { CourseLogoHexagon } from '../../common/course-logo-hexagon'
import { ICourse } from '@/interfaces/course.interface'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
    course: ICourse;
}

export const CourseCardOverview = ({ course }: Props) => {
    return (
        <Link href={`./courses/${course.id}`} className='pr-4 pb-5'>
            <div className="h-[300px] w-[291px] border border-[#28104E]/10 rounded-xl pb-4 hover:cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-105 hover:shadow-sm">
                <div className="relative w-full h-[107px] rounded-t-xl shadow">
                    {course?.image ?
                        <Image
                            src={course?.image}
                            alt={course.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-2xl" /> :
                        <div
                            className='w-full h-full rounded-t-2xl'
                            style={{
                                backgroundImage: `url(${course?.image}), url('/default_banner.png'), linear-gradient(90deg, #6E22DD 0%, #C81CE3 100%)`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                backgroundRepeat: 'no-repeat',
                            }}
                        />
                    }
                </div>
                <div className="flex flex-row h-[39px] justify-center space-x-7 pt-1">
                    <CourseLogoHexagon image={course.image} />
                    <p className="text-[10px] text-[#292521]/50 pl-5 mt-[1px]">
                        {course.EnrolledCourse.length} student
                        {course.EnrolledCourse.length > 1 && 's'}
                    </p>
                    <p className="text-[10px] text-[#292521]/50 mt-[1px]">{course?.hrsDuration} hrs</p>
                </div>
                <div className="px-8 flex flex-col space-y-1 h-[100px] mt-1">
                    <p className="text-[12px] text-[#292521] font-bold">
                        {course.title}
                    </p>
                    <p className="text-[10px] text-[#29252160]/60 overflow-hidden text-ellipsis -webkit-box -webkit-line-clamp-3 -webkit-box-orient-vertical">
                        {course?.overview ? course.overview : 'No description.'}
                    </p>
                </div>
                <div className="px-8 mt-2">
                    <div className="rounded-[10px] bg-[#D9D9D9] w-full h-[27px] p-1 px-5 flex flex-row space-x-3 items-center">
                        <p className="text-[10px] text-[#292521]">
                            {course.CourseLesson.length} Lesson
                            {course.CourseLesson.length > 1 && 's'}
                        </p>
                        
                        <p className="text-[10px] text-[#292521]">1 Certificate</p>
        
                    </div>
                </div>

            </div>
        </Link>
    )
}

import React from 'react'
import DashboardLayout from '@/components/sections/dashboard-layout'
import AdminTopBar from '@/components/sections/admin-top-bar'
import AnimatedDiv from '@/components/animated/div'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../../../../api/query/users'
import { useRouter } from 'next/router'
import { getStudentAnswersPerCourse } from '../../../../api/query/courses'
import StudentExamDetails from '@/components/sections/student-exam-details'
import CommonBreadcrumb from '@/components/common/breadcrumb'

interface Props {
    fromTab: string;
}

const StudentExam = ({ fromTab }: Props) => {
    const router = useRouter();
    const { studentId, courseId } = router.query;

    const { data: profile, isLoading } = useQuery({
        queryKey: ['student-profile-by-id', studentId],
        queryFn: async () => {
            return await getUserById(Number(studentId));
        },
        enabled: !!router.query.studentId && !!router.query.courseId
    });

    const { data: answers, isLoading: isLoadingAnswers } = useQuery({
        queryKey: ['student-answers-per-course', studentId, courseId],
        queryFn: async () => {
            return await getStudentAnswersPerCourse(Number(studentId), Number(courseId));
        },
        enabled: !!router.query.studentId && !!router.query.courseId
    });

    return (
        <DashboardLayout>
            <AdminTopBar
                LeftSideComponent={
                    <CommonBreadcrumb 
                        data={[
                            {type: 'link', link: '/teacher', label: 'LMS'},
                            {type: 'link', link: fromTab === 'Students' ? '/teacher/students' : '/teacher/quizzes', label: fromTab},
                            {type: 'page', loading: isLoading, label: 'Quiz details'}
                        ]}
                    />
                }
            />
            <div className="w-full font-DM flex px-8">
                {profile && (
                <AnimatedDiv animation="EaseInLeft" delay={0.3} className="relative w-full">
                    <div
                    className="h-[81px] w-full"
                    style={{
                        background: 'radial-gradient(50.47% 547.61% at 49.53% 50.62%, #BAE0C5 0%, #C6E7CF 100%)'
                    }}
                    />
                    <div className="relative w-full max-w-[1057px] mx-auto px-[19px]">
                    <Image
                        src={profile?.profilePicture ? profile.profilePicture : '/polygon-group-2.png'}
                        height={124}
                        width={124}
                        className="absolute top-[-40px] h-[124px] w-[124px] rounded-full bg-secondary border border-white object-cover shadow"
                        alt='company logo'
                        unoptimized
                    />
                    <div className="py-[10px] ml-[143px]">
                        <h1 className="text-[24px] text-[#444444] font-[700]">
                        {profile?.name}
                        </h1>
                        <p className="text-[#777777] text-[14px] font-[400]">
                        {`${profile?.email}`}
                        </p>
                    </div>
                    </div>
                    {answers && <StudentExamDetails data={answers[0]} />}
                </AnimatedDiv>
                )}

            </div>
        </DashboardLayout>
    )
}

export default StudentExam

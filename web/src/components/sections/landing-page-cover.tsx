import { useRouter } from 'next/router'
import AnimatedDiv from '../animated/div'
import { pencils } from '@/utils/constants'

export const LandingPageCover = () => {
    const router: any = useRouter()
    return (
        <div
            className="w-full h-[430px]  flex flex-row items-start justify-center p-8 space-x-8 relative"

        >
            <div className="bg-white w-[664px] h-[240px] rounded-[5px] flex flex-col items-start justify-center p-12 opacity-0 animate-fadeInLeft">
                <div className="font-baloo font-extrabold text-[34px] w-[491px]">
                    Transform Your Career with Online Learning
                </div>
                <div className="text-[14px]">
                    Gain the knowledge and skills you need to succeed with our
                    diverse selection of courses. Join a community of learners
                    and start your journey to professional growth today.
                </div>
            </div>
            <div className="flex flex-col justify-end h-[240px] space-y-4 opacity-0 animate-fadeInRight z-10">
                <div className="font-baloo font-bold text-[24px]  ">
                    Join Us!
                </div>
                <div
                    className="font-bold text-[24px] w-[344px] h-[64px] bg-[#444040] text-white flex justify-center items-center rounded-[5px]  hover:cursor-pointer transform transition duration-300 hover:scale-110"
                    style={{ animationDelay: '0.1s' }}
                    onClick={() => router.push('/auth/studentsignup')}
                >
                    I AM A STUDENT
                </div>
                <div
                    className="font-bold text-[24px] w-[344px] h-[64px] bg-white text-[#444040] border border-[#444040] flex justify-center items-center rounded-[5px]  hover:cursor-pointer transform transition duration-300 hover:scale-110"
                    style={{ animationDelay: '0.4s' }}
                    onClick={() => router.push('/auth/teachersignup')}
                >
                    I AM A TEACHER
                </div>
            </div>
            <AnimatedDiv className={`flex flex-row gap-x-2 absolute top-[420px] sm:top-[200px]`}
                animation='SlideUp' delay={1.5}
            >
                {pencils.map((pencil, index) => (
                    <AnimatedDiv
                        key={index}
                        animation="HoverSlideUp"
                        className={`${pencil.marginTop} flex`}
                    >
                        <img src={pencil.src} />
                    </AnimatedDiv>
                ))}
            </AnimatedDiv>
        </div>
    )
}

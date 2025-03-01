import Lottie from "lottie-react";
import authLoader from "../../../public/lms-loader.json";
import courseLoader from "../../../public/course-loader.json";
import AnimatedDiv from "./div"


interface LoaderProps {
  isLoading: boolean
  type: 'auth' | 'courses'
  label?: string
}

const Loader = ({ isLoading, type, label }: LoaderProps) => {

  if (!isLoading) {
    return null
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center text-[#70309F] font-medium text-[50px] sm:text-[78px]
    ${type === 'courses' ? 'bg-[#0000007e]' : 'bg-[#0000002e]'}`}>
      <AnimatedDiv
        delay={0}
        animation='ZoomIn'
        className="flex flex-col items-center"
      >
        <Lottie animationData={type === 'auth' ? authLoader : courseLoader} loop={true} />
        <p className="text-white font-semibold text-[32px]">{label}</p>
      </AnimatedDiv>
    </div>

  )
}

export default Loader

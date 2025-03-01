import Image from "next/image"

export const CourseLogoHexagon = ({ image = null }: any) => {
    return (
        <div className="flex justify-center items-center content-center" style={{
            content: "",
            position: "absolute",
            top: 60,
            left: 20,
            width: "95px",
            height: "87px",
            clipPath: 'polygon(10% 25%, 50% 0, 90% 25%, 90% 75%, 50% 100%, 10% 75%)',
            backgroundColor: image ? "white" : "#7435D9",
            padding: "2px",
        }}>
            <div
                className="relative h-[95%] w-[95%] bg-white"
                style={{
                    clipPath: 'polygon(10% 25%, 50% 0, 90% 25%, 90% 75%, 50% 100%, 10% 75%)',
                    backgroundColor: "white",
                }}
            >
                <Image
                    src={image || '/default_logo.png'}
                    alt="Course Logo"
                    fill
                    objectFit="cover"
                    style={{
                        clipPath: 'polygon(10% 25%, 50% 0, 90% 25%, 90% 75%, 50% 100%, 10% 75%)',
                    }}
                />
            </div>
        </div>
    )
}

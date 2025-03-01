export const Footer2 = () => {
    return (
        <div className="w-full bg-[#8B4EE4] h-[94px] flex justify-center items-center mt-14 pt-12 pb-6">
            <div className="hidden lg:w-1/4 lg:flex ml-20">
                <img src="/lms-logo.png" className="w-[50px] h-[24px] " />
            </div>

            <div className="font-bold text-[16px] text-white w-full lg:w-2/4 flex flex-col items-center justify-between">
                <div>
                    Copyright © 2024 Genii Hut Technologies Corp.. All Rights
                    Reserved.
                </div>
            </div>
            <div className="hidden lg:w-1/4 lg:flex"></div>
        </div>
    )
}

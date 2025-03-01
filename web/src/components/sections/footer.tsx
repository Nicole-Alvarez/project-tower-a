export const Footer = () => {
    return (
        <div className="w-full h-auto sm:h-[304px] bg-[#8B4EE4] flex flex-col sm:flex-row justify-center items-center mt-6 pt-8 sm:pt-12 pb-6">
            <div className="w-full sm:w-1/4 h-auto sm:h-full flex justify-center sm:justify-end mb-4 sm:mb-0">
                <img src="/footer-logo.png" className="w-[200px] sm:w-[282px] h-[36px] sm:h-[51px]" />
            </div>

            <div className="font-bold text-[14px] sm:text-[16px] text-white w-full sm:w-2/4 h-auto sm:h-full flex flex-col items-center justify-between">
                <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-14">
                    <div className="flex flex-col space-y-2 sm:space-y-3 text-center sm:text-left">
                        <div className="font-bold text-[20px] sm:text-[24px] pb-2">
                            Company
                        </div>
                        <div className="font-light text-[12px]">
                            Terms and Conditions
                        </div>
                        <div className="font-light text-[12px]">
                            Privacy Policy
                        </div>
                        <div className="font-light text-[12px]">
                            Meridian 1402b, Kasambagan Cebu City, Philippines
                        </div>
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-3 text-center sm:text-left">
                        <div className="font-bold text-[20px] sm:text-[24px] pb-2">
                            Contact
                        </div>
                        <div className="font-light text-[12px]">
                            sales@dxform.ph
                        </div>
                        <div className="font-light text-[12px]">
                            032 345 6789
                        </div>
                        <div className="font-light text-[12px]">
                            Sign in as student
                        </div>
                        <div className="font-light text-[12px]">
                            Sign in as teacher
                        </div>
                    </div>
                </div>
                <div className="pt-6 sm:pt-0 text-center">
                    Copyright © 2024 Genii Hut Technologies Corp.. All Rights Reserved.
                </div>
            </div>
            <div className="w-full sm:w-1/4 h-auto sm:h-full"></div>
        </div>
    )
}

import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

export const GetInTouchCard = () => {
    return (
        <div className="w-full h-auto sm:h-[371px] rounded-[15px] bg-white flex flex-col sm:flex-row p-6 sm:p-12 space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="w-full sm:w-1/3 flex flex-col h-auto sm:h-full">
                <div className="font-extrabold font-baloo text-[28px] sm:text-[34px] text-[#7435D9]">
                    Let’s get in touch!
                </div>
                <div className="font-light text-[14px] sm:text-[16px] text-[#292521] pb-2">
                    Or just reach out manually to sales@dxform.ph
                </div>
                <img src="/header-logo.png" className="h-[74px] sm:h-[51px] w-full sm:w-[282px]" />
            </div>
            <div className="w-full sm:w-2/3 h-auto sm:h-full space-y-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Input
                        placeholder="First name"
                        className="w-full bg-none border-[#EEDDEE] text-[#292521]/60 text-[14px] sm:text-[16px] font-bold px-6 sm:px-8 h-[50px] sm:h-[55px]"
                        style={{
                            boxShadow: 'none',
                        }}
                    />
                    <Input
                        placeholder="Last name"
                        className="w-full bg-none border-[#EEDDEE] text-[#292521]/60 text-[14px] sm:text-[16px] font-bold px-6 sm:px-8 h-[50px] sm:h-[55px]"
                        style={{
                            boxShadow: 'none',
                        }}
                    />
                </div>
                <Input
                    placeholder="Your email"
                    className="w-full bg-none border-[#EEDDEE] text-[#292521]/60 text-[14px] sm:text-[16px] font-bold px-6 sm:px-8 h-[50px] sm:h-[55px]"
                    style={{
                        boxShadow: 'none',
                    }}
                />
                <Textarea
                    placeholder="Main message here"
                    className="w-full bg-none border-[#EEDDEE] text-[#292521]/60 text-[14px] sm:text-[16px] font-bold px-6 sm:px-8 h-[120px] sm:h-[139px]"
                    style={{
                        boxShadow: 'none',
                    }}
                />
            </div>
        </div>
    )
}

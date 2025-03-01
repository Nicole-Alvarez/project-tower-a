import { DashboardCardProps } from '@/interfaces/admin-dashboard.interface'
import CountUp from 'react-countup'
import { LoaderCircle } from 'lucide-react'

const DashboardCard = ({
    title,
    titleValue,
    withRateValue,
    rateValue,
    loading,
}: DashboardCardProps) => {
    const shouldShowPercentage =
        title === 'Correct' || title === 'Incorrect' || title === 'Unchecked'
    const formatter = (value: number) => {
        return value.toLocaleString()
    }
    return (
        <div className="w-full max-w-[150px] sm:max-w-[250px] h-[180px] sm:h-[145px] rounded-[15px] bg-gray-100 p-5">
            <div className="font-bold text-[14px] sm:text-[16px] text-[#292521]">
                {title}
            </div>
            <div className="font-bold text-[32px] text-[#292521] mt-2">
                {loading ? (
                    <LoaderCircle className="mt-3 h-[32px] w-[32px] animate-spin" />
                ) : (
                    <CountUp end={titleValue} formattingFn={formatter} />
                )}
                {title === 'Passing rate' && '%'}
                {shouldShowPercentage && '%'}
            </div>
            {withRateValue && (
                <div className="font-normal text-[10px] text-[#292521]/50 mt-4">
                    {rateValue ? Number(rateValue).toFixed(2) : 0}% increase last 15 days
                </div>
            )}
        </div>
    )
}

export default DashboardCard

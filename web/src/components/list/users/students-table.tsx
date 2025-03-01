import { BiSearchAlt } from 'react-icons/bi'
import { Input } from '../../ui/input'
import { useRef, useState } from 'react'
import { UserPaginationUi } from '../../common/user-table-pagination'
import React from 'react'
import dayjs from 'dayjs'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { IUser } from '@/interfaces/user.interface'
import { Eye, LoaderCircle, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ICourse, IEnrolledStudent } from '@/interfaces/course.interface'
import { useRouter } from 'next/router'

interface Props {
    userColumns: any
    users: IEnrolledStudent[]
    setSearch?: any
    totalPages: number
    currentPage: number
    setCurrentPage?: any
    loading: Boolean
    selectedCourse: number
    setSelectedCourse: any
    courses: ICourse[]
}

export const StudentsTable = ({
    userColumns,
    users,
    setSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    selectedCourse,
    setSelectedCourse,
    courses,
}: Props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const router = useRouter()

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setSearchTerm(value)

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        debounceTimer.current = setTimeout(() => {
            setSearch(value.toLowerCase())
        }, 500)

        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleCourseChange = (value: string) => {
        setSelectedCourse(Number(value))
        setCurrentPage(1)
    }

    const handleRedirectToStudentQuizInfo = (studentId: number, enrolledId: number) =>{
        setSelectedStudent(studentId);
        router.push("/teacher/students/student-progress/?enrolledId="+enrolledId+"&studentId="+studentId+"&courseId="+selectedCourse);
    }  

    return (
        <div className="mt-5 space-y-1 animate-fadeInLeft">
            {/*<div className="lg:flex-row flex flex-col justify-between items-center space-y-3 lg:space-y-0">
                <div className="w-full lg:w-1/3 flex items-center p-0 text-[#000000]">
                    <Select onValueChange={handleCourseChange}>
                        <SelectTrigger className="w-full font-bold placeholder:text-[#292521]/30 border border-[#EEDDEE] rounded-lg focus:ring-transparent h-[50px] text-[12px]">
                            <SelectValue
                                placeholder={
                                    courses[0]?.title || 'Select course'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                        className="text-[12px]"
                                    >
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full lg:w-1/3 flex items-center border border-[#EEDDEE] px-4 space-x-2 rounded-lg text-[#292521]/30 h-[50px]">
                    <BiSearchAlt className="text-2xl " />
                    <Input
                        className="font-bold text-[12px]  px-4 border-none  bg-white p-0 placeholder:text-[#292521]/30 "
                        placeholder={'Search Student '}
                        style={{
                            boxShadow: 'none',
                        }}
                        value={searchTerm}
                        onChange={handleChangeText}
                    />
                </div>
            </div>*/}
            <div className="h-[30px]"></div>
            <div className="w-full flex items-end border-b-2 border-[#292521]/5 overflow-x-auto">
                <Table className="w-full">
                    <TableHeader className="border-b-2 border-[#292521]/5 p-0">
                        {userColumns?.map((item: any, index: number) => (
                            <TableHead
                                className="font-bold text-[12px] text-[#292521]/40 px-0 py-1 h-[14px]"
                                key={index}
                            >
                                {item?.header}
                            </TableHead>
                        ))}
                    </TableHeader>
                    <TableBody className="">
                        {loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={userColumns?.length}
                                    className="h-24 text-center font-light text-[12px] text-[#292521]/60"
                                >
                                    <div className="w-full flex items-center justify-center">
                                        <LoaderCircle className="mt-3 h-[25px] w-[25px] animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {users &&
                            users?.map(
                                (item: IEnrolledStudent, index: number) => (
                                    <TableRow
                                        key={index}
                                        className="border-b-2 border-[#292521]/5 cursor-pointer"
                                        onClick={()=> handleRedirectToStudentQuizInfo(item?.student?.id, item?.id)}
                                    >
                                        <TableCell className="px-2 py-3">
                                            <div className="flex flex-row items-center space-x-3">
                                                <div className="flex flex-row">
                                                    {item?.student
                                                        ?.profilePicture ===
                                                        null ||
                                                    item?.student
                                                        ?.profilePicture ===
                                                        undefined ? (
                                                        <div className="flex text-[12px] capitalize rounded-[3px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px] bg-[#FF9345]/30">
                                                            {item?.student?.name.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex font-bold text-[16px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px]">
                                                            <img
                                                                src={
                                                                    item
                                                                        ?.student
                                                                        ?.profilePicture
                                                                }
                                                                className="w-full h-full rounded-md  object-cover "
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-6 sm:gap-0">
                                                    <div className="font-bold text-[14px] text-[#292521] p-0 h-[14px]">
                                                        {item?.student?.name}
                                                    </div>
                                                    <div className="font-normal text-[12px] text-[#292521]/60 p-0 h-[12px]">
                                                        {item?.student?.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[12px] text-[#292521] px-0">
                                            <div className="w-[350px] mr-2">
                                                {item?.course?.title}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-normal text-[12px] text-[#292521] px-0">
                                            <div className="w-[150px] mr-2">
                                                {dayjs(item?.createdAt).format(
                                                    'MMMM D, YYYY'
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[12px] text-[#292521] px-0">
                                            <div className="w-[100px] mr-2">
                                                {item?.progressPercentage <
                                                    100 && (
                                                    <div className="bg-[#7435D9] rounded-[15px] font-bold text-[12px] text-white flex items-center justify-center w-[79px] h-[25px] hover:cursor-pointer transform transition-transform duration-300 hover:scale-110">
                                                        {item?.progressPercentage.toFixed() ??
                                                            0}
                                                        %
                                                    </div>
                                                )}
                                                {item?.progressPercentage >=
                                                    100 && (
                                                    <div className="bg-[#34DF64] rounded-[15px] font-bold text-[12px] text-white flex items-center justify-center w-[79px] h-[25px] hover:cursor-pointer transform transition duration-300 hover:scale-110">
                                                        {item?.progressPercentage ??
                                                            0}
                                                        %
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        {users && users.length === 0 && !loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={userColumns?.length}
                                    className="h-24 text-center font-light text-[12px] text-[#292521]/60 animate-fadeInUp"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="pt-1">
                <UserPaginationUi
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

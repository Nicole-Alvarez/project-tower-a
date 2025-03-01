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
import { LoaderCircle } from 'lucide-react'
import { BiEditAlt, BiSolidTrashAlt } from 'react-icons/bi'

export const TableUi = ({ column, data, loading, course, role, currentStatus, actions, onActionClick }: any) => {
    return (
        <div className="w-full h-full flex items-end border-b-2 border-[#292521]/5">
            <Table className="">
                <TableHeader className="border-b-2 border-[#292521]/5 p-0">
                {column?.map((item: any, index: number) => (
                    <TableHead className="font-bold text-[12px] text-[#292521]/40 px-0 py-1 h-[14px]" key={index}>
                        {item?.header}
                    </TableHead>
                ))}
                </TableHeader>
                <TableBody className="">
                    {loading && (
                        <TableRow>
                            <TableCell
                                colSpan={column?.length}
                                className="h-24 text-center font-light text-[12px] text-[#292521]/60"
                            >
                                <div className="w-full flex items-center justify-center">
                                    <LoaderCircle className="mt-3 h-[25px] w-[25px] animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {data && data?.map((user: IUser, index: number) => (
                        <TableRow
                            key={index}
                            className="border-b-2 border-[#292521]/5"
                        >
                            <TableCell className="px-2 py-0">
                                <div className="flex flex-row items-center space-x-3">
                                    <div className="flex flex-row">
                                        {user.profilePicture === null ||
                                        user.profilePicture === undefined ? (
                                            <div className="flex text-[12px] capitalize rounded-[3px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px] bg-[#FF9345]/30">
                                                {user.name.charAt(0)}
                                            </div>
                                        ) : (
                                            <div className="flex font-bold text-[16px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px]">
                                                <img
                                                    src={user?.profilePicture}
                                                    className="w-full h-full rounded-md  object-cover "
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[14px] text-[#292521] p-0 h-[14px]">
                                            {user.name}
                                        </div>
                                        <div className="font-normal text-[12px] text-[#292521]/60 p-0 h-[12px]">
                                            {user.email}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            {course && (
                            <TableCell className="font-bold text-[14px] text-[#292521] px-0 py-0">
                                {user.EnrolledCourse.length}
                            </TableCell>
                           )}
                           {role && (
                            <TableCell className="font-bold text-[14px] text-[#292521] px-0 py-0">
                                {user.userType}
                            </TableCell>
                           )}
                            <TableCell className="font-normal text-[12px] text-[#292521] px-0 py-0">
                                {dayjs(user.createdAt).format('MMMM D, YYYY')}
                            </TableCell>
                            {currentStatus && ( 
                                <TableCell className="font-bold text-[12px] text-[#292521]/60 px-0 py-3">
                                Open
                            </TableCell>
                            )}
                             {actions && (
                                <TableCell className="font-bold text-[12px] text-[#292521]/60 px-0 py-3 z-10">
                                    <div className='flex flex-row gap-3'>
                                        <BiEditAlt
                                            className="text-xl cursor-pointer"
                                            onClick={() => onActionClick(user, 'edit')} // Pass 'edit' action type
                                        />
                                        <BiSolidTrashAlt
                                            className="text-xl cursor-pointer"
                                            onClick={() => onActionClick(user, 'delete')} // Pass 'delete' action type
                                        />
                                    </div>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    {data && data.length === 0 && !loading && (
                        <TableRow>
                            <TableCell
                                colSpan={column?.length}
                                className="h-24 text-center font-light text-[12px] text-[#292521]/60 animate-fadeInUp"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

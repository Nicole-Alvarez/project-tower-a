import { useRef, useState, } from 'react'
import { UserPaginationUi } from '../common/user-table-pagination'
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
import { Check, Copy, Eye, LoaderCircle, Trash2, X } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { CertificationRequirement, ICourse } from '@/interfaces/course.interface'
import { ICertificate, ICreateCertificate } from '@/interfaces/certificates.interface'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useToast } from '../ui/use-toast'
import { createCertificates, deleteCertificate } from '../../../api/mutation/certificates'
import CertificateTemplate from '../sections/certificate-template'
import { getCompletedStudentsByCourseId } from '../../../api/query/courses'
import { toPng } from 'html-to-image';

interface Props {
    certificateColumns: any
    data: ICertificate[]
    setSearch?: any
    totalPages: number
    currentPage: number
    setCurrentPage?: any
    loading: Boolean
    selectedCourse: number
    setSelectedCourse: any
    courses: ICourse[]
    refetch: any
    teacher: IUser
}

export const CertificatesTable = ({
    certificateColumns,
    data,
    setSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    selectedCourse,
    setSelectedCourse,
    courses,
    refetch,
    teacher,
}: Props) => {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
    const [isAdd, setIsAdd] = useState(false)
    const [courseToGenerate, setCourseToGenerate] = useState<number | null>(null)
    const [certificate, setCertificate] = useState<ICertificate | null>(null)
    const [showCertificate, setShowCertificate] = useState(false)
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)
    const [certificateId, setCertificateId] = useState<number | null>(null)
    const [certificateRequirement, setCertificateRequirement] = useState<CertificationRequirement | null>(null)

    const {toast} = useToast()

    const certificateRef = useRef(null);

    const filteredCourses = courses.filter(course => course.certificationEnabled === true);

    const downloadCertificate = async () => {
        if (certificateRef.current) {
        try {
            const dataUrl = await toPng(certificateRef.current);
            
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = certificate?.course?.title  + '-' + certificate?.user?.name + '-certificate.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download image:', error);
        }
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleCourseChange = (value: string) => {
        setSelectedCourse(Number(value))
        setCurrentPage(1)
        setShowCertificate(false);
    }

    const handleCourseToGenerateChange = (value: string) => {
        setCourseToGenerate(Number(value));
        const selectedCourse = filteredCourses.find(course => course.id === Number(value));
        setCertificateRequirement(selectedCourse?.certificationRequirement ?? null);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: ICreateCertificate) => {
            return await createCertificates(payload);
        },
        onSuccess: async () => {
            refetch();
            setIsAdd(false);
            setSelectedStudent(null);
            setCourseToGenerate(null);
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <Check className="mr-2 text-green-500" />
                      Certificate created sucessfully
                    </div>
                  ),
              });
        },
        onError: async (error) => {
            console.log(error);
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" size={"14"} />
                      {error.message}
                    </div>
                  ),
              })
        },
    });

    const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            return await deleteCertificate(Number(certificateId));
        },
        onSuccess: async () => {
            refetch();
            setIsDeleteConfirm(false);
            setCertificateId(null);
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <Check className="mr-2 text-green-500" />
                      Certificate has been deleted
                    </div>
                  ),
              });
        },
        onError: async (error) => {
            console.log(error);
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" size={"14"} />
                      {error.message}
                    </div>
                  ),
              })
        },
    });

    const handleCreate = () => {
        if(courseToGenerate !== null && selectedStudent !== null) {
            mutate({
                studentId: Number(selectedStudent),
                courseId: Number(courseToGenerate),
            })
        } else {
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" size={"14"} />
                      Please fill up all the fields.
                    </div>
                  ),
              })
        }
    }

    const onDelete = () => {
        deleteMutate();
    }

    const handleShowCertificate = (item: ICertificate) => {
        setCertificate(item);
        setShowCertificate(true);
    }

    const { data: students, isLoading } = useQuery({
        queryKey: [
            'completed-students',
            courseToGenerate,
            certificateRequirement
        ],
        queryFn: async () => {
            return await getCompletedStudentsByCourseId(Number(courseToGenerate), certificateRequirement);
        },
        enabled: !!courseToGenerate,
    })

    const handleSelectedStudent = (value: string) =>{
        setSelectedStudent(Number(value));
    }

    const handleDelete = (item: ICertificate) => {
        setCertificateId(item.id);
        setIsDeleteConfirm(true);
    }

    const handleCopyLink = (item: ICertificate) => {
        const url = location.protocol +'//'+ location.host +'/certificates/' + item?.uniqueCode;
        try {
            navigator.clipboard.writeText(url);
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <Check className="mr-2 text-green-500" />
                       Link copied to clipboard!
                    </div>
                  ),
              });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-5 space-y-1 animate-fadeInLeft">
            <div className="lg:flex-row flex flex-col justify-between items-center space-y-3 lg:space-y-0">
                <div className="w-full lg:w-1/3 flex items-center p-0 text-[#000000]">
                    <Select onValueChange={handleCourseChange}>
                        <SelectTrigger className="w-full font-bold placeholder:text-[#292521]/30 border border-[#EEDDEE] rounded-lg focus:ring-transparent h-[50px] text-[12px]">
                            <SelectValue
                                placeholder='Select course'
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
                <div>
                    <Button onClick={() => setIsAdd(true)}>Add New Certificates</Button>
                </div>
            </div>
            <div className="h-[30px]"></div>
            <div className="w-full flex items-end border-b-2 border-[#292521]/5 overflow-x-auto">
                <Table className="w-full">
                    <TableHeader className="border-b-2 border-[#292521]/5 p-0">
                        {certificateColumns?.map((item: any, index: number) => (
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
                                    colSpan={certificateColumns?.length}
                                    className="h-24 text-center font-light text-[12px] text-[#292521]/60"
                                >
                                    <div className="w-full flex items-center justify-center">
                                        <LoaderCircle className="mt-3 h-[25px] w-[25px] animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {data &&
                            data?.map(
                                (item: ICertificate, index: number) => (
                                    <TableRow
                                        key={index}
                                        className="border-b-2 border-[#292521]/5 cursor-pointer"
                                    >
                                        <TableCell className="px-2 py-3">
                                            <div className="flex flex-row items-center space-x-3">
                                                <div className="flex flex-row">
                                                    {item?.user
                                                        ?.profilePicture ===
                                                        null ||
                                                    item?.user
                                                        ?.profilePicture ===
                                                        undefined ? (
                                                        <div className="flex text-[12px] capitalize rounded-[3px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px] bg-[#FF9345]/30">
                                                            {item?.user?.name.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="flex font-bold text-[16px] justify-center items-center hover:cursor-pointer w-[29px] h-[29px]">
                                                            <img
                                                                src={
                                                                    item
                                                                        ?.user
                                                                        ?.profilePicture
                                                                }
                                                                className="w-full h-full rounded-md  object-cover "
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-6 sm:gap-0">
                                                    <div className="font-bold text-[14px] text-[#292521] p-0 h-[14px]">
                                                        {item?.user?.name}
                                                    </div>
                                                    <div className="font-normal text-[12px] text-[#292521]/60 p-0 h-[12px]">
                                                        {item?.user?.email}
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
                                                {dayjs(item?.issuedAt).format(
                                                    'MMMM D, YYYY'
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-[12px] text-[#292521] px-0">
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    onClick={() => handleShowCertificate(item)}
                                                    className="hover:text-blue-400">
                                                    <Eye size={"20"} className='text-[#292521]/60 hover:text-blue-400'/>
                                                </div>
                                                <div 
                                                    onClick={() => handleCopyLink(item)}
                                                    className="hover:text-blue-400">
                                                    <Copy size={"18"} className='text-[#292521]/60 hover:text-blue-400'/>
                                                </div>
                                                <div 
                                                    onClick={() => handleDelete(item)}
                                                    className="hover:text-blue-400">
                                                    <Trash2 size={"18"} className='text-[#292521]/60 hover:text-blue-400'/>
                                                </div>
                                            </div>
                                            
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        {data && data.length === 0 && !loading && (
                            <TableRow>
                                <TableCell
                                    colSpan={certificateColumns?.length}
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

            <Dialog open={isAdd}>
                <DialogContent className="max-w-[450px] w-full max-h-[90vh] overflow-y-auto rounded-[25px] p-6 ">
                    <DialogHeader>Creating Certificate</DialogHeader>
                    <div className='w-full mt-[10px] flex flex-col gap-5'>
                        <div className="w-full flex items-center p-0 text-[#000000]">
                                <Select onValueChange={handleCourseToGenerateChange}>
                                    <SelectTrigger className="w-full placeholder:text-[#292521]/30 border border-[#EEDDEE] rounded-lg focus:ring-transparent h-[50px] text-[12px]">
                                        <SelectValue
                                            placeholder={`${filteredCourses.length > 0 ? 'Select course' : 'No courses allowed to generate certificates'}`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {filteredCourses.map((course) => (
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
                        <div className="w-full flex items-center p-0 text-[#000000]">
                                <Select onValueChange={handleSelectedStudent} disabled={!courseToGenerate}>
                                    <SelectTrigger className="w-full placeholder:text-[#292521]/30 border border-[#EEDDEE] rounded-lg focus:ring-transparent h-[50px] text-[12px]">
                                        {isLoading ? (
                                            <LoaderCircle className="h-[20px] w-[20px] animate-spin text-slate-500" />
                                            ) : students && students.length > 0 ? (
                                            <SelectValue placeholder="Select student" />
                                        ): students && students.length === 0 && (
                                            <SelectValue placeholder="No students found" />
                                        ) }
                                        {!courseToGenerate && <SelectValue placeholder="Student" />}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {students && students.length > 0 && students.map((student) => (
                                                <SelectItem
                                                    key={student.id}
                                                    value={student.id.toString()}
                                                    className="text-[12px]"
                                                >
                                                    {student?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                        </div>
                    </div>
                    <div className='flex flex-row justify-end gap-x-2 mt-5'>
                        <Button
                            variant="outline"
                            className='px-8 bg-slate-50 text-black'
                            onClick={() => {
                                    setIsAdd(false);
                                    setSelectedStudent(null);
                                    setCourseToGenerate(null);
                                }
                            }
                        >Cancel</Button>
                        <Button className='px-16 '
                            onClick={() => handleCreate()}
                            disabled={isPending}
                        >{isPending ? 'Creating...' : 'Create'}</Button>
                    </div>
                </DialogContent>

            </Dialog>
            <div>
            {showCertificate && (
                <div className="w-full pb-20 animate-fadeInLeft" ref={certificateRef}>
                    <CertificateTemplate 
                        studentName={String(certificate?.user?.name)}
                        courseTitle={String(certificate?.course?.title)} 
                        issueDate={dayjs(certificate?.issuedAt).format(
                            'MMMM D, YYYY'
                        )}
                        teacherName={String(teacher?.name)}
                        uniqueCode={String(certificate?.uniqueCode)}
                    />
                </div>
            )}
            {showCertificate && (
                <div className="flex justify-center">
                    <div className="absolute bottom-5">
                        <Button onClick={downloadCertificate} className="bg-purple-700">
                            Download Certificate
                        </Button>
                    </div>
                </div>    
            )}
            </div>

            <Dialog open={isDeleteConfirm}>
                <DialogContent className="max-w-[450px] w-full max-h-[90vh] overflow-y-auto rounded-[25px] p-6 ">
                    <DialogHeader>
                        <div className='flex justify-center'>Do you want to delete this certificate?</div></DialogHeader>
                    <div className='flex flex-row justify-center gap-x-2 mt-5'>
                        <Button
                            variant="outline"
                            className='px-8 bg-slate-50 text-black text-[12px]'
                            onClick={() => {
                                    setIsDeleteConfirm(false);
                                    setCertificateId(null);
                                }
                            }
                        >Cancel</Button>
                        <Button className='px-8 bg-red-700 text-[12px]'
                            onClick={() => onDelete()}
                            disabled={isPending}
                        >{isPending ? 'Deleting...' : 'Delete'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

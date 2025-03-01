import { BiSearchAlt, BiChevronDown } from 'react-icons/bi'
import { Input } from '../../ui/input'
import { TableUi } from '../../common/table'
import { useRef, useState } from 'react'
import { UserPaginationUi } from '../../common/user-table-pagination'
import { IUser } from '@/interfaces/user.interface'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

interface Props {
    userColumns: any;
    users: IUser[];
    type: string;
    setSearch?: any;
    totalPages: number;
    currentPage: number;
    setCurrentPage?: any;
    loading: Boolean;
    course: Boolean;
    role: Boolean;
    dropdown: Boolean;
}

export const UsersTable = ({
    userColumns,
    users,
    type,
    setSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    course,
    role,
    dropdown,
}: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (setSearch) {
                setSearch(value.toLowerCase());
            }
        }, 500);

        if (setCurrentPage) {
            setCurrentPage(1);
        }
    };

    const handleUserTypeChange = (userType: string) => {
        setSelectedUserType(userType);
        if (setCurrentPage) {
            setCurrentPage(1); 
        }
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUserType = selectedUserType === 'ALL' || (selectedUserType ? user.userType === selectedUserType : true);
        return matchesSearchTerm && matchesUserType;
    });
    return (
        <div className="space-y-10 animate-fadeInLeft">
            <div className="lg:flex-row flex flex-col items-center justify-between space-y-3 lg:space-y-0">
                <div className="w-full lg:w-[50%] font-bold text-[16px] text-[#292521] capitalize">
                    {type} Table
                </div>
                <div className="flex flex-row gap-3">
                <div className="w-full lg:w-[231px] h-[40px] flex items-center border border-[#EEDDEE] px-4 space-x-2 rounded-lg text-[#292521]/30">
                    <BiSearchAlt className="text-2xl" />
                    <input
                        className="font-bold text-[12px] px-4 border-none p-0 placeholder:text-[#292521]/30 focus:outline-none"
                        placeholder={'Search ' + type}
                        style={{
                            boxShadow: 'none',
                        }}
                        value={searchTerm}
                        onChange={handleChangeText}
                    />
                </div>
                {dropdown && (
                    <div className="flex items-center border border-[#EEDDEE] px-4 space-x-2 rounded-lg text-[#292521]/30">
                        <DropdownMenu>
                            <DropdownMenuTrigger 
                                className="font-bold text-[12px] flex justify-center rounded-lg px-4 h-10 focus:outline-none" 
                                style={{ width: '150px', height: '20px' }}
                            >
                                {selectedUserType || 'Select Role'}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                                className='w-[200px] fixed bg-slate-50 z-10 right-[-105px] top-[10px] px-2 py-2 cursor-pointer'
                                style={{ maxHeight: '200px', overflowY: 'auto' }} 
                            >
                                <DropdownMenuItem 
                                    className="text-[12px] font-semibold mb-2 focus:outline-none hover:font-bold hover:text-[#444040]"
                                    onClick={() => handleUserTypeChange('ALL')}
                                >
                                    ALL
                                </DropdownMenuItem>
                                {users
                                    .map(user => user.userType)
                                    .filter((userType, index, self) => self.indexOf(userType) === index)
                                    .map(userType => (
                                        <DropdownMenuItem 
                                            className="text-[12px] font-semibold mb-2 focus:outline-none hover:font-bold hover:text-[#444040]" 
                                            key={userType} 
                                            onClick={() => handleUserTypeChange(userType)}
                                        >
                                            {userType}
                                        </DropdownMenuItem>
                                    ))}
                            </DropdownMenuContent>
                            <BiChevronDown className="text-sm" />
                        </DropdownMenu>
                    </div>
                )}
                </div>
            </div>
            <div>
                <TableUi
                    column={userColumns}
                    data={filteredUsers} 
                    loading={loading}
                    course={course}
                    role={role}
                    currentStatus={true}
                />
            </div>
            <div className="pt-1">
                <UserPaginationUi
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

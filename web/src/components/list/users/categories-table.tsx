import { BiSearchAlt, BiChevronDown, BiSolidTrashAlt } from 'react-icons/bi'
import { TableUi } from '../../common/table'
import { useRef, useState } from 'react'
import { UserPaginationUi } from '../../common/user-table-pagination'
import { ICategory } from '@/interfaces/category.interface'
import { DeleteCategoryModal } from '@/components/modals/delete-category'
import { EditCategoryModal } from '@/components/modals/edit-category'
import AnimatedDiv from '@/components/animated/div'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import { CreateCategoryModal } from '@/components/modals/add-category'

interface Props {
    categoryColumns: any; 
    categories: ICategory[];
    type: string;
    setSearch?: (searchTerm: string) => void;
    totalPages: number;
    currentPage: number;
    setCurrentPage?: (page: number) => void;
    loading: boolean;
}

export const CategoriesTable = ({
    categoryColumns,
    categories,
    type,
    setSearch,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
}: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);
    const [categoryToEdit, setCategoryToEdit] = useState<ICategory | null>(null);
    const [openLessonItemDeleteModal, setOpenLessonItemDeleteModal] = useState(false);
    const [openLessonItemEditModal, setOpenLessonItemEditModal] = useState(false);
    const [openCreateCategoryModal, setOpenCreateCategoryModal] = useState(false); // New state for Create Category modal


    const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            if (setSearch) {
                setSearch(value.toLowerCase());
                console.log('Search term set:', value.toLowerCase());
            }
        }, 500);

        if (setCurrentPage) {
            setCurrentPage(1);
            console.log('Page reset to 1 due to search term change.');
        }
    };

    const handleActionClick = (item: ICategory, actionType: 'delete' | 'edit') => {
        if (actionType === 'delete') {
            setCategoryToDelete(item);
            setOpenLessonItemDeleteModal(true);
        } else if (actionType === 'edit') {
            setCategoryToEdit(item);
            setOpenLessonItemEditModal(true);
        }
    };
    
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && setCurrentPage) {
            setCurrentPage(page);
        }
    };

    const filteredUsers = categories.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-5 animate-fadeInLeft py-4">
            <div className="lg:flex-row flex flex-col items-center justify-between space-y-3 lg:space-y-0">
                <div className="flex flex-row gap-5 items-center justify-end w-full py-3">
                    <div className="w-full h-[40px] lg:w-[231px] flex items-center border border-[#EEDDEE] px-4 space-x-2 rounded-lg text-[#292521]/30">
                        <BiSearchAlt className="text-2xl" />
                        <input
                            className="font-bold text-[12px] px-4 border-none bg-white p-0 placeholder:text-[#292521]/30 focus:outline-none"
                            placeholder={`Search categories`}
                            style={{ boxShadow: 'none' }}
                            value={searchTerm}
                            onChange={handleChangeText}
                        />
                    </div>
                    <AnimatedDiv animation="Bubble">
                        <Button
                            className={`gap-1 h-fit p-0 cursor-pointer hover:bg-white`}
                            onClick={() => setOpenCreateCategoryModal(true)} // Open Create Category modal
                            variant={"ghost"}
                        >
                            <p className="text-[#37E31C]">Create Category</p>
                            <CirclePlus color="#37E31C" size={18} />
                        </Button>
                    </AnimatedDiv>
                </div>
            </div>
            <div>
                <TableUi
                    column={categoryColumns}
                    data={filteredUsers} 
                    loading={loading}
                    course={false}
                    role={false}
                    currentStatus={false}
                    actions={true}
                    onActionClick={handleActionClick}
                />
            </div>
            <div className="pt-1">
                <UserPaginationUi
                    totalPages={totalPages}
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                />
            </div>
            {categoryToDelete && (
                <DeleteCategoryModal 
                    open={openLessonItemDeleteModal}
                    onOpenChange={(value) => setOpenLessonItemDeleteModal(value)}
                    category={categoryToDelete}
                />
            )}
            {categoryToEdit && (
                <EditCategoryModal 
                open={openLessonItemEditModal}
                onOpenChange={(value) => setOpenLessonItemEditModal(value)}
                category={categoryToEdit}
                />
            )}

            {openCreateCategoryModal && ( // Render Create Category modal
                <CreateCategoryModal 
                    open={openCreateCategoryModal}
                    onOpenChange={(value) => setOpenCreateCategoryModal(value)}
                />
            )}
        </div>
    );
};
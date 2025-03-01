import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '../ui/button';

interface Props {
    totalPages: number;
    currentPage: number;
    handlePageChange: (pageIndex: number) => void;
}

export const UserPaginationUi = (props: Props) => {
    const { totalPages, currentPage, handlePageChange } = props;

    return (
        <div
            className={`${
                totalPages === 0 ? 'hidden' : ''
            } w-full h-full flex items-end opacity-0 animate-fadeInRight`}
        >
            <Pagination className="w-full flex justify-end items-center hover:cursor-pointer">
                <PaginationContent>
                    <Button
                        variant={"ghost"}
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <PaginationPrevious className="text-[10px]" />
                    </Button>

                    <PaginationItem
                        className="bg-white rounded-md"
                    >
                        <PaginationLink className="text-[10px]">
                            {currentPage} of {totalPages}
                        </PaginationLink>
                    </PaginationItem>

                    <Button
                        variant={"ghost"}
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <PaginationNext className="text-[10px]" />
                    </Button>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

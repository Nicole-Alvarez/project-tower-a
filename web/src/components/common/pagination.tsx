import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '../ui/button';

interface Props {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    handlePageChange: (pageIndex: number) => void;
}
export const PaginationUi = (props: Props) => {
    const {totalItems, pageSize, currentPage, handlePageChange} = props;
    const totalPages = Math.ceil(totalItems / pageSize);
    return (
        <div
            className={`${
                totalPages === 0 ? 'hidden' : ''
            } w-full h-full flex items-end opacity-0 animate-fadeInUp`}
        >
            <Pagination className="w-full flex justify-end hover:cursor-pointer">
                <PaginationContent>
                    <Button
                        variant={'ghost'}
                        disabled={currentPage <= 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <PaginationPrevious />
                    </Button>
                    <PaginationItem
                        onClick={() => handlePageChange(1)}
                        className={`${
                            currentPage === 1 ? 'bg-white rounded-md' : ''
                        }`}
                    >
                        <PaginationLink>1</PaginationLink>
                    </PaginationItem>
    
                    {totalPages !== 1 && (
                        <div className="flex flex-row">
                            {currentPage !== 1 && currentPage !== totalPages ? (
                                <PaginationItem className="bg-white rounded-md">
                                    <PaginationLink>{currentPage}</PaginationLink>
                                </PaginationItem>
                            ) : (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}
    
                            <PaginationItem
                                onClick={() => handlePageChange(totalPages)}
                                className={`${
                                    currentPage === totalPages
                                        ? 'bg-white rounded-md'
                                        : ''
                                }`}
                            >
                                <PaginationLink>
                                    {Number.isNaN(totalPages) ? 0 : totalPages}
                                </PaginationLink>
                            </PaginationItem>
                        </div>
                    )}
                    <Button
                        variant={'ghost'}
                        disabled={currentPage >= totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <PaginationNext />
                    </Button>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
import React from 'react';
import { Pagination as MuiPagination, Pagination } from '@mui/material';
import { useRouter } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  searchKey: string;
}

const PaginationCustom = ({ totalPages, currentPage, searchKey }: PaginationProps) => {
  const router = useRouter();

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const searchParams = searchKey ? `&searchKey=${encodeURIComponent(searchKey)}` : '';
    router.push(`?page=${value}${searchParams}`);
  };

  return (
    <Pagination 
      count={totalPages} 
      page={currentPage} 
      onChange={handlePageChange} 
      color="primary" 
    />
  );
};

export default PaginationCustom;

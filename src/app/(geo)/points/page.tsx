"use client"

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, TextField, Typography, Pagination } from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/navigation';

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false });

const Points = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [points, setPoints] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  

  const fetchPoints = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    setError('');
    try {
      const searchParam = search ? `&searchKey=${encodeURIComponent(search)}` : '';
      const response = await fetch(`http://localhost:3005/points?page=${currentPage}&take=3${searchParam}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.data && result.data.data && Array.isArray(result.data.data)) {
        setPoints(result.data.data);
        setTotalPages(Math.ceil(result.data.meta.itemCount / 3));
      } else {
        throw new Error('Unexpected data structure');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch points');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((search: string) => {
      setPage(1);
      fetchPoints(1, search);
    }, 300),
    [fetchPoints]
  );

  useEffect(() => {
    fetchPoints(page, searchTerm);
  }, [page, fetchPoints]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    debouncedFetch(newSearchTerm);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const CapitalizeString = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const detailPoint = (id: string) => {
    router.push(`/points/${id}`);
  }

  return (
    <Box className="flex">
      <Box className="w-1/2 p-4">
        <Map moveToCurrentLocation={true} />
      </Box>
      <Box className="w-1/2 p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4">Shipping Points</Typography>
          <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
            Add Point
          </Button>
        </Box>
        <Box className="flex mb-4 mt-2">
          <TextField
            variant="outlined"
            placeholder="Search points..."
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
            sx={{ borderRadius: '30px' }}
          />
        </Box>
        <Box className="mt-6">
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : points.length > 0 ? (
            points.map((point) => (
              <Box key={point.id} className="bg-white shadow-md rounded-lg p-4 mt-4">
                <Box className="flex items-center mb-2">
                  <Typography variant="h6" className="ml-2">{point.name}</Typography>
                </Box>
                <Typography variant="body2">
                  <AnchorIcon color="primary" /> {CapitalizeString(point.type)}
                </Typography>
                <Typography variant="body2">
                  <LocationOnIcon /> {point.latitude}, {point.longitude}
                </Typography>
                <Box className="mt-2">
                  <Button variant="contained" onClick={() => detailPoint(point.id)}>View Details</Button>
                  <Button variant="contained" color="error" sx={{ ml: 2 }}>Delete</Button>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="body1">No points available</Typography>
          )}
        </Box>
        <Box className="mt-4 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Points;

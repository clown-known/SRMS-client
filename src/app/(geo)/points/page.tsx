'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  TextField,
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaginationCustom from '@/components/Pagination';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from '@/components/Drawer';
import SearchIcon from '@mui/icons-material/Search';
import Loading from '@/components/Loading';
import ConfirmDeleteDialog from '@/components/geo/ConfirmDialog';
import { pointService } from '@/service/pointService';
import PointDetailsCard from '@/components/points/PointDetail';
import SearchInput from '@/components/geo/SearchInput';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Load the map component
const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const Points = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchKey') || ''
  );
  const [points, setPoints] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  // Set initial page number from search params
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch points
  const fetchPoints = useCallback(
    async (currentPage: number, searchKey: string) => {
      setIsLoading(true);
      setError('');
      try {
        const searchParam = searchKey
          ? `&searchKey=${encodeURIComponent(searchKey)}`
          : '';
        const response = await pointService.getAllPoints(
          currentPage,
          10,
          searchKey
        );
        if (response.data?.data && Array.isArray(response.data.data)) {
          setPoints(response.data.data);
          setTotalPages(Math.ceil(response.data.meta.itemCount / 10));
        } else {
          throw new Error('Unexpected data structure');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch points');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPoints(page, searchParams.get('searchKey') || '');
    if (searchParams.get('searchKey') || searchParams.get('page')) {
      setOpenDrawer(true);
    }
  }, [page, searchParams, fetchPoints]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Submit search on button click or Enter key press
  const handleSearchSubmit = () => {
    router.push(`/points?page=1&searchKey=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  // Delete point
  const handleDelete = async () => {
    if (!selectedPointId) return;
    try {
      await pointService.deletePoint(selectedPointId);

      fetchPoints(page, searchTerm);
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || 'Failed to delete point');
    }
  };

  // Capitalize first letter
  const capitalizeString = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  // Open and close dialog delete confirmation
  const handleOpenDialog = (id: string) => {
    setSelectedPointId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPointId(null);
  };

  const handlePointClick = (point: PointDTO) => {
    setSelectedPoint(point);
    setIsCardVisible(true);
  };

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedPoint(null);
  };

  const handleEditPoint = (id: string) => {
    router.push(`/points/${id}/edit`);
  };

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Map moveToCurrentLocation={true} onPointClick={handlePointClick} />
        {isCardVisible && selectedPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: openDrawer ? '28%' : 50,
              zIndex: 1000,
              transition: 'left 0.3s ease-in-out',
            }}
          >
            <PointDetailsCard point={selectedPoint} onClose={handleCloseCard} />
          </Box>
        )}
      </Box>
      <IconButton
        onClick={() => setOpenDrawer(!openDrawer)}
        sx={{
          position: 'absolute',
          top: '50%', 
          left: openDrawer ? 397 : -3, 
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid black',
          width: 20, 
          height: 50, 
          borderRadius: 1,
          transform: 'translateY(-50%)',
          transition: 'left 0.3s ease-in-out',
        }}
      >
        {openDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <CustomDrawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box>
          <Box className="mb-4 mt-2 flex items-center justify-between">
            <Box className="mr-10 flex-grow">
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Searching point..."
                onKeyDown={handleKeyPress}
              />
            </Box>
            <IconButton
              onClick={() => router.push('/points/create')}
              sx={{
                backgroundColor: 'black',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
              }}
              size="small"
            >
              <Tooltip title="Add new point" arrow>
                <AddIcon fontSize="small" />
              </Tooltip>
            </IconButton>
          </Box>
          <Box className="mt-6">
            {isLoading && <Loading />}
            {error && <Typography color="error">{error}</Typography>}
            {!isLoading && !error && points.length === 0 && (
              <Typography>No points available</Typography>
            )}

            {!isLoading &&
              !error &&
              points.length > 0 &&
              points.map((point) => (
                <Box
                  key={point.id}
                  className="mt-1 rounded-lg bg-white p-3 shadow-md"
                >
                  <Box className="mb-2 flex items-center">
                    <Typography variant="h6" className="ml-2">
                      {point.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    <AnchorIcon color="primary" />{' '}
                    {capitalizeString(point.type)}
                  </Typography>
                  <Typography variant="body2">
                    <LocationOnIcon /> {point.latitude.toFixed(3)},{' '}
                    {point.longitude.toFixed(3)}
                  </Typography>
                  <Box className="mt-2">
                    <Button
                      variant="contained"
                      onClick={() => router.push(`/points/${point.id}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ ml: 2 }}
                      onClick={() => handleOpenDialog(point.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              ))}
          </Box>

          <Box className="mt-3 flex justify-center">
            <PaginationCustom
              totalPages={totalPages}
              currentPage={page}
              searchKey={searchTerm}
            />
          </Box>

          {/* Delete Confirmation Dialog */}
          <ConfirmDeleteDialog
            open={open}
            onClose={handleCloseDialog}
            onConfirm={handleDelete}
            title="Delete Confirmation"
            content="Are you sure you want to delete this point permanently?"
            cancelText="No"
            confirmText="Yes"
          />
        </Box>
      </CustomDrawer>
    </Box>
  );
};

export default Points;

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PaginationCustom from '@/components/Pagination';
import CustomDrawer from '@/components/Drawer';
import ConfirmDeleteDialog from '@/components/geo/ConfirmDialog';
import { pointService } from '@/service/pointService';
import PointDetailsCard from '@/components/points/PointDetailCard';
import SearchInput from '@/components/geo/SearchInput';
import PointsList from '@/components/points/PointList';
import PointForm from '@/components/points/PointForm';
import SnackbarCustom from '@/components/Snackbar';
import { Permission } from '@/app/lib/enum';
import { RootState, useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';

// Load the map component
const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const Points = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // List points states
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchKey') || ''
  );
  const [points, setPoints] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [openListDrawer, setOpenListDrawer] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  // Create point states
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const [mapKey, setMapKey] = useState(0);
  const dispatch = useAppDispatch();
  const permission = useSelector((state: RootState) => state.user.permissions);

  // Fetch points
  const fetchPoints = useCallback(
    async (currentPage: number, searchKey: string) => {
      setIsLoading(true);
      setError('');
      try {
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
      setOpenListDrawer(true);
    }
  }, [page, searchParams, fetchPoints]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    router.push(`/points?page=1&searchKey=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  // Create point handlers
  const handleCreatePoint = async () => {
    if (!name || !latitude || !longitude || !type) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      setSnackbarMessage('Coordinates must be numbers');
      setSnackbarOpen(true);
      return;
    }

    try {
      await pointService.createPoint({
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        type,
        description,
      });

      resetCreateForm();
      setOpenCreateDrawer(false);
      setOpenListDrawer(true);

      setMapKey((prevKey) => prevKey + 1);

      fetchPoints(page, searchTerm);
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Create new point failed');
      setSnackbarOpen(true);
    }
  };

  const resetCreateForm = () => {
    setName('');
    setLatitude('');
    setLongitude('');
    setType('');
    setDescription('');
  };

  const handleOpenCreateForm = () => {
    setOpenListDrawer(false);
    setTimeout(() => {
      setOpenCreateDrawer(true);
    }, 300);
  };

  const handleCloseCreateForm = () => {
    setOpenCreateDrawer(false);
    setTimeout(() => {
      setOpenListDrawer(true);
    }, 300);
    resetCreateForm();
  };

  const onMapClick = (lat: number, lng: number) => {
    if (openCreateDrawer) {
      setLatitude(lat.toString());
      setLongitude(lng.toString());
    }
  };

  const handleDelete = async () => {
    if (!selectedPointId) return;
    try {
      await pointService.deletePoint(selectedPointId);
      fetchPoints(page, searchTerm);
      setMapKey((prevKey) => prevKey + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to delete point');
    } finally {
      handleCloseDialog();
    }
  };

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const hasPermission = (permissionRequired: string) => {
    return permission.includes(permissionRequired);
  };

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, position: 'relative' }}>
        <Map
          key={mapKey}
          moveToCurrentLocation={true}
          onPointClick={handlePointClick}
          onMapClick={onMapClick}
        />
        {isCardVisible && selectedPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: openListDrawer || openCreateDrawer ? 430 : 50,
              zIndex: 1000,
              transition: 'left 0.3s ease-in-out',
            }}
          >
            <PointDetailsCard point={selectedPoint} onClose={handleCloseCard} />
          </Box>
        )}
      </Box>

      <IconButton
        onClick={() => {
          if (openCreateDrawer || openListDrawer) {
            setOpenCreateDrawer(false);
            setOpenListDrawer(false);
          } else {
            setOpenListDrawer(true);
          }
        }}
        sx={{
          position: 'absolute',
          top: '50%',
          left: openListDrawer || openCreateDrawer ? 397 : -3,
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
        {openListDrawer || openCreateDrawer ? (
          <ChevronLeftIcon />
        ) : (
          <ChevronRightIcon />
        )}
      </IconButton>

      {/* List Points Drawer */}
      <CustomDrawer
        open={openListDrawer}
        onClose={() => setOpenListDrawer(false)}
      >
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
            {hasPermission(Permission.CREATE_POINT) && (
              <IconButton
                onClick={handleOpenCreateForm}
                sx={{
                  backgroundColor: 'darkgreen',
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
                }}
                size="small"
              >
                <Tooltip title="Add new point" arrow>
                  <AddIcon fontSize="small" />
                </Tooltip>
              </IconButton>
            )}
          </Box>

          <PointsList
            points={points}
            isLoading={isLoading}
            error={error}
            capitalizeString={(str: string) =>
              str.charAt(0).toUpperCase() + str.slice(1)
            }
            handleOpenDialog={handleOpenDialog}
            handlePointClick={handlePointClick}
            hasPermission={hasPermission}
          />

          <Box className="mt-3 flex justify-center">
            <PaginationCustom
              totalPages={totalPages}
              currentPage={page}
              searchKey={searchTerm}
            />
          </Box>
        </Box>
      </CustomDrawer>

      {/* Create Point Drawer */}
      <CustomDrawer
        open={openCreateDrawer}
        onClose={() => setOpenCreateDrawer(false)}
      >
        <Box>
          <Box className="mb-6 flex items-center">
            <IconButton onClick={handleCloseCreateForm}>
              <ArrowBackIcon />
              <Typography variant="h6"> Back to points</Typography>
            </IconButton>
          </Box>

          <PointForm
            name={name}
            setName={setName}
            latitude={latitude}
            setLatitude={setLatitude}
            longitude={longitude}
            setLongitude={setLongitude}
            type={type}
            setType={setType}
            description={description}
            setDescription={setDescription}
            onSubmit={handleCreatePoint}
            submitButtonText="Create Point"
          />
        </Box>
      </CustomDrawer>

      {/* Dialogs and Snackbars */}
      <ConfirmDeleteDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title="Delete Confirmation"
        content="Are you sure you want to delete this point permanently?"
      />

      <SnackbarCustom
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
};

export default Points;

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import MenuIcon from '@mui/icons-material/Menu';
import { routeService } from '@/service/routeService';
import ConfirmDeleteDialog from '@/components/geo/ConfirmDialog';
import RoutesDialog from '@/components/route/MenuDialog';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const Routes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState<RouteDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('searchKey') || ''
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openRoutesDialog, setOpenRoutesDialog] = useState(false);

  // Set initial page number from search params
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch routes
  const fetchRoutes = useCallback(
    async (currentPage: number, search: string) => {
      setIsLoading(true);
      try {
        const response = await routeService.getAllRoutes(
          currentPage,
          10,
          search
        );
        const { data } = response;

        if (data.data && Array.isArray(data.data)) {
          setRoutes(data.data);
          setTotalPages(Math.ceil(data.meta.itemCount / 10));
        } else {
          setError('Unexpected data structure received from server');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching routes');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRoutes(page, searchParams.get('searchKey') || '');
    if (searchParams.get('searchKey') || searchParams.get('page')) {
      setOpenRoutesDialog(true);
    }
  }, [page, searchParams, fetchRoutes]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Submit search on button click or Enter key press
  const handleSearchSubmit = () => {
    router.push(`/routes?page=1&searchKey=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };

  const handleDeleteClick = (id: string) => {
    setRouteToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (routeToDelete) {
      setIsLoading(true);
      try {
        await routeService.deleteRoute(routeToDelete);
        fetchRoutes(page, searchTerm);
      } catch (error) {
        console.error(error);
        setError('An error occurred while deleting the route');
      } finally {
        setIsLoading(false);
        setOpenDialog(false);
        setRouteToDelete(null);
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRouteToDelete(null);
  };

  const handleCheckboxChange = (routeId: string) => {
    setSelectedRoutes((prev) =>
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };
  

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1 }}>
        <Map
          moveToCurrentLocation={true}
          routes={routes}
          selectedRoutes={selectedRoutes}
        />
      </Box>
      <IconButton
        onClick={() => setOpenRoutesDialog(true)}
        sx={{
          position: 'absolute',
          top: 150,
          left: 9,
          zIndex: 1000,
          backgroundColor: 'white',
          border: '1px solid black',
          width: 35,
          height: 35,
        }}
      >
        <MenuIcon />
      </IconButton>

      <RoutesDialog
        open={openRoutesDialog}
        onClose={() => setOpenRoutesDialog(false)}
        routes={routes}
        isLoading={isLoading}
        error={error}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
        handleKeyPress={handleKeyPress}
        handleDeleteClick={handleDeleteClick}
        handleCheckboxChange={handleCheckboxChange}
        selectedRoutes={selectedRoutes}
        totalPages={totalPages}
        currentPage={page}
      />

      {/* Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        content="Are you sure you want to delete this route permanently?"
        cancelText="Cancel"
        confirmText="Yes"
      />
    </Box>
  );
};

export default Routes;
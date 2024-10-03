"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Checkbox, IconButton, TextField, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false });

interface Point {
  latitude: number;
  longitude: number;
  name: string;
}

interface Route {
  id: number;
  name: string;
  startPoint: Point;
  endPoint: Point;
  distance: number;
  points: Point[];
}

const Routes = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchKey") || "");
  const [openDialog, setOpenDialog] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<number | null>(null);
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Set initial page number from search params
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch routes
  const fetchRoutes = useCallback(async (currentPage: number, search: string) => {
    setIsLoading(true);
    try {
      const searchParam = search ? `&searchKey=${encodeURIComponent(search)}` : '';
      const response = await fetch(`http://localhost:3002/routes?page=${currentPage}&take=5${searchParam}`);
      if (!response.ok) {
        throw new Error('Fetch failed');
      }

      const responseData = await response.json();
      console.log(responseData);

      if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
        setRoutes(responseData.data.data);
        setTotalPages(Math.ceil(responseData.data.meta.itemCount / 5));
      } else {
        console.error('Unexpected data structure:', responseData);
        setError('Unexpected data structure received from server');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchRoutes(page, searchParams.get("searchKey") || "");
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
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleDeleteClick = (id: number) => {
    setRouteToDelete(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (routeToDelete !== null) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3002/routes/${routeToDelete}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Delete failed');
        }
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    const searchKey = searchTerm ? `&searchKey=${encodeURIComponent(searchTerm)}` : "";
    router.push(`/routes?page=${value}${searchKey}`);
  };

  const handleCheckboxChange = (routeId: number) => {
    setSelectedRoutes(prev => 
      prev.includes(routeId)
        ? prev.filter(id => id !== routeId)
        : [...prev, routeId]
    );
  };
  

  return (
    <Box className="flex">
      <Box className="w-1/2 p-4">
        <Map 
          moveToCurrentLocation={true} 
          routes={routes}
          selectedRoutes={selectedRoutes}
        />
      </Box>
      <Box className="w-1/2 p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4">Shipping Routes</Typography>
          <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }} onClick={() => router.push('/routes/create')}>
            Add Routes
          </Button>
        </Box>
        <Box className="flex mb-4 mt-2">
          <TextField
            variant="outlined"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            fullWidth
            sx={{ borderRadius: "30px" }}
          />
          <Button variant="contained" onClick={handleSearchSubmit} sx={{ ml: 2 }}>
            Search
          </Button>
        </Box>
        <Box className="mt-6">
          {isLoading && <Typography>Loading...</Typography>}
          {!isLoading && error && <Typography color="error">{error}</Typography>}
          {!isLoading && !error && routes.length > 0 && (
            <TableContainer component={Paper}>
              <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ width: '1%' }}>
                  </TableCell>
                  <TableCell sx={{ width: '25%' }}>Name</TableCell>
                  <TableCell sx={{ width: '25%' }}>Start Point</TableCell>
                  <TableCell sx={{ width: '25%' }}>End Point</TableCell>
                  <TableCell sx={{ width: '20%' }}>Distance (km)</TableCell>
                  <TableCell sx={{ width: '1%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell padding="checkbox">
                    <Checkbox 
                      checked={selectedRoutes.includes(route.id)}
                      onChange={() => handleCheckboxChange(route.id)}
                    />
                    </TableCell>
                    <TableCell>{route.name}</TableCell>
                    <TableCell>{route.startPoint?.name || 'N/A'}</TableCell>
                    <TableCell>{route.endPoint?.name || 'N/A'}</TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => router.push(`/routes/${route.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteClick(route.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isLoading && !error && routes.length === 0 && (
            <Typography>No routes found</Typography>
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
      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this route?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Routes;
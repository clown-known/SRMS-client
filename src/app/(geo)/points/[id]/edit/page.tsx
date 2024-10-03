"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, Select, MenuItem, TextareaAutosize, Grid, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import CustomInput from '@/components/CustomInput';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const PointEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (!id) {
      router.push('/points');
      return;
    }

    const fetchPointDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:3002/points/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        const point = result.data;
        setName(point.name);
        setLatitude(point.latitude.toString());
        setLongitude(point.longitude.toString());
        setType(point.type);
        setDescription(point.description);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch point details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPointDetail();
  }, [id]);

  const handleSubmit = async () => {
    if (!name || !latitude || !longitude || !type) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    if(isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))){
      setSnackbarMessage('Coordinates must be numbers');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/points/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          type,
          description
        })
      })

      if(response.ok){
        setSnackbarMessage('Point updated successfully');
        setSnackbarOpen(true);
        setTimeout(() => router.push('/points'), 2000);
      } else {
        setSnackbarMessage('Update point failed');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
      setSnackbarMessage('An error occurred while updating the point');
      setSnackbarOpen(true);
    }
  };

  const onMapClick = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  }

  const getMapCenter = (): [number, number] => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return [0, 0]; 
  };
  
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="flex h-screen">
      <Box className="w-1/2 p-4">
        <Map center={getMapCenter()} onMapClick={onMapClick} />
      </Box>
      <Box className="w-1/2 p-8 overflow-y-auto">
        <Box className="flex items-center mb-6">
          <Button startIcon={<ArrowBackIcon />} onClick={() => {router.push('/points')}}>
            Back to Points
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Edit Point
        </Typography>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <CustomInput
            label="Point Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Grid container spacing={2} className="mb-4">
            <Grid item xs={6}>
              <CustomInput
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle1" className="mb-2">Type</Typography>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as string)}
            fullWidth
            className="mb-4"
          >
            <MenuItem value="port">Port</MenuItem>
            <MenuItem value="dock">Dock</MenuItem>
          </Select>

          <Typography variant="subtitle1" className="mb-2">Description</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />

          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            type="submit"
            className="mt-4"
          >
            Update Point
          </Button>
        </form>

        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          autoHideDuration={3000} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          ContentProps={{
            style: {
              backgroundColor: snackbarMessage.includes('successfully') ? '#4caf50' : '#f44336',
              color: '#fff', 
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PointEdit;
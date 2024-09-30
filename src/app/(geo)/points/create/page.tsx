"use client"

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, Select, MenuItem, TextareaAutosize, Grid, Snackbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import CustomInput from '@/app/components/CustomInput';

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false });

const CreatePoint = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      const response = await fetch('http://localhost:3002/points', {
        method: 'POST',
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
        router.push('/points');
      } else {
        setSnackbarMessage('Create new point failed');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onMapClick = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  const handleCloseSnackbars = () => {
    setSnackbarOpen(false);
  }

  return (
    <Box className="flex h-screen">
      <Box className="w-1/2 p-4">
        <Map moveToCurrentLocation={true} onMapClick={onMapClick} />
      </Box>
      <Box className="w-1/2 p-8 overflow-y-auto">
        <Box className="flex items-center mb-6">
          <Button startIcon={<ArrowBackIcon />} onClick={() => {router.push('/points')}}>
            Back to Points
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Create New Point
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
            Create Point
          </Button>
        </form>

        {/* Snackbar for display validation error*/}
        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbars}
          message={snackbarMessage}
          autoHideDuration={3000} 
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          ContentProps={{
            style: {
              backgroundColor: '#f44336', 
              color: '#fff', 
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CreatePoint;
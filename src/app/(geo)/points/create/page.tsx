'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  TextareaAutosize,
  Grid,
  Snackbar,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import SnackbarCustom from '@/components/Snackbar';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from '@/components/Drawer';
import { pointService } from '@/service/pointService';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const CreatePoint = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleSubmit = async () => {
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

      router.push('/points');
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Create new point failed');
      setSnackbarOpen(true);
    }
  };

  const onMapClick = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1 }}>
        <Map moveToCurrentLocation={true} onMapClick={onMapClick} />
      </Box>
      <IconButton
        onClick={() => setOpenDrawer(true)}
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
      <CustomDrawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box>
          <Box className="mb-6 flex items-center">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                router.push('/points');
              }}
            >
              Back to Points
            </Button>
          </Box>

          <Typography variant="h4" component="h1" className="mb-6">
            Create New Point
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <CustomInput
              label="Point Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Grid container spacing={2} className="mb-4">
              <Grid item xs={6}>
                <CustomInput
                  label="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  label="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" className="mb-2">
              Type
            </Typography>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as string)}
              fullWidth
              className="mb-4"
            >
              <MenuItem value="port">Port</MenuItem>
              <MenuItem value="dock">Dock</MenuItem>
              <MenuItem value="mooring buoy">Mooring buoy</MenuItem>
              <MenuItem value="wharf">Wharf</MenuItem>
            </Select>

            <Typography variant="subtitle1" className="mb-2">
              Description
            </Typography>
            <TextareaAutosize
              minRows={3}
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4 w-full rounded border p-2"
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
          <SnackbarCustom
            open={snackbarOpen}
            message={snackbarMessage}
            onClose={handleCloseSnackbar}
          />
        </Box>
      </CustomDrawer>
    </Box>
  );
};

export default CreatePoint;

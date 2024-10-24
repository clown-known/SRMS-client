'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import SnackbarCustom from '@/components/Snackbar';
import Loading from '@/components/Loading';
import CustomDrawer from '@/components/Drawer';
import { pointService } from '@/service/pointService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PointDetailsCard from '@/components/points/PointDetailCard';
import PointForm from '@/components/points/PointForm';

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
  const [openDrawer, setOpenDrawer] = useState(true);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/points');
      return;
    }

    const fetchPointDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const point = await pointService.getPointById(id as string);
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

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      setSnackbarMessage('Coordinates must be numbers');
      setSnackbarOpen(true);
      return;
    }

    try {
      const updatedPoint = await pointService.updatePoint(id as string, {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        type,
        description,
      });

      setSnackbarMessage('Point updated successfully');
      setSnackbarOpen(true);
      setTimeout(() => router.push('/points'), 2000);
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
  };

  const getMapCenter = (): [number, number] => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (!isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
    }
    return [0, 0];
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handlePointClick = (point: PointDTO) => {
    setSelectedPoint(point);
    setIsCardVisible(true);
  };

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedPoint(null);
  };

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1 }}>
        <Map
          center={getMapCenter()}
          onMapClick={onMapClick}
          onPointClick={handlePointClick}
        />
        {isCardVisible && selectedPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 80,
              left: openDrawer ? 430 : 50,
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
            Edit Point
          </Typography>

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
            onSubmit={handleSubmit}
            submitButtonText="Update Point"
          />

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

export default PointEdit;

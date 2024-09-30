"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const Map = dynamic(() => import('@/app/components/Map'), { ssr: false });

const PointDetail = () => {
  const [point, setPoint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

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
        setPoint(result.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch point details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPointDetail();
  }, [id, router]);

  const capitalizeString = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="flex">
      <Box className="w-1/2 p-4">
        <Map center={point ? [point.latitude, point.longitude] : undefined} />
      </Box>
      <Box className="w-1/2 p-4">
        <Box className="flex items-center mb-4 cursor-pointer hover:text-sky-600" onClick={() => router.push('/points')}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="body1" className="ml-2">Back to Points</Typography>
        </Box>

        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4">{point?.name || 'Loading...'}</Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: 'black', color: 'white' }} 
            onClick={() => router.push(`/points/${id}/edit`)} 
          >
            Edit Point
          </Button>
        </Box>

        <Box className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-between">
          <Box className="mb-4">
            <Box className="flex items-center">
              <AnchorIcon color="primary" className="mr-1" />
              <Box>
                <Typography variant="body2" className="font-extralight">Type:</Typography>
                <Typography variant="body2" className="font-semibold text-lg">
                  {capitalizeString(point?.type) || 'Loading...'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="mb-4">
            <Box className="flex items-center">
              <LocationOnIcon className="mr-1" />
              <Box>
                <Typography variant="body2" className="font-extralight">Coordinates:</Typography>
                <Typography variant="body2" className="font-semibold text-lg">
                  {point?.latitude.toFixed(3)}, {point?.longitude.toFixed(3)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mb-4">
          <Box className="flex items-center mb-2">
            <DescriptionIcon className="mr-2" />
            <Typography variant="h6">Description</Typography>
          </Box>
          <Typography variant="body1" className="text-lg">
            {point?.description || 'Loading...'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PointDetail;
"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, IconButton } from '@mui/material';
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
        const response = await fetch(`http://localhost:3005/points/${id}`);
        
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
  }, [id]);

  const CapitalizeString = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

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
          <Button variant="contained" sx={{ backgroundColor: 'black', color: 'white' }}>
            Edit Point
          </Button>
        </Box>

        <Box className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-between">
          <Box className="mb-4">
            <Typography variant="body1" className="flex items-center">
              <AnchorIcon color="primary" className="mr-1" />
              <Box>
                <Typography variant="body2" className="font-extralight">Type:</Typography>
                <Typography variant="body2" className="font-semibold text-lg">{CapitalizeString(point?.type) || 'Loading...'}</Typography>
              </Box>
            </Typography>
          </Box>
          <Box className="mb-4">
            <Typography variant="body1" className="flex items-center">
              <LocationOnIcon className="mr-1" />
              <Box>
                <Typography variant="body2" className="font-extralight">Coordinates:</Typography>
                <Typography variant="body2" className="font-semibold text-lg">{point?.latitude}, {point?.longitude}</Typography>
              </Box>
            </Typography>
          </Box>
        </Box>

        <Box className="mb-4">
          <Typography variant="h6" className="flex items-center mb-2">
            <DescriptionIcon className="mr-2 " /> Description
          </Typography>
          <Typography variant="body1" className="text-lg">{point?.description || 'Loading...'}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PointDetail;

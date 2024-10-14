'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from '@/components/Drawer';
import { pointService } from '@/service/pointService';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const PointDetail = () => {
  const [point, setPoint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push('/points');
      return;
    }

    const fetchPointDetail = async () => {
      setIsLoading(true);
      setError('');
      try {
        const result = await pointService.getPointById(id as string);
        setPoint(result);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch point details');
      } finally {
        setIsLoading(false);
      }
    };
    setOpenDrawer(true);
    fetchPointDetail();
  }, [id, router]);

  const capitalizeString = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1 }}>
        <Map center={point ? [point.latitude, point.longitude] : undefined} />
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
          <Box
            className="mb-4 flex cursor-pointer items-center hover:text-sky-600"
            onClick={() => router.push('/points')}
          >
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body1" className="ml-2">
              Back to Points
            </Typography>
          </Box>

          <Box className="mb-4 flex items-center justify-between">
            <Typography variant="h4">{point?.name || 'Loading...'}</Typography>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'black', color: 'white' }}
              onClick={() => router.push(`/points/${id}/edit`)}
            >
              Edit Point
            </Button>
          </Box>

          <Box className="mb-4 flex justify-between rounded-lg bg-gray-100 p-4">
            <Box className="mb-4">
              <Box className="flex items-center">
                <AnchorIcon color="primary" className="mr-1" />
                <Box>
                  <Typography variant="body2" className="font-extralight">
                    Type:
                  </Typography>
                  <Typography variant="body2" className="text-lg font-semibold">
                    {capitalizeString(point?.type) || 'Loading...'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className="mb-4">
              <Box className="flex items-center">
                <LocationOnIcon className="mr-1" />
                <Box>
                  <Typography variant="body2" className="font-extralight">
                    Coordinates:
                  </Typography>
                  <Typography variant="body2" className="text-lg font-semibold">
                    {point?.latitude.toFixed(3)}, {point?.longitude.toFixed(3)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className="mb-4">
            <Box className="mb-2 flex items-center">
              <DescriptionIcon className="mr-2" />
              <Typography variant="h6">Description</Typography>
            </Box>
            <Typography variant="body1" className="text-lg">
              {point?.description || 'Loading...'}
            </Typography>
          </Box>
        </Box>
      </CustomDrawer>
    </Box>
  );
};

export default PointDetail;

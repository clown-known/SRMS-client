"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

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
  description?: string; 
}

const RouteDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useParams(); 
  const [route, setRoute] = useState<Route | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRouteDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3002/routes/${id}`);
      const data = await response.json();

      if (data.statusCode === 200) {
        setRoute(data.data); 
      } else {
        setError(data.message || 'An error occurred');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching route details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRouteDetails();
  }, [id]);

  return (
    <Box className="flex">
      <Box className="w-1/2 p-4">
        {route ? (
          <Map 
            routes={[route]} 
            singleRouteMode={true}
            center={[route.startPoint.latitude, route.startPoint.longitude]}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
      <Box className="w-1/2 p-4">
        <Box className="flex items-center mb-6">
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/routes')}>
            Back to Routes
          </Button>
        </Box>

        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4">{isLoading ? 'Loading...' : route?.name || 'Route not found'}</Typography>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: 'black', color: 'white' }} 
            onClick={() => router.push(`/routes/${id}/edit`)}
            disabled={isLoading || !route}
          >
            Edit Route
          </Button>
        </Box>

        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            {error && <Typography color="error">{error}</Typography>}
            <Box className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-between">
              <Box className="mb-4">
                <Box className="flex items-center">
                  <AnchorIcon color="primary" className="mr-1" />
                  <Box>
                    <Typography variant="body2" className="font-extralight">Start Point:</Typography>
                    <Typography variant="body2" className="font-semibold text-lg">
                      {route?.startPoint?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box className="mb-4">
                <Box className="flex items-center">
                  <LocationOnIcon className="mr-1" />
                  <Box>
                    <Typography variant="body2" className="font-extralight">End Point:</Typography>
                    <Typography variant="body2" className="font-semibold text-lg">
                      {route?.endPoint?.name || 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="bg-gray-100 rounded-lg p-4 mb-4 flex justify-between">
              <Box className="mb-4">
                <Box className="flex items-center">
                  <AnchorIcon color="primary" className="mr-1" />
                  <Box>
                    <Typography variant="body2" className="font-extralight">Distance:</Typography>
                    <Typography variant="body2" className="font-semibold text-lg">
                      {route ? `${route.distance} km` : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="mb-4">
              <Typography variant="h6" className="flex items-center mb-2">
                <DescriptionIcon className="mr-2" /> Description
              </Typography>
              <Typography variant="body1" className="text-lg">
                {route ? route.description : 'N/A'}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default RouteDetail;
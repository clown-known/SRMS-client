'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { calculateTime } from '@/utils/TimeUtils';
import Loading from '@/components/Loading';
import CustomDrawer from '@/components/Drawer';
import { routeService } from '@/service/routeService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PointDetailsCard from '@/components/points/PointDetailCard';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const RouteDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [route, setRoute] = useState<RouteDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const fetchRouteDetails = async () => {
    try {
      const routeData = await routeService.getRouteById(id as string);

      if (routeData) {
        setRoute(routeData);
        const time = calculateTime(routeData.distance);
        setEstimatedTime(time);
      } else {
        throw new Error('Invalid route data structure');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while fetching route details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRouteDetails();
      setOpenDrawer(true);
    }
  }, [id]);

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
        {route ? (
          <Map
            routes={[route]}
            singleRouteMode={true}
            center={[route.startPoint.latitude, route.startPoint.longitude]}
            onPointClick={handlePointClick}
          />
        ) : (
          <Loading />
        )}
        {isCardVisible && selectedPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
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
              onClick={() => router.push('/routes')}
            >
              Back to Routes
            </Button>
          </Box>

          <Box className="mb-4 flex items-center justify-between">
            <Typography variant="h4">
              {isLoading ? 'Loading...' : route?.name || 'Route not found'}
            </Typography>
          </Box>

          {isLoading ? (
            <Loading />
          ) : (
            <>
              {error && <Typography color="error">{error}</Typography>}
              <Box className="mb-4 flex justify-between rounded-lg bg-gray-100 p-4">
                <Box className="mb-4">
                  <Box className="flex items-center">
                    <LocationOnIcon color="primary" className="mr-1" />
                    <Box>
                      <Typography variant="body2" className="font-extralight">
                        Start Point:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-lg font-semibold"
                      >
                        {route?.startPoint?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="mb-4">
                  <Box className="flex items-center">
                    <LocationOnIcon color="error" className="mr-1" />
                    <Box>
                      <Typography variant="body2" className="font-extralight">
                        End Point:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-lg font-semibold"
                      >
                        {route?.endPoint?.name || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box className="mb-4 flex justify-between rounded-lg bg-gray-100 p-4">
                <Box className="mb-4">
                  <Box className="flex items-center">
                    <AnchorIcon color="primary" className="mr-1" />
                    <Box>
                      <Typography variant="body2" className="font-extralight">
                        Distance:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-lg font-semibold"
                      >
                        {route ? `${route.distance} km` : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box className="mb-4">
                  <Box className="flex items-center">
                    <AccessTimeIcon color="primary" className="mr-1" />
                    <Box>
                      <Typography variant="body2" className="font-extralight">
                        Estimated Time:
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-lg font-semibold"
                      >
                        {estimatedTime !== null
                          ? estimatedTime > 24
                            ? `${Math.round(estimatedTime / 24)} day(s)`
                            : `${estimatedTime.toFixed(2)} hour(s)`
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box className="mb-4">
                <Typography variant="h6" className="mb-2 flex items-center">
                  <DescriptionIcon className="mr-2" /> Description
                </Typography>
                <Typography variant="body1" className="text-lg">
                  {route ? route.description : 'N/A'}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </CustomDrawer>
    </Box>
  );
};

export default RouteDetail;

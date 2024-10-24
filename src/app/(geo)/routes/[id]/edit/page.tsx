'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dynamic from 'next/dynamic';
import { calculateDistance } from '@/utils/distanceUtils';
import SnackbarCustom from '@/components/Snackbar';
import Loading from '@/components/Loading';
import { calculateTime } from '@/utils/TimeUtils';
import { debounceFetching } from '@/utils/debounceFetch';
import CustomDrawer from '@/components/Drawer';
import RouteForm from '@/components/route/RouteForm';
import PointSelectionDialog from '@/components/route/PointSelection';
import { routeService } from '@/service/routeService';
import { pointService } from '@/service/pointService';
import PointDetailsCard from '@/components/points/PointDetailCard';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const RouteEdit = () => {
  const { id } = useParams();
  const router = useRouter();
  const [routeName, setRouteName] = useState('');
  const [description, setDescription] = useState('');
  const [startPointName, setStartPointName] = useState('');
  const [endPointName, setEndPointName] = useState('');
  const [distance, setDistance] = useState<number | string>('');
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [route, setRoute] = useState<RouteDTO | null>(null);
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'start' | 'end'>('start');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const fetchPoints = async (search: string = '') => {
    try {
      setIsLoading(true);
      const response = await pointService.getAllPoints(1, 50, search);

      if (response && response.data && response.data.data) {
        setPoints(response.data.data);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      setError('Error fetching points');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (type: 'start' | 'end') => {
    setDialogType(type);
    setDialogOpen(true);
    setSearchTerm('');
    fetchPoints();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      fetchPoints(searchTerm);
    }
  };

  const updateRouteOnMap = useCallback(
    (newStartPoint: PointDTO | null, newEndPoint: PointDTO | null) => {
      if (!route) return;

      const updatedRoute = { ...route };
      if (newStartPoint) {
        updatedRoute.startPoint = newStartPoint;
      }
      if (newEndPoint) {
        updatedRoute.endPoint = newEndPoint;
      }

      setRoute(updatedRoute);
    },
    [route]
  );

  const handleSelectPoint = useCallback(
    (point: PointDTO) => {
      if (dialogType === 'start') {
        setStartPointId(point.id);
        setStartPointName(point.name);
        if (endPointId) {
          const distance = calculateDistance(
            point.latitude,
            point.longitude,
            route?.endPoint.latitude || 0,
            route?.endPoint.longitude || 0
          );
          const estimatedTime = calculateTime(distance);
          setEstimatedTime(estimatedTime);
          setDistance(distance.toFixed(2));
        }
        updateRouteOnMap(point, null);
      } else {
        setEndPointId(point.id);
        setEndPointName(point.name);
        if (startPointId) {
          const distance = calculateDistance(
            route?.startPoint.latitude || 0,
            route?.startPoint.longitude || 0,
            point.latitude,
            point.longitude
          );
          setDistance(distance.toFixed(2));
          const estimatedTime = calculateTime(distance);
          setEstimatedTime(estimatedTime);
        }
        updateRouteOnMap(null, point);
      }
      handleCloseDialog();
    },
    [dialogType, endPointId, startPointId, route, updateRouteOnMap]
  );

  useEffect(() => {
    fetchRouteDetails();
    setOpenDrawer(true);
  }, [id]);

  const fetchRouteDetails = useCallback(async () => {
    try {
      if (!id) {
        throw new Error('Route ID is missing');
      }

      const routeData = await routeService.getRouteById(id as string);
      const estimatedTime = calculateTime(routeData.distance);

      setRouteName(routeData.name);
      setDescription(routeData.description || '');
      setStartPointName(routeData.startPoint.name);
      setEndPointName(routeData.endPoint.name);
      setDistance(routeData.distance);
      setStartPointId(routeData.startPoint.id);
      setEndPointId(routeData.endPoint.id);
      setEstimatedTime(estimatedTime);
      setRoute(routeData);
    } catch (error) {
      console.error('Error loading route details:', error);
      setSnackbarMessage('Error loading route details');
      setSnackbarOpen(true);
    }
  }, [id]);

  const handleUpdateRoute = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!routeName.trim() || !startPointId || !endPointId) {
      setSnackbarMessage(
        'Please fill in all required fields before updating the route.'
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      const startPoint = await pointService.getPointById(startPointId);
      const endPoint = await pointService.getPointById(endPointId);

      const routeData: Partial<RouteDTO> = {
        name: routeName.trim(),
        description: description.trim(),
        startPoint,
        estimatedTime,
        endPoint,
        distance: Number(distance),
        points: [startPoint, endPoint],
      };

      const updatedRoute = await routeService.updateRoute(
        id as string,
        routeData
      );

      setSnackbarMessage('Route updated successfully!');
      setSnackbarOpen(true);

      setRoute(updatedRoute);

      setTimeout(() => {
        router.push('/routes');
      }, 2000);
    } catch (error) {
      console.error('Error updating route:', error);
      setSnackbarMessage(`Error updating route: ${(error as Error).message}`);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchRouteDetails();
  }, [id]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedPoint(null);
  };

  const handlePointClick = (point: PointDTO) => {
    setSelectedPoint(point);
    setIsCardVisible(true);
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

          <Typography variant="h4" component="h1" className="mb-6">
            Edit Route
          </Typography>

          <RouteForm
            routeName={routeName}
            setRouteName={setRouteName}
            startPointName={startPointName}
            endPointName={endPointName}
            handleOpenDialog={handleOpenDialog}
            distance={distance}
            estimatedTime={estimatedTime}
            description={description}
            setDescription={setDescription}
            handleSubmit={handleUpdateRoute}
            submitButtonText="Update Route"
          />

          <PointSelectionDialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            dialogType={dialogType}
            searchTerm={searchTerm}
            handleSearch={handleSearchChange}
            handleKeyDown={handleSearchKeyDown}
            isLoading={isLoading}
            error={error}
            points={points}
            handleSelectPoint={handleSelectPoint}
          />

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

export default RouteEdit;

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  TextField,
  Snackbar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  DialogActions,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CustomInput from '@/components/CustomInput';
import dynamic from 'next/dynamic';
import { calculateDistance } from '@/utils/distanceUtils';
import SnackbarCustom from '@/components/Snackbar';
import Loading from '@/components/Loading';
import { calculateTime } from '@/utils/TimeUtils';
import { debounceFetching } from '@/utils/debounceFetch';
import MenuIcon from '@mui/icons-material/Menu';
import CustomDrawer from '@/components/Drawer';
import RouteForm from '@/components/route/RouteForm';
import PointSelectionDialog from '@/components/route/PointSelection';
import { routeService } from '@/service/routeService';
import { pointService } from '@/service/pointService';

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

  const fetchPoints = async (search: string = '') => {
    try {
      setIsLoading(true);
      const response = await pointService.getAllPoints(1, 10, search); 

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

  const debouncedFetchPoints = debounceFetching((search: string) => {
    fetchPoints(search);
  }, 2000);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    debouncedFetchPoints(searchTerm);
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
          const endPoint = points.find((p) => p.id === endPointId);
          if (endPoint) {
            const distance = calculateDistance(
              point.latitude,
              point.longitude,
              endPoint.latitude,
              endPoint.longitude
            );
            const estimatedTime = calculateTime(distance);
            setEstimatedTime(estimatedTime);
            setDistance(distance.toFixed(2));
          }
        }
        updateRouteOnMap(point, null);
      } else {
        setEndPointId(point.id);
        setEndPointName(point.name);
        if (startPointId) {
          const startPoint = points.find((p) => p.id === startPointId);
          if (startPoint) {
            const distance = calculateDistance(
              startPoint.latitude,
              startPoint.longitude,
              point.latitude,
              point.longitude
            );
            setDistance(distance.toFixed(2));
            const estimatedTime = calculateTime(distance);
            setEstimatedTime(estimatedTime);
          }
        }
        updateRouteOnMap(null, point);
      }
      handleCloseDialog();
    },
    [dialogType, endPointId, points, startPointId, updateRouteOnMap]
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

  return (
    <Box sx={{ display: 'flex', height: '91vh', overflow: 'hidden' }}>
      <Box sx={{ flex: 1 }}>
        {route ? (
          <Map
            routes={[route]}
            singleRouteMode={true}
            center={[route.startPoint.latitude, route.startPoint.longitude]}
            
          />
        ) : (
          <Loading />
        )}
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
            handleSearch={handleSearch}
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

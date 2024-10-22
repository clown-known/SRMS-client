'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { pointService } from '@/service/pointService';
import { CreateRouteDTO, routeService } from '@/service/routeService';
import { calculateDistance } from '@/utils/distanceUtils';
import { calculateTime } from '@/utils/TimeUtils';
import { debounceFetching } from '@/utils/debounceFetch';
import SnackbarCustom from '@/components/Snackbar';
import CustomDrawer from '@/components/Drawer';
import PointSelectionDialog from '@/components/route/PointSelection';
import RouteForm from '@/components/route/RouteForm';
import PointDetailsCard from '../points/PointDetailCard';

interface RouteCreateProps {
  open: boolean;
  onClose: () => void;
  onRouteCreated: () => void;
}

const RouteCreate: React.FC<RouteCreateProps> = ({ open, onClose, onRouteCreated }) => {
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [startPointName, setStartPointName] = useState<string>('');
  const [endPointName, setEndPointName] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'start' | 'end'>('start');
  const [searchTerm, setSearchTerm] = useState('');
  const [routeName, setRouteName] = useState('');
  const [distance, setDistance] = useState<number | string>('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [selectedPoint, setSelectedPoint] = useState<PointDTO | null>(null);
  const [isCardVisible, setIsCardVisible] = useState(false);

  const fetchPoints = async (search: string = '') => {
    try {
      setIsLoading(true);
      const response = await pointService.getAllPoints(1, 10, search);

      if (response.data && response.data.data) {
        setPoints(response.data.data);
      } else {
        throw new Error('Invalid data structure');
      }
    } catch (error) {
      console.error('Error fetching points:', error);
      setSnackbarMessage('Error fetching points');
      setSnackbarOpen(true);
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
      }
      handleCloseDialog();
    },
    [dialogType, endPointId, points, startPointId]
  );

  const handleCreateRoute = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!routeName || !startPointId || !endPointId || !distance) {
      setSnackbarMessage('Please fill in all fields before creating the route.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const routeData: CreateRouteDTO = {
        name: routeName,
        description,
        startPointId: startPointId,
        endPointId: endPointId,
        distance: Number(distance),
        estimatedTime,
      };

      await routeService.createRoute(routeData);
      setSnackbarMessage('Route created successfully!');
      setSnackbarOpen(true);
      onRouteCreated();
    } catch (error) {
      setSnackbarMessage(`Error creating route`);
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handlePointClick = (point: PointDTO) => {
    setSelectedPoint(point);
    setIsCardVisible(true);
  };

  const handleCloseCard = () => {
    setIsCardVisible(false);
    setSelectedPoint(null);
  };

  return (
    <CustomDrawer open={open} onClose={onClose} width={400} maxWidth={400}>
      <Box>
        <Box className="mb-6 flex items-center">
          <Button startIcon={<ArrowBackIcon />} onClick={onClose}>
            Back to Routes
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Create Route
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
          handleSubmit={handleCreateRoute}
          submitButtonText="Create Route"
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

        <SnackbarCustom
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
        />

        {isCardVisible && selectedPoint && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 430,
              zIndex: 1000,
              transition: 'left 0.3s ease-in-out',
            }}
          >
            <PointDetailsCard point={selectedPoint} onClose={handleCloseCard} />
          </Box>
        )}
      </Box>
    </CustomDrawer>
  );
};

export default RouteCreate;
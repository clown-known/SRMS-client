'use client';

import React, { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import CustomInput from '@/components/CustomInput';
import { calculateDistance } from '@/utils/distanceUtils';
import SnackbarCustom from '@/components/Snackbar';
import { calculateTime } from '@/utils/TimeUtils';
import { debounceFetching } from '@/utils/debounceFetch';

const Map = dynamic(() => import('@/components/geo/Map'), { ssr: false });

const RouteCreate = () => {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [route, setRoute] = useState<RouteDTO | null>(null);
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

  const fetchPoints = async (search: string = '') => {
    try {
      setIsLoading(true);
      const searchParam = search
        ? `searchKey=${encodeURIComponent(search)}`
        : '';
      const response = await fetch(
        `http://localhost:3002/points?${searchParam}`
      );
      if (!response.ok) {
        throw new Error('Fetch Point Error');
      }
      const responseData = await response.json();

      if (
        responseData.statusCode === 200 &&
        responseData.data &&
        responseData.data.data
      ) {
        setPoints(responseData.data.data);
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

  const TimeDisplay =
    estimatedTime > 24
      ? `${Math.round(estimatedTime / 24)} day(s)`
      : `${estimatedTime.toFixed(2)} hour(s)`;

  const handleCreateRoute = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!routeName || !startPointId || !endPointId || !distance) {
      setSnackbarMessage(
        'Please fill in all fields before creating the route.'
      );
      setSnackbarOpen(true);
      return;
    }

    try {
      const routeData = {
        startPointId: startPointId,
        endPointId: endPointId,
        description,
        name: routeName,
        distance: Math.round(Number(distance)),
        estimatedTime,
      };

      console.log('Sending route data:', routeData);

      const response = await fetch('http://localhost:3002/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(
          'Failed to create route: ' + errorData.message || 'Unknown error'
        );
      }

      const data = await response.json();
      setSnackbarMessage('Route created successfully!');
      setSnackbarOpen(true);
      router.push('/routes');
    } catch (error) {
      console.error('Error creating route');
      setSnackbarMessage('Error creating route');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="flex h-screen">
      <Box className="w-1/2 p-4">
        <Map moveToCurrentLocation={true} />
      </Box>
      <Box className="w-1/2 overflow-y-auto p-8">
        <Box className="mb-6 flex items-center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/routes')}
          >
            Back to Routes
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Create Route
        </Typography>

        <form onSubmit={handleCreateRoute}>
          <CustomInput
            label="Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />

          <Grid container spacing={2} className="mb-4">
            <Grid item xs={6}>
              <Typography variant="subtitle1" className="mb-2">
                Start Point
              </Typography>
              <TextField
                fullWidth
                value={startPointName}
                onClick={() => handleOpenDialog('start')}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1" className="mb-2">
                End Point
              </Typography>
              <TextField
                fullWidth
                value={endPointName}
                onClick={() => handleOpenDialog('end')}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <CustomInput
            label="Distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            disabled={true}
          />
          <CustomInput
            label="Estimated Time"
            value={TimeDisplay}
            disabled={true}
          />
          <Typography variant="subtitle1" className="mb-2">
            Description
          </Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter description"
            className="mb-4 w-full rounded border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            className="mt-4"
          >
            Create Route
          </Button>
        </form>

        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="dialog-title"
        >
          <DialogTitle>
            {dialogType === 'start' ? 'Select Start Point' : 'Select End Point'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Search Points"
              type="text"
              fullWidth
              variant="standard"
              value={searchTerm}
              onChange={handleSearch}
            />
            <List>
              {isLoading && (
                <ListItemButton>
                  <ListItemText primary="Loading..." />
                </ListItemButton>
              )}
              {error && (
                <ListItemButton>
                  <ListItemText primary={error} />
                </ListItemButton>
              )}
              {!isLoading && !error && points.length > 0 ? (
                points.map((point) => (
                  <ListItemButton
                    key={point.id}
                    onClick={() => handleSelectPoint(point)}
                  >
                    <ListItemText primary={point.name} />
                  </ListItemButton>
                ))
              ) : (
                <ListItemButton>
                  <ListItemText primary="No points found" />
                </ListItemButton>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for display validation error*/}
        <SnackbarCustom
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
        />
      </Box>
    </Box>
  );
};

export default RouteCreate;

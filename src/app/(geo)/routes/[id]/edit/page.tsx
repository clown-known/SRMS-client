"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Typography, TextareaAutosize, TextField, Snackbar, Grid, Dialog, DialogTitle, DialogContent, List, ListItemButton, ListItemText, DialogActions, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomInput from "@/components/CustomInput";
import dynamic from "next/dynamic";
import { calculateDistance } from "@/app/utils/distanceUtils";

const Map = dynamic(() => import("@/components/geo/Map"), { ssr: false });

interface Point {
  id: string;
  name: string;
  type: string;
  distance: number;
  latitude: number;
  longitude: number;
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

const RouteEdit = () => {
  const { id } = useParams();
  const router = useRouter();
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [startPointName, setStartPointName] = useState("");
  const [endPointName, setEndPointName] = useState("");
  const [distance, setDistance] = useState<number | string>("");
  const [points, setPoints] = useState<Point[]>([]);
  const [route, setRoute] = useState<Route | null>(null);
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"start" | "end">("start");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRouteDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3002/routes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch route details");
      }
      const routeData = await response.json();

      setRouteName(routeData.data.name);
      setDescription(routeData.data.description || "");
      setStartPointName(routeData.data.startPoint.name);
      setEndPointName(routeData.data.endPoint.name);
      setDistance(routeData.data.distance);
      setStartPointId(routeData.data.startPoint.id);
      setEndPointId(routeData.data.endPoint.id);
      setRoute(routeData.data);
    } catch (error) {
      setSnackbarMessage("Error fetching route details");
      setSnackbarOpen(true);
    }
  };

  const fetchPoints = async (search: string = "") => {
    try {
      setIsLoading(true);
      const searchParam = search ? `searchKey=${encodeURIComponent(search)}` : "";
      const response = await fetch(`http://localhost:3002/points?${searchParam}`);
      if (!response.ok) {
        throw new Error("Fetch Point Error");
      }
      const responseData = await response.json();

      if (responseData.statusCode === 200 && responseData.data && responseData.data.data) {
        setPoints(responseData.data.data);
      } else {
        throw new Error("Invalid data structure");
      }
    } catch (error) {
      setError("Error fetching points");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (type: "start" | "end") => {
    setDialogType(type);
    setDialogOpen(true);
    setSearchTerm("");
    fetchPoints();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    fetchPoints(searchTerm);
  };

  const handleSelectPoint = (point: Point) => {
    if (dialogType === "start") {
      setStartPointId(point.id);
      setStartPointName(point.name);
      if (endPointId) {
        const endPoint = points.find((p) => p.id === endPointId);
        if (endPoint) {
          const distance = calculateDistance(point.latitude, point.longitude, endPoint.latitude, endPoint.longitude);
          setDistance(distance.toFixed(2));
        }
      }
    } else {
      setEndPointId(point.id);
      setEndPointName(point.name);
      if (startPointId) {
        const startPoint = points.find((p) => p.id === startPointId);
        if (startPoint) {
          const distance = calculateDistance(startPoint.latitude, startPoint.longitude, point.latitude, point.longitude);
          setDistance(distance.toFixed(2));
        }
      }
    }
    handleCloseDialog();
  };

  const handleUpdateRoute = async (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!routeName.trim() || !startPointId || !endPointId) {
      setSnackbarMessage("Please fill in all required fields before updating the route.");
      setSnackbarOpen(true);
      return;
    }
  
    const routeData = {
      name: routeName.trim(),
      description: description.trim(),
      startPoint: startPointId,
      endPoint: endPointId, 
      distance: String(distance),
    };
  
    // console.log(routeData);
  
    try {
      const response = await fetch(`http://localhost:3002/routes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // console.error(errorData); 
        throw new Error(errorData.message || "Failed to update route");
      }
  
      setSnackbarMessage("Route updated successfully!");
      setSnackbarOpen(true);
  
      setTimeout(() => {
        router.push('/routes');
      }, 1000);
    } catch (error) {
      setSnackbarMessage(`Error updating route`);
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
    <Box className="flex h-screen">
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
      <Box className="w-1/2 p-8 overflow-y-auto">
        <Box className="flex items-center mb-6">
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/routes")}>
            Back to Routes
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Edit Route
        </Typography>

        <form onSubmit={handleUpdateRoute}>
          <CustomInput
            label="Route Name"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />

          <Grid container spacing={2} className="mb-4">
            <Grid item xs={6}>
              <Typography variant="subtitle1" className="mb-2">Start Point</Typography>
              <TextField
                fullWidth
                value={startPointName}
                onClick={() => handleOpenDialog("start")}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={6}>
              <Typography variant="subtitle1" className="mb-2">End Point</Typography>
              <TextField
                fullWidth
                value={endPointName} 
                onClick={() => handleOpenDialog("end")}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <CustomInput
            label="Distance"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            type="number"
            disabled={true}
          />

          <Typography variant="subtitle1" className="mb-2">Description</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter description"
            className="w-full p-2 border rounded mb-4"
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
            Update Route
          </Button>
        </form>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} aria-labelledby="dialog-title">
          <DialogTitle>{dialogType === "start" ? "Select Start Point" : "Select End Point"}</DialogTitle>
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
              {isLoading && <ListItemButton><ListItemText primary="Loading..." /></ListItemButton>}
              {error && <ListItemButton><ListItemText primary={error} /></ListItemButton>}
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
                <ListItemButton><ListItemText primary="No points found" /></ListItemButton>
              )}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>


        <Snackbar
          open={snackbarOpen}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          ContentProps={{
            style: {
              backgroundColor: snackbarMessage.includes('successfully') ? '#4caf50' : '#f44336',
              color: '#fff',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default RouteEdit;

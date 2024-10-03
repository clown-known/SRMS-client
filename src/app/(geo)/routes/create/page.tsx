"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { 
  Box, Button, Typography, TextareaAutosize, Grid, Snackbar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItemText,
  ListItemButton
} from "@mui/material";
import ListItem from '@mui/material/ListItem';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import CustomInput from "@/app/components/CustomInput";
import { haversineDistance } from "@/app/utils/distanceUtils";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

interface Point {
  id: string;
  name: string;
  type: string;
  distance: number;
  latitude: number;
  longitude: number;
}

const RouteCreate = () => {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState<Point[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [startPointId, setStartPointId] = useState<string | null>(null);
  const [endPointId, setEndPointId] = useState<string | null>(null);
  const [startPointName, setStartPointName] = useState<string>("");
  const [endPointName, setEndPointName] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"start" | "end">("start");
  const [searchTerm, setSearchTerm] = useState("");
  const [routeName, setRouteName] = useState("");
  const [distance, setDistance] = useState<number | string>("");
  const isButton = true;

  const fetchPoints = async (search: string = "") => {
    try {
      setIsLoading(true);
      const searchParam = search ? `searchKey=${encodeURIComponent(search)}` : '';
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
        const endPoint = points.find(p => p.id === endPointId);
        if (endPoint) {
          const distance = haversineDistance(point.latitude, point.longitude, endPoint.latitude, endPoint.longitude);
          setDistance(distance.toFixed(2)); 
        }
      }
    } else {
      setEndPointId(point.id);
      setEndPointName(point.name);
      if (startPointId) {
        const startPoint = points.find(p => p.id === startPointId);
        if (startPoint) {
          const distance = haversineDistance(startPoint.latitude, startPoint.longitude, point.latitude, point.longitude);
          setDistance(distance.toFixed(2));
        }
      }
    }
    handleCloseDialog();
  };

  const handleCreateRoute = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      const routeData = {
        startPointId: startPointId,
        endPointId: endPointId,
        description,
        name: routeName,
        distance: Math.round(Number(distance)),
      };
  
      console.log("Sending route data:", routeData);
  
      const response = await fetch("http://localhost:3002/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Failed to create route: " + errorData.message || "Unknown error");
      }
  
      const data = await response.json();
      setSnackbarMessage("Route created successfully!");
      setSnackbarOpen(true);
      router.push('/routes');
  
    } catch (error) {
      console.error("Error creating route");
      setSnackbarMessage("Error creating route");
      setSnackbarOpen(true);
    }
  };
  
  
  

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box className="flex h-screen">
      <Box className="w-1/2 p-4">
        <Map moveToCurrentLocation={true} />
      </Box>
      <Box className="w-1/2 p-8 overflow-y-auto">
        <Box className="flex items-center mb-6">
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/routes")}>
            Back to Routes
          </Button>
        </Box>

        <Typography variant="h4" component="h1" className="mb-6">
          Create Route
        </Typography>

        <form onSubmit={handleCreateRoute}>
          <CustomInput label="Route Name" value={routeName} onChange={(e) => setRouteName(e.target.value)} />

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

          <CustomInput label="Distance" type="number" value={distance} onChange={(e) => setDistance(e.target.value)} disabled={true} />

          <Typography variant="subtitle1" className="mb-2">Description</Typography>
          <TextareaAutosize
            minRows={3}
            placeholder="Enter description"
            className="w-full p-2 border rounded mb-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button variant="contained" color="primary" fullWidth type="submit" className="mt-4">
            Create Route
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
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Box>
    </Box>
  );
};

export default RouteCreate;

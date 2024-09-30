"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Button, Typography, TextareaAutosize, TextField, Snackbar, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomInput from "@/app/components/CustomInput";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

const RouteEdit = () => {
  const { id } = useParams();  
  const router = useRouter();
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [startPointName, setStartPointName] = useState("");
  const [endPointName, setEndPointName] = useState("");
  const [distance, setDistance] = useState<number | string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchRouteDetails(); 
  }, []);
  
  const fetchRouteDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3002/routes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch route details");
      }
      const routeData = await response.json();

      setRouteName(routeData.data.name);
      setDescription(routeData.data.description);
      setStartPointName(routeData.data.startPoint.name); 
      setEndPointName(routeData.data.endPoint.name);  
      setDistance(routeData.data.distance); 
    } catch (error) {
      setSnackbarMessage("Error fetching route details");
      setSnackbarOpen(true);
    }
  };

  const handleUpdateRoute = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const routeData = {
        name: routeName,
        description,
        startPointName,
        endPointName,
        distance: Number(distance),
      };

      const response = await fetch(`http://localhost:3002/routes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        throw new Error("Failed to update route");
      }

      setSnackbarMessage("Route updated successfully!");
      setSnackbarOpen(true);
      router.push("/routes");  
    } catch (error) {
      console.error("Error updating route:", error);
      setSnackbarMessage("Error updating route");
      setSnackbarOpen(true);
    }
  };

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
                InputProps={{ readOnly: true }} 
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" className="mb-2">End Point</Typography>
              <TextField
                fullWidth
                value={endPointName} 
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          <CustomInput 
            label="Distance" 
            value={distance} 
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
            className="mt-4">
            Update Route
          </Button>
        </form>

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

export default RouteEdit;

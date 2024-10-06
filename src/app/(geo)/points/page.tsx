"use client";

import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, TextField, Typography, Pagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from "@mui/material";
import AnchorIcon from "@mui/icons-material/Anchor";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaginationCustom from "@/components/Pagination";
import { pointService } from "@/service/pointService";

// Load the map component
const Map = dynamic(() => import("@/components/geo/Map"), { ssr: false });

const Points = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchKey") || "");
  const [points, setPoints] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  
  // Set initial page number from search params
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch points
  const fetchPoints = useCallback(async (currentPage: number, searchKey: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await pointService.getAllPoints(currentPage, 3, searchKey);

      if (response.data?.data) {
        setPoints(response.data.data);
        setTotalPages(Math.ceil(response.data.meta.itemCount / 3));
      } else {
        throw new Error("Unexpected data structure");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch points");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPoints(page, searchParams.get("searchKey") || "");
  }, [page, searchParams, fetchPoints]);

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Submit search on button click or Enter key press
  const handleSearchSubmit = () => {
    router.push(`/points?page=1&searchKey=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearchSubmit();
  };


  // Delete point
  const handleDelete = async () => {
    if (!selectedPointId) return;
    try {
      const response = await fetch(`http://localhost:3002/points/${selectedPointId}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`Failed to delete point. Status: ${response.status}`);

      fetchPoints(page, searchTerm); // Refresh points after deletion
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || "Failed to delete point");
    }
  };

  // Capitalize first letter
  const capitalizeString = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

  // Open and close dialog delete confirmation
  const handleOpenDialog = (id: string) => {
    setSelectedPointId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedPointId(null);
  };

  return (
    <Box className="flex">
      <Box className="w-1/2 p-4">
        {/* Map move to current location automatically */}
        <Map moveToCurrentLocation={true} />
      </Box>
      <Box className="w-1/2 p-4">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4">Shipping Points</Typography>
          <Button variant="contained" sx={{ backgroundColor: "black", color: "white" }} onClick={() => router.push("/points/create")}>
            Add Point
          </Button>
        </Box>
        <Box className="flex mb-4 mt-2">
          <TextField
            variant="outlined"
            placeholder="Search points..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            fullWidth
            sx={{ borderRadius: "30px" }}
          />
          <Button variant="contained" onClick={handleSearchSubmit} sx={{ ml: 2 }}>
            Search
          </Button>
        </Box>
        <Box className="mt-6">
          {isLoading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          {!isLoading && !error && points.length === 0 && <Typography>No points available</Typography>}

          {!isLoading &&
            !error &&
            points.length > 0 &&
            points.map((point) => (
              <Box key={point.id} className="bg-white shadow-md rounded-lg p-4 mt-4">
                <Box className="flex items-center mb-2">
                  <Typography variant="h6" className="ml-2">
                    {point.name}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  <AnchorIcon color="primary" /> {capitalizeString(point.type)}
                </Typography>
                <Typography variant="body2">
                  <LocationOnIcon /> {point.latitude.toFixed(3)}, {point.longitude.toFixed(3)}
                </Typography>
                <Box className="mt-2">
                  <Button variant="contained" onClick={() => router.push(`/points/${point.id}`)}>
                    View Details
                  </Button>
                  <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={() => handleOpenDialog(point.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </Box>

        <Box className="mt-4 flex justify-center">
        <PaginationCustom 
            totalPages={totalPages} 
            currentPage={page} 
            searchKey={searchTerm} 
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>{"Delete Confirmation"}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this point permanently?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>No</Button>
            <Button onClick={handleDelete} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Points;

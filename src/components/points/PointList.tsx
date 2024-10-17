import React from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Divider, Paper } from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useRouter } from 'next/navigation';

interface PointsListProps {
  points: PointDTO[];
  isLoading: boolean;
  error: string;
  capitalizeString: (str: string) => string;
  handleOpenDialog: (id: string) => void;
}

const PointsList = ({
  points,
  isLoading,
  error,
  capitalizeString,
  handleOpenDialog,
}: PointsListProps) => {
  const router = useRouter();

  return (
    <Box className="mt-6">
      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!isLoading && !error && points.length === 0 && (
        <Typography>No points available</Typography>
      )}

      {!isLoading &&
        !error &&
        points.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {points.map((point) => (
                  <TableRow key={point.id}>
                    {/* Left column: Point Information */}
                    <TableCell>
                      <Box>
                        <Typography variant="h6">{point.name}</Typography>
                        <Typography variant="body2">
                          <AnchorIcon color="primary" /> {capitalizeString(point.type)}
                        </Typography>
                        <Typography variant="body2">
                          <LocationOnIcon /> {point.latitude.toFixed(3)}, {point.longitude.toFixed(3)}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Divider */}
                    <TableCell>
                      <Divider orientation="vertical" />
                    </TableCell>

                    {/* Right column: Buttons */}
                    <TableCell>
                      <Box>
                        <Button
                          variant="contained"
                          onClick={() => router.push(`/points/${point.id}/edit`)}
                          sx={{ mb: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDialog(point.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
    </Box>
  );
};

export default PointsList;

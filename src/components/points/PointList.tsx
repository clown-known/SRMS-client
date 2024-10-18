import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Paper,
  IconButton,
} from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useRouter } from 'next/navigation';
import { Delete, Edit } from '@mui/icons-material';
import Loading from '../Loading';

interface PointsListProps {
  points: PointDTO[];
  isLoading: boolean;
  error: string;
  capitalizeString: (str: string) => string;
  handleOpenDialog: (id: string) => void;
  handlePointClick: (point: PointDTO) => void;
}

const PointsList = ({
  points,
  isLoading,
  error,
  capitalizeString,
  handleOpenDialog,
  handlePointClick,
}: PointsListProps) => {
  const router = useRouter();

  return (
    <Box className="mt-6">
      {isLoading && <Loading />}
      {error && <Typography color="error">{error}</Typography>}
      {!isLoading && !error && points.length === 0 && (
        <Typography>No points available</Typography>
      )}

      {!isLoading && !error && points.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: '540px', overflowY: 'auto' }}
        >
          <Table stickyHeader>
            <TableBody>
              {points.map((point) => (
                <TableRow
                  key={point.id}
                  hover
                  onDoubleClick={() => handlePointClick(point)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Box>
                      <Typography variant="h6">{point.name}</Typography>
                      <Typography variant="body2">
                        <AnchorIcon color="primary" />{' '}
                        {capitalizeString(point.type)}
                      </Typography>
                      <Typography variant="body2">
                        <LocationOnIcon /> {point.latitude.toFixed(3)},{' '}
                        {point.longitude.toFixed(3)}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Divider orientation="vertical" />
                  </TableCell>

                  <TableCell>
                    <Box>
                      <IconButton
                        onClick={() => router.push(`/points/${point.id}/edit`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDialog(point.id)}>
                        <Delete />
                      </IconButton>
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

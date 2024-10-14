import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import PaginationCustom from '@/components/Pagination';
import Loading from '@/components/Loading';

interface RoutesDialogProps {
  open: boolean;
  onClose: () => void;
  routes: RouteDTO[];
  isLoading: boolean;
  error: string;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleDeleteClick: (id: string) => void;
  handleCheckboxChange: (routeId: string) => void;
  selectedRoutes: string[];
  totalPages: number;
  currentPage: number;
}

const RoutesDialog = ({
  open,
  onClose,
  routes,
  isLoading,
  error,
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  handleKeyPress,
  handleDeleteClick,
  handleCheckboxChange,
  selectedRoutes,
  totalPages,
  currentPage,
}: RoutesDialogProps) => {
  const router = useRouter();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          height: '92vh',
          // maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Shipping Routes</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ height: 'calc(100% - 64px)', overflow: 'auto' }}>
        <Box className="mb-4 mt-2 flex">
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', mb: 2 }}
            onClick={() => router.push('/routes/create')}
          >
            Add Routes
          </Button>
        </Box>
        <Box className="mb-4 mt-2 flex">
          <TextField
            variant="outlined"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleKeyPress}
            fullWidth
            sx={{ borderRadius: '30px' }}
          />
          <Button
            variant="contained"
            onClick={handleSearchSubmit}
            sx={{ ml: 2 }}
          >
            Search
          </Button>
        </Box>
        <Box className="mt-5" sx={{ height: 'calc(100% - 210px)', overflow: 'auto' }}>
          {isLoading && <Loading />}
          {!isLoading && error && (
            <Typography color="error">{error}</Typography>
          )}
          {!isLoading && !error && routes.length > 0 && (
            <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ width: '1%' }}></TableCell>
                    <TableCell sx={{ width: '25%' }}>Name</TableCell>
                    <TableCell sx={{ width: '25%' }}>Start Point</TableCell>
                    <TableCell sx={{ width: '25%' }}>End Point</TableCell>
                    <TableCell sx={{ width: '20%' }}>Distance (km)</TableCell>
                    <TableCell sx={{ width: '1%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {routes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRoutes.includes(route.id)}
                          onChange={() => handleCheckboxChange(route.id)}
                        />
                      </TableCell>
                      <TableCell>{route.name}</TableCell>
                      <TableCell>{route.startPoint?.name || 'N/A'}</TableCell>
                      <TableCell>{route.endPoint?.name || 'N/A'}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <IconButton
                            onClick={() => router.push(`/routes/${route.id}`)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(route.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {!isLoading && !error && routes.length === 0 && (
            <Typography>
              Cannot find any route on this page!
            </Typography>
          )}
        </Box>
        <Box className="mt-4 flex justify-center">
          <PaginationCustom
            totalPages={totalPages}
            currentPage={currentPage}
            searchKey={searchTerm}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RoutesDialog;
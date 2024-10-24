import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { grey } from '@mui/material/colors';
import PaginationCustom from '@/components/Pagination';
import Loading from '@/components/Loading';
import CustomDrawer from '../Drawer';
import SearchInput from '../geo/SearchInput';
import { useRouter } from 'next/navigation';
import { Permission } from '@/app/lib/enum';
import { RootState, useAppDispatch } from '@/store/store';
import { useSelector } from 'react-redux';

interface RoutesDrawerProps {
  open: boolean;
  onClose: () => void;
  routes: RouteDTO[];
  isLoading: boolean;
  error: string;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: () => void;
  handleDeleteClick: (id: string) => void;
  handleCheckboxChange: (routeId: string) => void;
  selectedRoutes: string[];
  totalPages: number;
  currentPage: number;
  onAddNewRoute: () => void;
}

const RoutesDrawer: React.FC<RoutesDrawerProps> = ({
  open,
  onClose,
  routes,
  isLoading,
  error,
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  handleDeleteClick,
  handleCheckboxChange,
  selectedRoutes,
  totalPages,
  currentPage,
  onAddNewRoute,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const permission = useSelector((state: RootState) => state.user.permissions);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleRowClick = (routeId: string) => {
    handleCheckboxChange(routeId);
  };

  const hasPermission = (permissionRequired: string) => {
    return permission.includes(permissionRequired);
  };

  return (
    <CustomDrawer open={open} onClose={onClose} width={730} maxWidth={730}>
      <Box className="mb-4 mt-2 flex items-center justify-between">
        <Box className="mr-40 flex-grow">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search routes..."
            onKeyDown={handleKeyPress}
          />
        </Box>
        {hasPermission(Permission.CREATE_ROUTE) && (
          <IconButton
            onClick={onAddNewRoute}
            sx={{
              backgroundColor: 'darkgreen',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            }}
            size="small"
          >
            <Tooltip title="Add new route" arrow>
              <AddIcon fontSize="small" />
            </Tooltip>
          </IconButton>
        )}
      </Box>

      <Box sx={{ height: '520px', overflow: 'auto' }}>
        {isLoading && <Loading />}
        {!isLoading && error && <Typography color="error">{error}</Typography>}
        {!isLoading && !error && routes.length > 0 && (
          <TableContainer component={Paper} sx={{ maxHeight: '100%' }}>
            <Table stickyHeader sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{ width: '1%' }}
                  ></TableCell>
                  <TableCell sx={{ width: '25%' }}>Name</TableCell>
                  <TableCell sx={{ width: '25%' }}>Start Point</TableCell>
                  <TableCell sx={{ width: '25%' }}>End Point</TableCell>
                  <TableCell sx={{ width: '20%' }}>Distance (km)</TableCell>
                  {hasPermission(Permission.UPDATE_ROUTE) &&
                    hasPermission(Permission.DELETE_ROUTE) && (
                      <TableCell sx={{ width: '1%' }}>Actions</TableCell>
                    )}
                </TableRow>
              </TableHead>
              <TableBody>
                {routes.map((route) => (
                  <TableRow
                    key={route.id}
                    onClick={() => handleRowClick(route.id)}
                    sx={{
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                      cursor: 'pointer',
                    }}
                    onDoubleClick={() => router.push(`/routes/${route.id}`)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        disabled
                        checked={selectedRoutes.includes(route.id)}
                        onChange={() => handleCheckboxChange(route.id)}
                        icon={<VisibilityOffOutlinedIcon />}
                        checkedIcon={
                          <VisibilityIcon sx={{ color: grey[600] }} />
                        }
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {route.name}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {route.startPoint?.name || 'N/A'}
                    </TableCell>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {route.endPoint?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {hasPermission(Permission.UPDATE_ROUTE) && (
                          <IconButton
                            onClick={() =>
                              router.push(`/routes/${route.id}/edit`)
                            }
                          >
                            <Tooltip title="Edit route" arrow>
                              <EditIcon />
                            </Tooltip>
                          </IconButton>
                        )}
                        {hasPermission(Permission.DELETE_ROUTE) && (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(route.id);
                            }}
                          >
                            <Tooltip title="Remove route" arrow>
                              <DeleteIcon />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {!isLoading && !error && routes.length === 0 && (
          <Typography>Cannot find any route on this page!</Typography>
        )}
      </Box>
      <Box className="mt-1 flex justify-center">
        <PaginationCustom
          totalPages={totalPages}
          currentPage={currentPage}
          searchKey={searchTerm}
        />
      </Box>
    </CustomDrawer>
  );
};

export default RoutesDrawer;

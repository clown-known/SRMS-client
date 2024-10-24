'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Delete, Edit, EditNotifications } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import PermissionChips from './PermissionChip';
import EditRoleModal from './EditRoleModal';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';
import CancelButton from '../CancelButton';
import SubmitButton from '../SubmitButton';

const fontStack = `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  fontFamily: fontStack,
  fontSize: '16px',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    fontWeight: 'bold',
    fontFamily: fontStack,
    fontSize: '17px',
  },
  fontFamily: fontStack,
  fontSize: '17px',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    fontFamily: fontStack,
    fontSize: '16px',
  },
  fontFamily: fontStack,
  fontSize: '16px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface RoleTableProps {
  roles: RoleDTO[];
  permissions: PermissionDTO[];
  onDeleteRole: (id: string) => void;
  onUpdateRole: (
    id: string,
    data: { name: string; permissions: string[] }
  ) => void;
  userPermissions: string[];
}

export default function RoleTable({
  roles,
  permissions,
  onDeleteRole,
  onUpdateRole,
  userPermissions,
}: RoleTableProps) {
  const dispatch = useAppDispatch();
  const userRoleId = useSelector((state: RootState) => state.user.roleId); // Get permission from global state
  useEffect(() => {
    dispatch(fetchUserPermissions() as any);
  }, [dispatch]);
  const isSameRoleOfUser = (roleId?: string) => roleId === userRoleId;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleDTO | null>(null);

  const isSuperAdmin = useSelector(
    (state: RootState) => state.user.isSuperAdmin
  );
  const hasPermission = (permissionRequired: string) => {
    if (isSuperAdmin) return true;
    if (userPermissions?.length === 0) return false;
    return userPermissions?.includes(permissionRequired);
  };
  const handleDeleteClick = (id: string) => {
    setRoleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      onDeleteRole(roleToDelete);
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleEditClick = (role: RoleDTO) => {
    setRoleToEdit(role);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setRoleToEdit(null);
  };

  const handleEditSubmit = (data: { name: string; permissions: string[] }) => {
    if (roleToEdit) {
      onUpdateRole(roleToEdit.id, data);
      handleEditClose();
    }
  };
  return (
    <>
      <StyledTableContainer>
        <Paper>
          <Table sx={{ minWidth: 650 }} aria-label="role table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>Index</StyledTableHeadCell>
                <StyledTableHeadCell>Name</StyledTableHeadCell>
                <StyledTableHeadCell sx={{ width: '50%' }}>
                  Permissions
                </StyledTableHeadCell>
                <StyledTableHeadCell>Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles?.map((role, index) => (
                <StyledTableRow key={role.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{role.name}</StyledTableCell>
                  <StyledTableCell sx={{ width: '50%' }}>
                    <PermissionChips
                      permissions={role.rolePermissions
                        ?.map((rp) => rp.permission)
                        .filter((p): p is PermissionDTO => !!p)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {hasPermission('role:update') &&
                      !isSameRoleOfUser(role?.id) &&
                      !role.isAdmin && (
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditClick(role)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                    {hasPermission('role:delete') &&
                      !isSameRoleOfUser(role?.id) &&
                      !role.isAdmin && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteClick(role.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </StyledTableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this role?
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={() => setDeleteConfirmOpen(false)} />
          <SubmitButton
            colorClasses="bg-red-600 hover:bg-red-700 focus:ring-red-300 disabled:bg-red-300"
            onClick={handleDeleteConfirm}
          >
            Delete
          </SubmitButton>
          {/* <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button> */}
        </DialogActions>
      </Dialog>

      {roleToEdit && (
        <EditRoleModal
          open={editModalOpen}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          role={roleToEdit}
          permissionList={permissions}
        />
      )}
    </>
  );
}

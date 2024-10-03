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
} from '@mui/material';
import { useState } from 'react';
import { EditNotifications } from '@mui/icons-material';
import PermissionChips from './PermissionChip';
import EditRoleModal from './EditRoleModal';

interface RoleTableProps {
  roles: RoleDTO[];
  permissions: PermissionDTO[];
  onDeleteRole: (id: string) => void;
  onUpdateRole: (
    id: string,
    data: { name: string; permissions: string[] }
  ) => void;
}

export default function RoleTable({
  roles,
  permissions,
  onDeleteRole,
  onUpdateRole,
}: RoleTableProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<RoleDTO | null>(null);

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
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="role table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.id}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  <PermissionChips
                    permissions={role.rolePermissions
                      ?.map((rp) => rp.permission)
                      .filter((p): p is PermissionDTO => !!p)}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(role)}>
                    <EditNotifications />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(role.id)}>
                    delete
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this role?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
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

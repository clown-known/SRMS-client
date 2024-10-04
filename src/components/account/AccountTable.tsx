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
import { Delete, Edit } from '@mui/icons-material';
import EditAccountModal from './EditAccountModal';

interface AccountTableProps {
  accounts: AccountDTO[];
  roles: RoleDTO[];
  onDeleteAccount: (id: string) => void;
  onUpdateAccount: (
    id: string,
    data: { email: string; roleId: string; profile: Partial<ProfileDTO> }
  ) => void;
}

export default function AccountTable({
  accounts,
  roles,
  onDeleteAccount,
  onUpdateAccount,
}: AccountTableProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<AccountDTO | null>(null);

  const handleDeleteClick = (id: string) => {
    setAccountToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (accountToDelete) {
      onDeleteAccount(accountToDelete);
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    }
  };

  const handleEditClick = (account: AccountDTO) => {
    setAccountToEdit(account);
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setAccountToEdit(null);
  };

  const handleEditSubmit = (data: {
    email: string;
    roleId: string;
    profile: Partial<ProfileDTO>;
  }) => {
    if (accountToEdit) {
      onUpdateAccount(accountToEdit.id, data);
      handleEditClose();
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="account table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts?.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.id}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.profile?.fullName}</TableCell>
                <TableCell>{account.profile?.phoneNumber}</TableCell>
                <TableCell>{account.role?.name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(account)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(account.id)}>
                    <Delete />
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
          Are you sure you want to delete this account?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {accountToEdit && (
        <EditAccountModal
          open={editModalOpen}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          account={accountToEdit}
          roles={roles}
        />
      )}
    </>
  );
}

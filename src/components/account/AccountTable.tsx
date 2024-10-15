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
import { useState } from 'react';
import { Delete, Edit } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditAccountModal from './EditAccountModal';
import ResetPasswordModal from './ResetPasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { UpdateAccountRequest } from '@/service/accountService';

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

interface AccountTableProps {
  accounts: AccountDTO[];
  roles: RoleDTO[];
  onDeleteAccount: (id: string) => void;
  onResetPassword: (id: string) => void;
  onUpdateAccount: (id: string, data: UpdateAccountRequest) => void;
  userPermissions: string[];
}

export default function AccountTable({
  accounts,
  roles,
  onDeleteAccount,
  onUpdateAccount,
  onResetPassword,
  userPermissions,
}: AccountTableProps) {
  const [deleteAccount, setDeleteAccount] = useState<AccountDTO | null>(null);
  const [resetPasswordAccount, setResetPasswordAccount] =
    useState<AccountDTO | null>(null);

  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<AccountDTO | null>(null);

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };

  const handleResetPasswordClick = (account: AccountDTO) => {
    setResetPasswordAccount(account);
  };

  const handleResetPasswordConfirm = () => {
    if (resetPasswordAccount) {
      onResetPassword(resetPasswordAccount.id);
      setResetPasswordAccount(null);
    }
  };
  const handleDeleteClick = (account: AccountDTO) => {
    setDeleteAccount(account);
  };

  const handleDeleteConfirm = () => {
    if (deleteAccount) {
      onDeleteAccount(deleteAccount.id);
      setDeleteAccount(null);
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

  const handleEditSubmit = (data: UpdateAccountRequest) => {
    if (accountToEdit) {
      onUpdateAccount(accountToEdit.id, data);
      handleEditClose();
    }
  };

  return (
    <>
      <StyledTableContainer>
        <Paper>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="account table">
            <TableHead>
              <TableRow>
                <StyledTableHeadCell>ID</StyledTableHeadCell>
                <StyledTableHeadCell>Email</StyledTableHeadCell>
                <StyledTableHeadCell>Full Name</StyledTableHeadCell>
                <StyledTableHeadCell>Phone Number</StyledTableHeadCell>
                <StyledTableHeadCell>Role</StyledTableHeadCell>
                <StyledTableHeadCell>Actions</StyledTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts?.map((account, index) => (
                <StyledTableRow key={account.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{account.email}</StyledTableCell>
                  <StyledTableCell>{account.profile?.fullName}</StyledTableCell>
                  <StyledTableCell>
                    {account.profile?.phoneNumber}
                  </StyledTableCell>
                  <StyledTableCell>{account.role?.name}</StyledTableCell>
                  <StyledTableCell>
                    {hasPermission('account:update') && (
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(account)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('account:reset-password') && (
                      <Tooltip title="Reset Password">
                        <IconButton
                          onClick={() => handleResetPasswordClick(account)}
                        >
                          <LockResetIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {hasPermission('account:delete') && (
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDeleteClick(account)}>
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

      {resetPasswordAccount && (
        <ResetPasswordModal
          open={!!resetPasswordAccount}
          onClose={() => setResetPasswordAccount(null)}
          onConfirm={handleResetPasswordConfirm}
          email={resetPasswordAccount.email}
        />
      )}
      {accountToEdit && (
        <EditAccountModal
          open={editModalOpen}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          account={accountToEdit}
          roles={roles}
          userPermissions={userPermissions}
        />
      )}
      {deleteAccount && (
        <DeleteAccountModal
          open={!!deleteAccount}
          onClose={() => setDeleteAccount(null)}
          onConfirm={handleDeleteConfirm}
          email={deleteAccount.email}
        />
      )}
    </>
  );
}

'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  styled,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Delete, Edit, AssignmentInd } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useSelector } from 'react-redux';
import EditAccountModal from './EditAccountModal';
import ResetPasswordModal from './ResetPasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import { unAssignRole, UpdateAccountRequest } from '@/service/accountService';
import AssignRoleModal from './AssignRoleModal';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';

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
  onAssignRole: (userId: string, roleId: string) => void;
  onUniAssignRole: (userId: string) => void;
}

export default function AccountTable({
  accounts,
  roles,
  onDeleteAccount,
  onUpdateAccount,
  onResetPassword,
  userPermissions,
  onAssignRole,
  onUniAssignRole,
}: AccountTableProps) {
  const dispatch = useAppDispatch();
  const userRoleId = useSelector((state: RootState) => state.user.roleId); // Get permission from global state
  useEffect(() => {
    dispatch(fetchUserPermissions() as any);
  }, [dispatch]);

  const [resetPasswordAccount, setResetPasswordAccount] =
    useState<AccountDTO | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<AccountDTO | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<AccountDTO | null>(null);

  const [assignRoleAccount, setAssignRoleAccount] = useState<AccountDTO | null>(
    null
  );

  const hasPermission = (permission: string) => {
    return userPermissions.includes(permission);
  };
  const isSameRoleOfUser = (roleId?: string) => roleId === userRoleId;
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

  const handleAssignRoleClick = (account: AccountDTO) => {
    setAssignRoleAccount(account);
  };

  const handleAssignRoleClose = () => {
    setAssignRoleAccount(null);
  };

  const handleAssignRoleSubmit = (roleId: string | null) => {
    if (assignRoleAccount) {
      if (roleId) onAssignRole(assignRoleAccount.id, roleId);
      else onUniAssignRole(assignRoleAccount.id);
      handleAssignRoleClose();
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
                    {hasPermission('account:update') &&
                      !isSameRoleOfUser(account.role?.id) && (
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleEditClick(account)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      )}
                    {hasPermission('account:assign-role') &&
                      !isSameRoleOfUser(account.role?.id) && (
                        <Tooltip title="Assign Role">
                          <IconButton
                            onClick={() => handleAssignRoleClick(account)}
                          >
                            <AssignmentInd />
                          </IconButton>
                        </Tooltip>
                      )}
                    {hasPermission('account:reset-password') &&
                      !isSameRoleOfUser(account.role?.id) && (
                        <Tooltip title="Reset Password">
                          <IconButton
                            onClick={() => handleResetPasswordClick(account)}
                          >
                            <LockResetIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    {hasPermission('account:delete') &&
                      !isSameRoleOfUser(account.role?.id) && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDeleteClick(account)}
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
      {assignRoleAccount && (
        <AssignRoleModal
          open={!!assignRoleAccount}
          onClose={handleAssignRoleClose}
          onSubmit={handleAssignRoleSubmit}
          account={assignRoleAccount}
          roles={roles}
        />
      )}
    </>
  );
}

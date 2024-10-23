// src/components/account/AccountActions.tsx
import React from 'react';
import {
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Delete, Edit, AssignmentInd, LockReset } from '@mui/icons-material';
import { Permission } from '@/app/lib/enum';

interface AccountActionsProps {
  account: AccountDTO;
  hasPermission: (permission: string) => boolean;
  isSameRoleOfUser: (roleId?: string) => boolean;
  onEdit: (account: AccountDTO) => void;
  onAssignRole: (account: AccountDTO) => void;
  onResetPassword: (account: AccountDTO) => void;
  onDelete: (account: AccountDTO) => void;
}

const AccountActions: React.FC<AccountActionsProps> = ({
  account,
  hasPermission,
  isSameRoleOfUser,
  onEdit,
  onAssignRole,
  onResetPassword,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(account);
    handleClose();
  };

  const handleAssignRole = () => {
    onAssignRole(account);
    handleClose();
  };

  const handleResetPassword = () => {
    onResetPassword(account);
    handleClose();
  };

  const handleDelete = () => {
    onDelete(account);
    handleClose();
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <>
        {hasPermission('account:update') &&
          !isSameRoleOfUser(account.role?.id) && (
            <Tooltip title="Edit">
              <IconButton onClick={() => onEdit(account)}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        {hasPermission(Permission.ASSIGN_ROLE) &&
          !isSameRoleOfUser(account.role?.id) && (
            <Tooltip title="Assign Role">
              <IconButton onClick={() => onAssignRole(account)}>
                <AssignmentInd />
              </IconButton>
            </Tooltip>
          )}
        {hasPermission('account:reset-password') &&
          !isSameRoleOfUser(account.role?.id) && (
            <Tooltip title="Reset Password">
              <IconButton onClick={() => onResetPassword(account)}>
                <LockReset />
              </IconButton>
            </Tooltip>
          )}
        {hasPermission('account:delete') &&
          !isSameRoleOfUser(account.role?.id) && (
            <Tooltip title="Delete">
              <IconButton onClick={() => onDelete(account)}>
                <Delete />
              </IconButton>
            </Tooltip>
          )}
      </>
    </>
  );
};

export default AccountActions;

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import CancelButton from '../CancelButton';
import SubmitButton from '../SubmitButton';

interface AssignRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (roleId: string | null) => void;
  account: AccountDTO;
  roles: RoleDTO[];
}

export default function AssignRoleModal({
  open,
  onClose,
  onSubmit,
  account,
  roles,
}: AssignRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<RoleDTO | null>(null);

  useEffect(() => {
    setSelectedRole(roles.find((role) => role.id === account.role?.id) || null);
  }, [account, roles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedRole?.id || null);
  };

  const isRoleChanged = selectedRole?.id !== (account.role?.id || null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: '400px',
          height: '350px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Assign Role</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={account.email}
            disabled
          />
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={account.profile?.fullName || ''}
            disabled
          />
          <Autocomplete
            options={[{ id: '', name: 'No Role' }, ...roles]}
            getOptionLabel={(option) => option.name}
            value={selectedRole || { id: '', name: 'No Role' }}
            onChange={(event, newValue) => {
              setSelectedRole(newValue?.id ? newValue : null);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Role" margin="dense" required />
            )}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={onClose} />
          <SubmitButton disabled={!isRoleChanged}>Save</SubmitButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

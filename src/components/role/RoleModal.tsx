import React, { useMemo, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; permissions: string[] }) => void;
  onChange: () => void;
  permissions: PermissionDTO[];
}

const RoleModal: React.FC<RoleModalProps> = ({
  open,
  onClose,
  onSubmit,
  onChange,
  permissions,
}) => {
  const { control, handleSubmit } = useForm<{
    name: string;
    permissions: string[];
  }>();
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePermissionToggle = (permissionId: string) => {
    onChange();
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const filteredPermissions = useMemo(() => {
    return permissions?.filter((permission) =>
      permission.module?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [permissions, searchTerm]);

  const onFormSubmit = handleSubmit((data) => {
    onSubmit({ ...data, permissions: selectedPermissions });
    onClose();
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: '#1F2937',
          color: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: '0.5rem',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create New Role
        </Typography>
        <form
          onSubmit={onFormSubmit}
          style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: 'Role name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Role Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
                onChange={(e) => {
                  field.onChange(e);
                  onChange();
                }}
                sx={{
                  '& .MuiInputBase-input': { color: 'white' },
                  '& .MuiInputLabel-root': { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white',
                  },
                }}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Permissions:
            </Typography>
            <TextField
              size="small"
              placeholder="Search permissions"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onChange();
              }}
              sx={{
                flexGrow: 1,
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
            <Grid container spacing={2} sx={{ maxHeight: '300px' }}>
              {filteredPermissions?.map((permission) => (
                <Grid item xs={6} key={permission.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        sx={{
                          color: 'white',
                          '&.Mui-checked': { color: 'white' },
                        }}
                      />
                    }
                    label={`${permission.module}:${permission.action}`}
                    sx={{ color: 'white' }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={onClose}
              sx={{
                mr: 1,
                bgcolor: 'red',
                color: 'white',
                '&:hover': { bgcolor: 'darkred' },
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create Role
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default RoleModal;

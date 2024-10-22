import React, { useMemo, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Grid,
  Checkbox,
  CheckboxProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import CancelButton from '../CancelButton';
import SubmitButton from '../SubmitButton';

interface RoleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; permissions: string[] }) => void;
  onChange: () => void;
  permissions: PermissionDTO[];
}

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: theme.palette.mode === 'dark' ? '#394b59' : '#f5f8fa',
  backgroundImage:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))'
      : 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: theme.palette.mode === 'dark' ? '#30404d' : '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background:
      theme.palette.mode === 'dark'
        ? 'rgba(57,75,89,.5)'
        : 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        '&:hover': { bgcolor: 'transparent' },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  );
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
          width: 700,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          // height: '90vh',
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
              fullWidth
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 2 }}>
            <Grid container spacing={2}>
              {filteredPermissions?.map((permission) => (
                <Grid item xs={6} key={permission.id}>
                  <FormControlLabel
                    control={
                      <BpCheckbox
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                      />
                    }
                    label={`${permission.module}:${permission.action}`}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <CancelButton onClick={onClose} />
            <SubmitButton>Create Role</SubmitButton>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default RoleModal;

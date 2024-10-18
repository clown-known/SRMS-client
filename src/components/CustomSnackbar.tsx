import React from 'react';
import { Snackbar } from '@mui/material';

interface CustomSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
  // eslint-disable-next-line react/require-default-props
  autoHideDuration?: number;
}

const CustomSnackbar = ({
  open,
  message,
  onClose,
  autoHideDuration = 3000,
}: CustomSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      message={message}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      ContentProps={{
        style: {
          backgroundColor: message.includes('successful')
            ? '#4caf50'
            : '#f44336',
          color: '#fff',
        },
      }}
    />
  );
};

export default CustomSnackbar;

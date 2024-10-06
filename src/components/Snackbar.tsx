import { Snackbar } from '@mui/material';
import React from 'react'

interface SnackbarProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const SnackbarCustom = ({ message, onClose, open, ...props }: SnackbarProps) => {
  return (
    <Snackbar
          open={open}
          onClose={onClose}
          autoHideDuration={3000}
          message={message}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          ContentProps={{
            style: {
              backgroundColor: message.includes('successfully') ? '#4caf50' : '#f44336',
              color: '#fff',
            },
          }}
        />
  )
}

export default SnackbarCustom;
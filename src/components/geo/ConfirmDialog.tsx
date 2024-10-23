import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CancelButton from '../CancelButton';
import ConfirmButton from '../ConfirmButton';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
}

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <CancelButton onClick={onClose} />
        <ConfirmButton onClick={onConfirm} />
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;

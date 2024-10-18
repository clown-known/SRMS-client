import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import CancelButton from '../CancelButton';

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  cancelText?: string;
  confirmText?: string;
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
        <Button onClick={onConfirm} autoFocus className="rounded-lg bg-red-300 px-5 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-200">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;

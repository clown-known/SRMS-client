import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import CancelButton from '../CancelButton';
import SubmitButton from '../SubmitButton';

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: string;
}

export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
  email,
}: DeleteAccountModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="font-sans"
      PaperProps={{
        className: 'rounded-lg p-2',
      }}
    >
      <DialogTitle className="pb-4 text-2xl font-semibold">
        Confirm Account Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="text-base">
          Are you sure you want to delete the account with email:{' '}
          <strong className="font-medium">{email}</strong>? This action cannot
          be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions className="pt-6">
        <CancelButton onClick={onClose} />
        <SubmitButton
          colorClasses="bg-red-600 hover:bg-red-700 focus:ring-red-300 disabled:bg-red-300"
          onClick={onConfirm}
        >
          Delete Account
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}

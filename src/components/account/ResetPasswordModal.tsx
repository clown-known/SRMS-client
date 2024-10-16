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

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: string;
}

export default function ResetPasswordModal({
  open,
  onClose,
  onConfirm,
  email,
}: ResetPasswordModalProps) {
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
        Confirm Password Reset
      </DialogTitle>
      <DialogContent>
        <DialogContentText className="text-base">
          Are you sure you want to reset the password for the account with
          email: <strong className="font-medium">{email}</strong>?
        </DialogContentText>
      </DialogContent>
      <DialogActions className="pt-6">
        <CancelButton onClick={onClose} />
        <SubmitButton onClick={onConfirm}>Reset Password</SubmitButton>
        {/* <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          className="px-6 py-2 text-base"
        >
          Reset Password
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}

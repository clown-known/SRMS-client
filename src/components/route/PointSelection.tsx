import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import Loading from '@/components/Loading';

interface PointSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  dialogType: 'start' | 'end';
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error: string;
  points: PointDTO[];
  handleSelectPoint: (point: PointDTO) => void;
}

const PointSelectionDialog: React.FC<PointSelectionDialogProps> = ({
  open,
  onClose,
  dialogType,
  searchTerm,
  handleSearch,
  isLoading,
  error,
  points,
  handleSelectPoint,
}) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title">
      <DialogTitle>
        {dialogType === 'start' ? 'Select Start Point' : 'Select End Point'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search Points"
          type="text"
          fullWidth
          variant="standard"
          value={searchTerm}
          onChange={handleSearch}
        />
        <List>
          {isLoading && <Loading />}
          {error && (
            <ListItemButton>
              <ListItemText primary={error} />
            </ListItemButton>
          )}
          {!isLoading && !error && points.length > 0 ? (
            points.map((point) => (
              <ListItemButton
                key={point.id}
                onClick={() => handleSelectPoint(point)}
              >
                <ListItemText primary={point.name} />
              </ListItemButton>
            ))
          ) : (
            <ListItemButton>
              <ListItemText primary="No points found" />
            </ListItemButton>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PointSelectionDialog;

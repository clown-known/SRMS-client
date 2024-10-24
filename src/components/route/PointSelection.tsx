import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from '@mui/material';
import Loading from '@/components/Loading';
import SearchInput from '../geo/SearchInput';

interface PointSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  dialogType: 'start' | 'end';
  searchTerm: string;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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
  handleKeyDown,
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
        <div className="mt-2 mb-4">
          <SearchInput
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={handleKeyDown}
            placeholder="Search points..."
          />
        </div>
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
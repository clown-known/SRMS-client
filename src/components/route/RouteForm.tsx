import React from 'react';
import {
  Box,
  Button,
  Typography,
  TextareaAutosize,
  Grid,
  TextField,
} from '@mui/material';
import CustomInput from '@/components/CustomInput';

interface RouteFormProps {
  routeName: string;
  setRouteName: (name: string) => void;
  startPointName: string;
  endPointName: string;
  handleOpenDialog: (type: 'start' | 'end') => void;
  distance: number | string;
  estimatedTime: number;
  description: string;
  setDescription: (description: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
  submitButtonText: string;
}

const RouteForm: React.FC<RouteFormProps> = ({
  routeName,
  setRouteName,
  startPointName,
  endPointName,
  handleOpenDialog,
  distance,
  estimatedTime,
  description,
  setDescription,
  handleSubmit,
  submitButtonText,
}) => {
  const TimeDisplay =
    estimatedTime > 24
      ? `${Math.round(estimatedTime / 24)} day(s)`
      : `${estimatedTime.toFixed(2)} hour(s)`;

  return (
    <form onSubmit={handleSubmit}>
      <CustomInput
        label="Route Name"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
      />

      <Grid container spacing={2} className="mb-4">
        <Grid item xs={6}>
          <TextField
            variant="standard"
            label="Start Point"
            fullWidth
            value={startPointName}
            onClick={() => handleOpenDialog('start')}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            variant="standard"
            label="End Point"
            fullWidth
            value={endPointName}
            onClick={() => handleOpenDialog('end')}
            InputProps={{ readOnly: true }}
          />
        </Grid>
      </Grid>

      <CustomInput label="Distance" value={distance} disabled={true} />

      <CustomInput label="Estimated Time" value={TimeDisplay} disabled={true} />

      <Typography variant="subtitle1" className="mb-2">
        Description
      </Typography>
      <TextareaAutosize
        minRows={3}
        placeholder="Enter description"
        className="mb-4 w-full rounded border p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        type="submit"
        className="mt-4"
      >
        {submitButtonText}
      </Button>
    </form>
  );
};

export default RouteForm;

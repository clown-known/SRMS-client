import React from 'react';
import {
  Typography,
  Select,
  MenuItem,
  TextareaAutosize,
  Grid,
  Button,
} from '@mui/material';
import CustomInput from '@/components/CustomInput';

interface PointFormProps {
  name: string;
  setName: (value: string) => void;
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  type: string;
  setType: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  onSubmit: () => void;
  submitButtonText: string;
}

const PointForm: React.FC<PointFormProps> = ({
  name,
  setName,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  type,
  setType,
  description,
  setDescription,
  onSubmit,
  submitButtonText,
}) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}>
      <CustomInput
        label="Point Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Grid container spacing={2} className="mb-4">
        <Grid item xs={6}>
          <CustomInput
            label="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <CustomInput
            label="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" className="mb-2">
        Type
      </Typography>
      <Select
        value={type}
        onChange={(e) => setType(e.target.value as string)}
        fullWidth
        className="mb-4"
      >
        <MenuItem value="port">Port</MenuItem>
        <MenuItem value="dock">Dock</MenuItem>
        <MenuItem value="mooring buoy">Mooring buoy</MenuItem>
        <MenuItem value="wharf">Wharf</MenuItem>
      </Select>

      <Typography variant="subtitle1" className="mb-2">
        Description
      </Typography>
      <TextareaAutosize
        minRows={3}
        maxRows={5}
        placeholder="Enter description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 w-full rounded border p-2"
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

export default PointForm;
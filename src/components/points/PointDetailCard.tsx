import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  CardActionArea,
  CardMedia,
} from '@mui/material';
import AnchorIcon from '@mui/icons-material/Anchor';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';

interface PointDetailsCardProps {
  point: {
    id: string;
    name: string;
    type: string;
    latitude: number;
    longitude: number;
    description: string;
  } | null;
  onClose: () => void;
}

const PointDetailsCard = ({ point, onClose  }: PointDetailsCardProps) => {
  if (!point) return null;

  const capitalizeString = (string: string) =>
    string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <Box
      className="rounded-lg bg-gray-100 p-4"
      sx={{
        width: '100%',
        maxWidth: 400,
        boxShadow: 3,
        backgroundColor: 'white',
      }}
    >
      <Box className="mb-4 flex justify-between items-center">
        <Typography variant="h5" className="font-bold">{point.name}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box className="flex justify-between">
        <CardActionArea>
          <CardMedia
            component="img"
            image='/assets/images/no-image.png'
            alt='No image'
          />  
        </CardActionArea>
      </Box>

      <Box className="mb-4 flex justify-between rounded-lg bg-gray-100 p-4">
        <Box>
          <Box className="flex items-center">
            <AnchorIcon color="primary" className="mr-2" />
            <Box>
              <Typography variant="body2" className="font-extralight">
                Type:
              </Typography>
              <Typography variant="body2" className="text-lg font-semibold">
                {capitalizeString(point.type)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Box className="flex items-center">
            <LocationOnIcon className="mr-2" />
            <Box>
              <Typography variant="body2" className="font-extralight">
                Coordinates:
              </Typography>
              <Typography variant="body2" className="text-lg font-semibold">
                {point.latitude.toFixed(3)}, {point.longitude.toFixed(3)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="mb-4">
        <Box className="mb-2 flex items-center">
          <DescriptionIcon className="mr-2" />
          <Typography variant="h6">Description</Typography>
        </Box>
        <Typography variant="body1" className="text-lg">
          {point.description}
        </Typography>
      </Box>
    </Box>
  );
};

export default PointDetailsCard;

import React, { useState } from 'react';
import { Drawer, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ResizableDrawerProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
  maxWidth?: number;
}

const CustomDrawer = ({
  open,
  onClose,
  children,
  width,
  maxWidth = 700,
}: ResizableDrawerProps) => {
  const [drawerWidth, setDrawerWidth] = useState(width || 400); // Default width

  // const handleMouseDown = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('mouseup', handleMouseUp);
  // };

  // const handleMouseMove = (e: MouseEvent) => {
  //   const newWidth = e.clientX > 200 ? e.clientX : 400;
  //   setDrawerWidth(newWidth > maxWidth ? maxWidth : newWidth);
  // };

  // const handleMouseUp = () => {
  //   document.removeEventListener('mousemove', handleMouseMove);
  //   document.removeEventListener('mouseup', handleMouseUp);
  // };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="persistent"
      PaperProps={{ style: { width: drawerWidth, marginTop: 64, height: 'calc(100% - 64px)' } }}
    >
      <Box sx={{ p: 2,  }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box> */}
        {children}
      </Box>
      {/* <div
        // onMouseDown={handleMouseDown}
        style={{
          width: '5px',
          height: '80%',
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'transparent',
          border: '0px',
        }}
      /> */}
    </Drawer>
  );
};

export default CustomDrawer;

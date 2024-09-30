import { Box, Skeleton } from '@mui/material'
import React from 'react'

const loading:React.FC = () => {
  return (
    <Box>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="80%" />
    </Box>
  )
}

export default loading
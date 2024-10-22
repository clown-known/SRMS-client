'use client';

import React, { useState } from 'react';
import { Chip, styled } from '@mui/material';
import getChipColor from '@/data/chipPermissionColor';

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: '2px',
  '& .MuiChip-label': {
    fontSize: '15px', // Increase this value to make the text bigger
    fontWeight: 500, // Optional: make the text slightly bolder
  },
}));
interface PermissionChipsProps {
  // eslint-disable-next-line react/require-default-props
  permissions?: PermissionDTO[];
}

export default function PermissionChips({
  permissions = [],
}: PermissionChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const displayCount = isExpanded ? permissions.length : 4;
  const remainingCount = permissions.length - displayCount;

  if (permissions.length === 0) {
    return <Chip label="No permissions" size="medium" sx={{ margin: '2px' }} />;
  }

  return (
    <>
      {permissions.slice(0, displayCount).map((permission) => (
        <StyledChip
          key={permission.id}
          label={`${permission.module} : ${permission.action}`}
          size="medium"
          color={getChipColor(permission.action)}
          sx={{ margin: '2px' }}
        />
      ))}
      {!isExpanded && remainingCount > 0 && (
        <StyledChip
          label={`+${remainingCount}`}
          size="small"
          onClick={toggleExpansion}
          sx={{ margin: '2px', cursor: 'pointer' }}
        />
      )}
      {isExpanded && remainingCount > 0 && (
        <StyledChip
          label="Show less"
          size="small"
          onClick={toggleExpansion}
          sx={{ margin: '2px', cursor: 'pointer' }}
        />
      )}
    </>
  );
}

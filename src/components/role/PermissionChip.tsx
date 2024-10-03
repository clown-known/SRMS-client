'use client';

import React, { useState } from 'react';
import { Chip } from '@mui/material';
import getChipColor from '@/data/chipPermissionColor';

interface PermissionChipsProps {
  // eslint-disable-next-line react/require-default-props
  permissions?: PermissionDTO[];
}

export default function PermissionChips({
  permissions = [],
}: PermissionChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  const displayCount = isExpanded ? permissions.length : 5;
  const remainingCount = permissions.length - displayCount;

  if (permissions.length === 0) {
    return <Chip label="No permissions" size="small" sx={{ margin: '2px' }} />;
  }

  return (
    <>
      {permissions.slice(0, displayCount).map((permission) => (
        <Chip
          key={permission.id}
          label={`${permission.module} : ${permission.action}`}
          size="small"
          color={getChipColor(permission.action)}
          sx={{ margin: '2px' }}
        />
      ))}
      {!isExpanded && remainingCount > 0 && (
        <Chip
          label={`+${remainingCount}`}
          size="small"
          onClick={toggleExpansion}
          sx={{ margin: '2px', cursor: 'pointer' }}
        />
      )}
      {isExpanded && remainingCount > 0 && (
        <Chip
          label="Show less"
          size="small"
          onClick={toggleExpansion}
          sx={{ margin: '2px', cursor: 'pointer' }}
        />
      )}
    </>
  );
}

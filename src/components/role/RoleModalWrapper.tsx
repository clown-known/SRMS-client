'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CreateRole, mapToCreateRoleRequest } from '@/service/roleService';
import CustomSnackbar from '@/components/CustomSnackbar';

const RoleModal = dynamic(() => import('./RoleModal'), {
  ssr: false,
});

interface RoleModalWrapperProps {
  onRoleCreated: () => void;
  permissionsList: PermissionDTO[];
}

export default function RoleModalWrapper({
  onRoleCreated,
  permissionsList,
}: RoleModalWrapperProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <ClientWrapper
      permissions={permissionsList}
      onRoleCreated={onRoleCreated}
    />
  );
}

function ClientWrapper({
  permissions,
  onRoleCreated,
}: {
  permissions: PermissionDTO[];
  onRoleCreated: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [key, setKey] = useState(0);
  const hasUnsavedChanges = useRef(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => setIsOpen(true);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges.current) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmClose) {
        return;
      }
    }
    setIsOpen(false);
    setKey((prevKey) => prevKey + 1);
    hasUnsavedChanges.current = false;
  }, []);

  const handleSubmit = async (data: any) => {
    hasUnsavedChanges.current = false;
    try {
      const result = await CreateRole(mapToCreateRoleRequest(data));
      handleClose();
      onRoleCreated();
      setSnackbarMessage('Role created successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error creating role:', error);
      setSnackbarMessage('Failed to create role. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleChange = () => {
    hasUnsavedChanges.current = true;
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Add Role
      </button>
      <RoleModal
        key={key}
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onChange={handleChange}
        permissions={permissions}
      />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}

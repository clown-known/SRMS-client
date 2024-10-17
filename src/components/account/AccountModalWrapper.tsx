'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { CreateAccount, CreateAccountRequest } from '@/service/accountService';
import CustomSnackbar from '@/components/CustomSnackbar';

const AccountModal = dynamic(() => import('./AccountModal'), {
  ssr: false,
});

interface AccountModalWrapperProps {
  onAccountCreated: () => void;
  rolesList: RoleDTO[];
  permission: string[];
}

export default function AccountModalWrapper({
  onAccountCreated,
  rolesList,
  permission,
}: AccountModalWrapperProps) {
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

  const handleSubmit = async (data: CreateAccountRequest) => {
    hasUnsavedChanges.current = false;
    try {
      const result = await CreateAccount(data);
      handleClose();
      onAccountCreated();
      setSnackbarMessage('Account created successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to create account. Please try again.');
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
        Add Account
      </button>
      <AccountModal
        key={key}
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        onChange={handleChange}
        roles={rolesList}
        userPermissions={permission}
      />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  );
}

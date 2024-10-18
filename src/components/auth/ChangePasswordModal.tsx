import React, { useState } from 'react';
import { Button } from '@headlessui/react';
import SubmitButton from '../SubmitButton';
import CancelButton from '../CancelButton';
import PasswordInputWithToggle from '../PasswordInput';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [error, setError] = useState('');

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!validatePassword(oldPassword)) {
      setError('Old password must be at least 6 characters long');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }
    setError('');
    onSubmit(oldPassword, newPassword, confirmPassword);
    e.currentTarget.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-50" />
      <div className="relative mx-auto my-6 w-full max-w-md">
        <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between rounded-t border-b border-solid border-gray-300 p-5">
            <h3 className="text-3xl font-semibold">Change Password</h3>
            <Button
              type="button"
              className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="block h-6 w-6 text-2xl text-black opacity-5 outline-none focus:outline-none">
                ×
              </span>
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="relative flex-auto p-6">
            <PasswordInputWithToggle
              id="old-password"
              name="oldPassword"
              label="Old Password"
              required
              minLength={6}
            />
            <PasswordInputWithToggle
              id="new-password"
              name="newPassword"
              label="New Password"
              required
              minLength={6}
            />
            <PasswordInputWithToggle
              id="confirm-password"
              name="confirmPassword"
              label="Confirm New Password"
              required
              minLength={6}
            />
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            <div className="flex justify-end gap-1 border-solid border-gray-300">
              <CancelButton onClick={onClose} />
              <SubmitButton>Save Changes</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

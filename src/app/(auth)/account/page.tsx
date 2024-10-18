'use client';

import { FC, useState } from 'react';
import useSWR from 'swr';
import axiosInstance from '../../../../axiosConfig';
import Loading from '@/components/Loading';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { changePassword } from '@/service/authService';
import CustomSnackbar from '@/components/CustomSnackbar';

interface AccountDTOResponse {
  data: AccountDTO;
}

const Account: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  const fetcher = (url: string) => axiosInstance.get<AccountDTOResponse>(url);

  const { data, isLoading, isValidating } = useSWR(
    'authentication-service/auth/my-account',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  const handleChangePassword = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmitPasswordChange = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      showSnackbar('New password and confirm password do not match');
      return;
    }

    try {
      if (data) {
        await changePassword({ newPassword, oldPassword });
        showSnackbar('Password changed successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      showSnackbar('Failed to change password. Please try again.');
    }
  };

  if (isLoading || isValidating) return <Loading />;

  return (
    <div className="bg-gray-1000 flex min-h-screen items-center justify-center">
      <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-10 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Account Information
        </h2>
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p className="text-lg text-gray-900">{data?.data.data.id}</p>
        </div>
        <div className="mb-5">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-lg text-gray-900">{data?.data.data.email}</p>
        </div>
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p className="text-lg text-gray-900">{data?.data.data.role?.name}</p>
        </div>
        <button
          type="button"
          onClick={handleChangePassword}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
        >
          Change Password
        </button>
      </div>

      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPasswordChange}
      />

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default Account;

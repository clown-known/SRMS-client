'use client';

import { FC, useEffect, useState } from 'react';
import axiosInstance from '../../../../axiosConfig';
import Loading from '@/components/Loading';
import ChangePasswordModal from '@/components/auth/ChangePasswordModal';
import { changePassword } from '@/service/authService';
import CustomSnackbar from '@/components/CustomSnackbar';
import RandomBackground from '@/components/RandomBackground'; // Import the RandomBackground component
import withAuth from '@/hoc/withAuth';

interface AccountDTOResponse {
  data: AccountDTO;
}

const Account: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const [accountData, setAccountData] = useState<AccountDTO | null>(null); // State for account data
  const [loading, setLoading] = useState(true); // State for loading

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

  const fetchAccountData = async () => {
    try {
      const response = await axiosInstance.get<AccountDTOResponse>(
        'authentication-service/auth/my-account'
      );
      setAccountData(response.data.data); // Set the account data
    } catch (error) {
      showSnackbar('Failed to load account data.'); // Show error message
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };
  useEffect(() => {
    fetchAccountData(); // Call the fetch function
  }, []);
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
      if (accountData) {
        await changePassword({ newPassword, oldPassword });
        showSnackbar('Password changed successfully');
        setIsModalOpen(false);
      }
    } catch (error) {
      showSnackbar('Failed to change password. Please try again.');
    }
  };

  if (loading) return <Loading />; // Show loading indicator

  return (
    <RandomBackground className="items-center justify-center">
      {/* Wrap the content with RandomBackground */}
      <div className="flex min-h-screen items-center justify-center">
        <div className="mx-auto w-full max-w-2xl rounded-lg bg-white p-10 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">
            Account Information
          </h2>
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-500">ID</p>
            <p className="text-lg text-gray-900">{accountData?.id}</p>
          </div>
          <div className="mb-5">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg text-gray-900">{accountData?.email}</p>
          </div>
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-500">Role</p>
            <p className="text-lg text-gray-900">
              {accountData?.role?.name || 'None'}
            </p>
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
    </RandomBackground>
  );
};

export default withAuth(Account);
// export default Account;

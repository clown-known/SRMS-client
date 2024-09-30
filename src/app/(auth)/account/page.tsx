'use client';

import { FC } from 'react';
import useSWR from 'swr';
import axiosInstance from '../../../../axiosConfig';

interface AccountDTOResponse {
  data: AccountDTO;
}

const Account = () => {
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
    // Implement password change logic here
    console.log('Change password clicked');
  };

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
    </div>
  );
};

export default Account;

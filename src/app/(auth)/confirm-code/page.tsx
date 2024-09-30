'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmCode } from '@/service/authService';

const ConfirmCode: FC = () => {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Call your service to confirm the code
    await confirmCode({ code });
    // If successful, redirect to the next step (e.g., reset password)
    router.push('/reset-password'); // Adjust the route as necessary
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-gray-200 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Confirm Code
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the confirmation code"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
          >
            Confirm Code
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmCode;

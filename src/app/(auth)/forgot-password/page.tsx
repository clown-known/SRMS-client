'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/service/authService'; // Adjust the import based on your service
import RandomBackground from '@/components/RandomBackground'; // Import RandomBackground
import SnackbarCustom from '@/components/Snackbar'; // Import Snackbar

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }); // Call the forgot password service
      setSnackbarMessage('Reset link sent successfully!'); // Set success message
      setSnackbarOpen(true); // Open snackbar
      router.push('/confirm-code'); // Redirect to confirm code page
    } catch (err) {
      setError(
        'Failed to send reset link. Please check your email and try again.'
      );
      setSnackbarMessage('Failed to send reset link.'); // Set error message
      setSnackbarOpen(true); // Open snackbar
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  return (
    <RandomBackground className="items-center justify-center">
      {/* Wrap content with RandomBackground */}
      <div className="w-full max-w-md rounded-lg bg-gray-200 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
          >
            Send OTP
          </button>
        </form>
      </div>
      <SnackbarCustom
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </RandomBackground>
  );
};

export default ForgotPassword;

'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Ensure this import is present
import {
  forgotPassword,
  confirmCode,
  resetPassword,
} from '@/service/authService'; // Adjust the import based on your service
import RandomBackground from '@/components/RandomBackground'; // Import RandomBackground
import SnackbarCustom from '@/components/Snackbar'; // Import Snackbar

const PasswordRecovery: FC = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [stage, setStage] = useState(1); // Track the current stage
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false); // New state for new password visibility

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error before sending the request
    try {
      await forgotPassword({ email }); // Call the forgot password service
      setSnackbarMessage('Reset link sent successfully!'); // Set success message
      setSnackbarOpen(true); // Open snackbar
      setStage(2); // Move to confirm code stage
    } catch (err) {
      setError(
        'Failed to send reset link. Please check your email and try again.'
      );
      setSnackbarMessage('Failed to send reset link.'); // Set error message
      setSnackbarOpen(true); // Open snackbar
    }
  };

  const handleConfirmCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error before sending the request
    try {
      await confirmCode({ code }); // Call your service to confirm the code
      setSnackbarMessage('Code confirmed successfully!'); // Set success message
      setSnackbarOpen(true); // Open snackbar
      setStage(3); // Move to reset password stage
    } catch (err) {
      setError('Invalid confirmation code. Please try again.'); // Set error message
      setSnackbarMessage('Failed to confirm code.'); // Set error message
      setSnackbarOpen(true); // Open snackbar
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset error before sending the request
    try {
      const data = await resetPassword({ newPassword }); // Call the reset password service
      if (!data) {
        setSnackbarMessage('Reset failed, token is invalid!'); // Set error message
        setSnackbarOpen(true); // Open snackbar
      } else {
        setSnackbarMessage('Password reset successfully!'); // Set success message
        setSnackbarOpen(true); // Open snackbar
        router.push('/login'); // Redirect to login page after successful reset
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      setSnackbarMessage('Failed to reset password.'); // Set error message
      setSnackbarOpen(true); // Open snackbar
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close snackbar
  };

  return (
    <RandomBackground className="items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-gray-200 p-8 shadow-lg">
        {stage === 1 && (
          <>
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
              Forgot Password
            </h2>
            <form onSubmit={handleForgotPassword}>
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
          </>
        )}
        {stage === 2 && (
          <>
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
              Confirm Code
            </h2>
            <form onSubmit={handleConfirmCode}>
              <div className="mb-4">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the confirmation code"
                  className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
                  required
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
              >
                Confirm Code
              </button>
            </form>
          </>
        )}
        {stage === 3 && (
          <>
            <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
              Reset Password
            </h2>
            <form onSubmit={handleResetPassword}>
              <div className="relative mb-4">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-5"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </button>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
      <SnackbarCustom
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleSnackbarClose}
      />
    </RandomBackground>
  );
};

export default PasswordRecovery;

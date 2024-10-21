'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { login } from '@/service/authService';
import { loginState } from '@/store/userSlice';
import CustomSnackbar from '@/components/CustomSnackbar';
import RandomBackground from '@/components/RandomBackground';

const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();

  const validateForm = () => {
    let valid = true;
    const errors = { email: '', password: '' };

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email address is invalid';
      valid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await login({ email, password });
        dispatch(
          loginState({
            username: response.data.name,
            permission: response.data.token.permission,
          })
        );
        setSnackbarMessage('Login successful!');
        setSnackbarOpen(true);
        setTimeout(() => router.push('/'), 1000); // Redirect after 1 second
      } catch (error) {
        setSnackbarMessage('Login failed. Please check your credentials.');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <RandomBackground>
      <div className="w-full max-w-md rounded-lg bg-gray-200 bg-opacity-80 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          <div className="mb-4 text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              forgot password ?
            </a>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-800">
            Not registered yet?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Create an Account
            </a>
          </p>
          <button type="submit" className="mt-4">
            {/* <Image
              src="/google-icon.png"
              alt="Google Login"
              className="mx-auto h-10 w-10"
            /> */}
          </button>
        </div>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </RandomBackground>
  );
};

export default Login;

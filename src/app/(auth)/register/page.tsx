'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Ensure this import is present
import { register } from '@/service/authService';
import { loginState } from '@/store/userSlice';
import CustomSnackbar from '@/components/CustomSnackbar';
import withoutAuth from '@/hoc/withoutAuth';

const Register: FC = () => {
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
  });
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+84'); // Default country code
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const countries = [
    { code: '+84', name: 'VN', flag: 'vn' },
    { code: '+1', name: 'USA', flag: '🇺🇸' },
    { code: '+44', name: 'UK', flag: '🇬🇧' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    // Add more countries as needed
  ];

  const validateForm = () => {
    let valid = true;
    const errors = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
      dateOfBirth: '',
    };

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    // First name validation
    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      valid = false;
    }

    // Last name validation
    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      valid = false;
    }

    // Phone validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
      valid = false;
    }

    // Address validation
    if (!formData.address) {
      errors.address = 'Address is required';
      valid = false;
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Combine country code and phone number
        const fullPhoneNumber = `${countryCode}${formData.phoneNumber}`;

        const response = await register({
          ...formData,
          phoneNumber: fullPhoneNumber, // Use the combined phone number
        });

        dispatch(
          loginState({
            username: response.data.name,
            permission: response.data.token.permission,
          })
        );
        setSnackbarMessage('Register successful!');
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
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100"
      style={{
        backgroundImage:
          'url(https://images.wallpaperscraft.com/image/single/sea_waves_ocean_126805_3840x2160.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="w-full max-w-md rounded-lg bg-gray-200 bg-opacity-80 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your Email"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          {/* Password Field */}
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          {/* First Name Field */}
          <div className="mb-4">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              placeholder="Enter your First Name"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          {/* Last Name Field */}
          <div className="mb-4">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              placeholder="Enter your Last Name"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
          {/* Phone Field */}
          <div className="mb-4 flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="mr-2 rounded-lg border bg-white p-3 text-gray-800"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="Enter your Phone Number"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.phoneNumber && (
              <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>
          {/* Address Field */}
          <div className="mb-4">
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter your Address"
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.address && (
              <p className="mt-2 text-sm text-red-600">{errors.address}</p>
            )}
          </div>
          {/* Date of Birth Field */}
          <div className="mb-4">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData({ ...formData, dateOfBirth: e.target.value })
              }
              className="mt-2 w-full rounded-lg border bg-white p-3 text-gray-800 placeholder-gray-500 focus:border-gray-400"
            />
            {errors.dateOfBirth && (
              <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gray-600 p-3 text-white hover:bg-gray-800"
          >
            Register
          </button>
        </form>
      </div>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
};

export default withoutAuth(Register);
// export default Register;

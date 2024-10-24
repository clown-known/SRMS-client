'use client';

import { FC, useEffect, useState } from 'react';
import { UpdateMyProfile } from '@/service/authService';
import { useAppDispatch } from '@/store/store';
import { changeNameState } from '@/store/userSlice';
import SnackbarCustom from '@/components/Snackbar'; // Import SnackbarCustom

interface IProps {
  profile: ProfileDTO;
}

const ProfileLayout: FC<IProps> = (props: IProps) => {
  const { profile } = props;

  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    dateOfBirth: profile.dateOfBirth,
    phoneNumber: profile.phoneNumber,
    address: profile.address,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for snackbar message

  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await UpdateMyProfile(formData);
    dispatch(
      changeNameState({
        username: `${formData.firstName} ${formData.lastName}`,
      })
    );
    if (response?.status === 200) {
      setSnackbarMessage('Profile updated successfully!'); // Set success message
      setSnackbarOpen(true); // Open snackbar
    } else {
      setSnackbarMessage('Failed to update profile.'); // Set error message
      setSnackbarOpen(true); // Open snackbar
    }
  };

  const formattedDate = new Date(formData.dateOfBirth)
    .toISOString()
    .split('T')[0];

  return (
    <div className="bg-gray-1000 flex min-h-screen items-center justify-center">
      <form
        className="mx-auto w-full max-w-2xl rounded-lg bg-white p-10 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Profile Information
        </h2>
        <div className="mb-5 flex gap-4">
          <div className="group relative z-0 w-1/2">
            <input
              type="text"
              name="firstName"
              id="floating_first_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
              value={formData.firstName}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_first_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
            >
              First name
            </label>
          </div>
          <div className="group relative z-0 w-1/2">
            <input
              type="text"
              name="lastName"
              id="floating_last_name"
              className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
              placeholder=" "
              required
              value={formData.lastName}
              onChange={handleChange}
            />
            <label
              htmlFor="floating_last_name"
              className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
            >
              Last name
            </label>
          </div>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="date"
            name="dateOfBirth"
            id="floating_date_of_birth"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            value={formattedDate}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_date_of_birth"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
          >
            Date of Birth
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="tel"
            name="phoneNumber"
            id="floating_phone"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_phone"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
          >
            Phone Number
          </label>
        </div>
        <div className="group relative z-0 mb-5 w-full">
          <input
            type="text"
            name="address"
            id="floating_address"
            className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-3 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            value={formData.address}
            onChange={handleChange}
          />
          <label
            htmlFor="floating_address"
            className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-focus:font-medium peer-focus:text-blue-600"
          >
            Address
          </label>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
        >
          Save Profile
        </button>
      </form>
      <SnackbarCustom
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)} // Close snackbar
      />
    </div>
  );
};

export default ProfileLayout;

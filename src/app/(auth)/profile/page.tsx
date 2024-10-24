'use client';

import { FC, useEffect, useState } from 'react';
import axiosInstance from '../../../../axiosConfig';
import ProfileLayout from '@/components/auth/myprofile';
import Loading from '@/components/Loading';
import RandomBackground from '@/components/RandomBackground'; // Import the RandomBackground component
import withAuth from '@/hoc/withAuth';
import SnackbarCustom from '@/components/Snackbar'; // Import SnackbarCustom
import { MyProfile } from '@/service/authService'; // Import MyProfile

const Profile: FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(''); // State for snackbar message
  const [profile, setProfile] = useState<ProfileDTO | null>(null); // State for profile data
  const [loading, setLoading] = useState(true); // State for loading

  const defaultProfile = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: new Date(''),
  } as ProfileDTO;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await MyProfile();
        setProfile(response.data.data); // Set the profile data
      } catch (error) {
        setSnackbarMessage('Failed to load profile data.'); // Set error message
        setSnackbarOpen(true); // Open snackbar
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfile(); // Call the fetch function
  }, []);

  if (loading) return <Loading />; // Show loading indicator

  return (
    <RandomBackground className="items-center justify-center">
      {/* Wrap the ProfileLayout with RandomBackground */}
      <ProfileLayout profile={profile || defaultProfile} />
      <SnackbarCustom
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={() => setSnackbarOpen(false)} // Close snackbar
      />
    </RandomBackground>
  );
};

export default withAuth(Profile);
// export default Profile;

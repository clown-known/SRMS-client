'use client';

import { FC } from 'react';
import useSWR from 'swr';
import axiosInstance from '../../../../axiosConfig';
import ProfileLayout from '@/components/auth/myprofile';
import Loading from '@/components/Loading';
import RandomBackground from '@/components/RandomBackground'; // Import the RandomBackground component

interface ProfileDTOResponse {
  data: ProfileDTO;
}

const Profile: FC = () => {
  const defaultProfile = {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: new Date(''),
  } as ProfileDTO;

  const fetcher = (url: string) => axiosInstance.get<ProfileDTOResponse>(url);

  const { data, isLoading } = useSWR(
    'authentication-service/profile',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  if (isLoading) return <Loading />;

  return (
    <RandomBackground>
      {' '}
      {/* Wrap the ProfileLayout with RandomBackground */}
      <ProfileLayout profile={data?.data.data || defaultProfile} />
    </RandomBackground>
  );
};

export default Profile;

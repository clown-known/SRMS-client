'use client';

import { FC, useState } from 'react';
import useSWR from 'swr';
import { revalidateEvents } from 'swr/_internal';
import axiosInstance from '../../../../axiosConfig';
import ProfileLayout from '@/components/auth/myprofile';
import UserDashboardLayout from '@/components/auth/UserDashboardLayout';
import Loading from '@/components/Loading';
import { UpdateMyProfile } from '@/service/authService';

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

  const { data, isLoading, isValidating } = useSWR(
    'authentication-service/profile',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  // console.log(data?.data.data);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
  };
  if (isLoading) return <Loading />;

  return <ProfileLayout profile={data?.data.data || defaultProfile} />;
};

export default Profile;

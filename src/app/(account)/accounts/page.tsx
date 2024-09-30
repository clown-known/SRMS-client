'use client';

import useSWR from 'swr';
import axiosInstance from '../../../../axiosConfig';
import Loading from '@/components/Loading';
import AccountTable from '@/components/account/AccountTable';

interface AccounstResponse {
  data: {
    data: AccountDTO[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}
export default function AccountsPage() {
  const fetcher = (url: string) => axiosInstance.get<AccounstResponse>(url);

  const { data, isLoading, isValidating } = useSWR(
    'authentication-service/account',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  if (isLoading) return <Loading />;
  if (isValidating) return <Loading />;
  //   console.log(data);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Account List</h1>
      <AccountTable accounts={data?.data.data.data || []} />
    </div>
  );
}

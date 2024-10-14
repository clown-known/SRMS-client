'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  KeyboardEvent,
} from 'react';
import Pagination from '@mui/material/Pagination';
import { useSelector } from 'react-redux';
import AccountTable from '@/components/account/AccountTable';
import AccountModalWrapper from './AccountModalWrapper';
import {
  AccountsPage,
  deleteAccount,
  getAccounts,
  mapToCreateAccountRequest,
  resetPassword,
  searchAccounts,
  updateAccount,
} from '@/service/accountService';
import SearchInput from './SearchInput';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';
import Loading from '../Loading';

interface AccountPageContentProps {
  initialAccounts: AccountsPage;
  initialRoles: RoleDTO[];
}

export default function AccountPageContent({
  initialAccounts,
  initialRoles,
}: AccountPageContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const permission = useSelector((state: RootState) => state.user.permissions); // Get permission from global state
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<AccountsPage>(initialAccounts);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPermissions() as any);
    setIsLoading(false);
  }, [dispatch]);

  const hasPermission = (permissionRequired: string) => {
    if (permission.length === 0) return false;
    return permission.includes(permissionRequired);
  };
  // console.log(`${permission.length === 0}${hasPermission('account:create')}`);
  const fetchAccounts = useCallback(
    async (term: string = '', currentPage: number = 1) => {
      setIsLoading(true);
      try {
        const fetchedAccounts = term
          ? await searchAccounts(term, currentPage)
          : await getAccounts(currentPage);
        setAccounts(fetchedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateSearchParam = useCallback(
    (term: string, currentPage: number) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      params.set('page', currentPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setPage(1);
      updateSearchParam(term, 1);
      fetchAccounts(term, 1);
    },
    [updateSearchParam, fetchAccounts]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm.trim());
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
    fetchAccounts(searchTerm);
  };

  const handleUpdateAccount = async (
    id: string,
    data: { email: string; roleId: string; profile: Partial<ProfileDTO> }
  ) => {
    await updateAccount(id, mapToCreateAccountRequest(data));
    fetchAccounts(searchTerm);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    updateSearchParam(searchTerm, value);
    fetchAccounts(searchTerm, value);
  };
  const handleResetPassword = async (id: string) => {
    try {
      await resetPassword(id);
      // You might want to show a success message here
      console.log('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      // You might want to show an error message here
    }
  };
  useEffect(() => {
    const searchTerm = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    setPage(currentPage);
    fetchAccounts(searchTerm, currentPage);
  }, [fetchAccounts, searchParams]);

  return (
    <div className="bg-gray-100 px-4 py-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="w-1/3">
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search accounts..."
            />
          </form>
        </div>
        {hasPermission('account:create') && (
          <AccountModalWrapper
            onAccountCreated={() => fetchAccounts(searchTerm)}
            rolesList={initialRoles}
          />
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <AccountTable
            accounts={accounts?.data}
            onDeleteAccount={handleDeleteAccount}
            onUpdateAccount={handleUpdateAccount}
            onResetPassword={handleResetPassword}
            roles={initialRoles}
            userPermissions={permission}
          />
          <div className="mt-4 flex justify-center">
            <Pagination
              count={accounts?.meta?.pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
}

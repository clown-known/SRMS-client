'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
  UpdateAccountRequest,
  assignRole,
  updateAccountWithRole,
  unAssignRole,
} from '@/service/accountService';
import SearchInput from './SearchInput';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';
import Loading from '../Loading';
import CustomSnackbar from '@/components/CustomSnackbar';

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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchUserPermissions() as any);
    setIsLoading(false);
  }, [dispatch]);

  const isSuperAdmin = useSelector(
    (state: RootState) => state.user.isSuperAdmin
  );
  const hasPermission = (permissionRequired: string) => {
    if (isSuperAdmin) return true;
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
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    updateSearchParam(searchTerm, value);
    fetchAccounts(searchTerm, value);
  };
  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      fetchAccounts(searchTerm);
      setSnackbarMessage('Account deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete account. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleUpdateAccount = async (
    id: string,
    data: UpdateAccountRequest
  ) => {
    try {
      if (hasPermission('account:assign-role')) {
        await updateAccountWithRole(id, data);
      } else {
        await updateAccount(id, data);
      }
      fetchAccounts(searchTerm);
      setSnackbarMessage('Account updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to update account. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      await resetPassword(id);
      setSnackbarMessage('Password reset successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to reset password. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignRole({ userId, roleId });
      fetchAccounts(searchTerm);
      setSnackbarMessage('Role assigned successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to assign role. Please try again.');
      setSnackbarOpen(true);
    }
  };
  const handleUnAssignRole = async (userId: string) => {
    try {
      await unAssignRole(userId);
      fetchAccounts(searchTerm);
      setSnackbarMessage('Role assigned successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to assign role. Please try again.');
      setSnackbarOpen(true);
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
            permission={permission}
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
            onAssignRole={handleAssignRole}
            onUniAssignRole={handleUnAssignRole}
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
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

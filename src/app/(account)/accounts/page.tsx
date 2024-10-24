'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRoles, RolesPage } from '@/service/roleService';
import AccountPageContent from '@/components/account/AccountPageContent';
import {
  getAccounts,
  AccountsPage as IAccountPage,
} from '@/service/accountService';
import Loading from '@/components/Loading';
import { Permission } from '@/app/lib/enum';
import RandomBackground from '@/components/RandomBackground';
import withPermission from '@/hoc/withPermission';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';

function AccountsPage() {
  const [initialAccounts, setInitialAccounts] = useState<IAccountPage>({
    data: [],
    meta: {
      page: 0,
      take: 0,
      itemCount: 0,
      pageCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
  const [initialRoles, setInitialRoles] = useState<RolesPage>({
    data: [],
    meta: {
      page: 0,
      take: 0,
      itemCount: 0,
      pageCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const dispatch = useAppDispatch();
  const permission = useSelector((state: RootState) => state.user.permissions);
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        // const accountsData = await getAccounts();
        // setInitialAccounts(accountsData);
        if (hasPermission(Permission.READ_ROLE)) {
          const rolesData = await getRoles();
          setInitialRoles(rolesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []);

  return (
    <RandomBackground>
      {' '}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white">Account List</h1>
        </div>
        {isLoading ? ( // Show loading state if data is being fetched
          <Loading />
        ) : (
          <AccountPageContent
            initialAccounts={initialAccounts}
            initialRoles={initialRoles.data}
          />
        )}
      </div>
    </RandomBackground>
  );
}

export default withPermission(AccountsPage, Permission.READ_ACCOUNT);
// export default AccountsPage;

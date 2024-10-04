'use client';

import { useState } from 'react';
import AccountTable from '@/components/account/AccountTable';
import AccountModalWrapper from './AccountModalWrapper';
import {
  deleteAccount,
  getAccounts,
  mapToCreateAccountRequest,
  updateAccount,
} from '@/service/accountService';

interface AccountPageContentProps {
  initialAccounts: AccountDTO[];
  initialRoles: RoleDTO[];
}

export default function AccountPageContent({
  initialAccounts,
  initialRoles,
}: AccountPageContentProps) {
  const [accounts, setAccounts] = useState<AccountDTO[]>(initialAccounts);

  const fetchAccounts = async () => {
    const accountsData = await getAccounts();
    setAccounts(accountsData || []);
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
    await fetchAccounts();
  };

  const handleUpdateAccount = async (
    id: string,
    data: { email: string; roleId: string; profile: Partial<ProfileDTO> }
  ) => {
    await updateAccount(id, mapToCreateAccountRequest(data));
    await fetchAccounts();
  };

  return (
    <div className="bg-gray-800 px-4 py-4">
      <div className="mb-6 flex items-center justify-end">
        <AccountModalWrapper
          onAccountCreated={fetchAccounts}
          rolesList={initialRoles}
        />
      </div>
      <AccountTable
        accounts={accounts}
        onDeleteAccount={handleDeleteAccount}
        onUpdateAccount={handleUpdateAccount}
        roles={initialRoles}
      />
    </div>
  );
}

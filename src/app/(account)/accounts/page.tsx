import { getRoles } from '@/service/roleService';
import AccountPageContent from '@/components/account/AccountPageContent';
import { getAccounts } from '@/service/accountService';

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

// eslint-disable-next-line @next/next/no-async-client-component
async function AccountsPage() {
  const accountsData = await getAccounts();
  const initialAccounts = accountsData || [];
  const rolesData = await getRoles();
  const initialRoles = rolesData.data.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Account List</h1>
      </div>
      <AccountPageContent
        initialAccounts={initialAccounts}
        initialRoles={initialRoles}
      />
    </div>
  );
}

export default AccountsPage;

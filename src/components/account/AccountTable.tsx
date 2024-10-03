import UpdateButton from './UpdateButton'; // We'll create this client component separately

interface AccountTableProps {
  accounts: AccountDTO[];
}

export default function AccountTable({ accounts }: AccountTableProps) {
  console.log(accounts);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full overflow-hidden rounded-lg bg-gray-800 shadow-md">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-gray-300">Account ID</th>
            <th className="px-4 py-2 text-left text-gray-300">Email</th>
            <th className="px-4 py-2 text-left text-gray-300">Full Name</th>
            <th className="px-4 py-2 text-left text-gray-300">Role</th>
            <th className="px-4 py-2 text-left text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-t border-gray-700">
              <td className="px-4 py-2 text-white">{account.id}</td>
              <td className="px-4 py-2 text-white">{account.email}</td>
              <td className="px-4 py-2 text-white">
                {account.profile?.fullName}
              </td>
              <td className="px-4 py-2 text-white">{account.role?.name}</td>
              <td className="px-4 py-2">
                <UpdateButton accountId={account.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

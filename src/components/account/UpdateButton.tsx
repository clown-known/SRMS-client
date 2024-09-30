'use client';

import { useRouter } from 'next/navigation';

interface UpdateButtonProps {
  accountId: string;
}

export default function UpdateButton({ accountId }: UpdateButtonProps) {
  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/accounts/update/${accountId}`);
  };

  return (
    <button
      type="button"
      onClick={handleUpdate}
      className="rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
    >
      Update
    </button>
  );
}

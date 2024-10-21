import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const usePermissionCheck = (permisisonToCheck: string) => {
  const permissions = useSelector((state: RootState) => state.user.permissions);

  const router = useRouter();

  useEffect(() => {
    const isValid = permissions.includes(permisisonToCheck);
    if (!isValid) {
      router.push('/403'); // Redirect user to 403 page
    }
  }, [permissions, permisisonToCheck, router]);
};

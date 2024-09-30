'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadUserFromStorage } from '@/store/userSlice';
import { RootState, useAppDispatch } from '@/store/store';
import UserProfileDropdown from './UserDropdown';
import HeaderLink from './HeaderLink';
import { useCookie } from '@/hook/useCookie';

const Welcome = () => {
  const userName = useSelector((state: RootState) => state.user.username);
  const dispatch = useAppDispatch();
  const permission = useSelector((state: RootState) => state.user.permission); // Get permission from global state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    dispatch(loadUserFromStorage());
    setIsLoading(false);
  }, [dispatch]);
  const renderContent = () => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <HeaderLink permission={permission} />
      {userName ? (
        <UserProfileDropdown name={userName} />
      ) : (
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/login">
                <div className="hover:text-gray-300">Login</div>
              </Link>
            </li>
            <li>
              <Link href="/register">
                <div className="hover:text-gray-300">Register</div>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{isLoading ? <span>Loading...</span> : renderContent()}</>;
};
export default Welcome;

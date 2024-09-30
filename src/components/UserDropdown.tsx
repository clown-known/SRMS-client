'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '@/store/store';
import { logoutState } from '@/store/userSlice';

interface IProps {
  name: string;
}

const UserProfileDropdown = (props: IProps) => {
  const { name } = props;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutState());
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center"
      >
        Wellcome
        <span className="ml-2">{name}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            My Profile
          </Link>
          <Link
            href="/account"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            My Account
          </Link>
          <hr className="my-2" />
          <Link
            href="/"
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Log Out
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;

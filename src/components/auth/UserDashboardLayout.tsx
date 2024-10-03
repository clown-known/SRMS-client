import Link from 'next/link';
import React from 'react';

const UserDashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex h-screen flex-col bg-gray-200 text-white">
      <div className="flex flex-1">
        <nav className="w-1/8 bg-gray-400 p-4">
          <ul>
            <li className="mb-2">
              <Link href="/a" className="hover:text-pink-500">
                Profile Manager
              </Link>
            </li>
            <li className="mb-2">
              <a href="/a" className="hover:text-pink-500">
                Account Manager
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;

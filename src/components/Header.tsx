import Link from 'next/link';

import siteMetadata from '@/data/siteMetadata';
import Logo from '@/data/logo.svg';
import headerNavLinks from '@/data/headerNavLinks';
import MobileNav from './MobileNav';
import UserProfileDropdown from './UserDropdown';
import Welcome from './Welcome';

const Header = () => {
  return (
    <header className="left-0 top-0 z-50 w-full bg-gray-800 text-white shadow-lg">
      {' '}
      {/* Added fixed positioning */}
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Project Name on the left */}

        <h1 className="text-2xl font-bold">
          <Link href="/">
            <div className="hover:text-gray-300">SRMS</div>
          </Link>
        </h1>
        <MobileNav />
        {/* <UserProfileDropdown /> */}
        <Welcome />
      </div>
    </header>
  );
};

export default Header;

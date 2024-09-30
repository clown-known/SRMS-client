import Link from 'next/link';

import siteMetadata from '@/data/siteMetadata';
import Logo from '@/data/logo.svg';
import headerNavLinks from '@/data/headerNavLinks';
import MobileNav from './MobileNav';
import UserProfileDropdown from './UserDropdown';
import Welcome from './Welcome';

// const Header = () => {
//   let headerClass =
//     'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10';
//   if (siteMetadata.stickyNav) {
//     headerClass += ' sticky top-0 z-50';
//   }

//   return (
//     <header className={headerClass}>
//       <Link href="/" aria-label={siteMetadata.headerTitle}>
//         <div className="flex items-center justify-between">
//           <div className="mr-3">
//             <Logo />
//           </div>
//           {typeof siteMetadata.headerTitle === 'string' ? (
//             <div className="hidden h-6 text-2xl font-semibold sm:block">
//               {siteMetadata.headerTitle}
//             </div>
//           ) : (
//             siteMetadata.headerTitle
//           )}
//         </div>
//       </Link>
//       <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
//         <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
//           {headerNavLinks
//             .filter((link) => link.href !== '/')
//             .map((link) => (
//               <Link
//                 key={link.title}
//                 href={link.href}
//                 className="hover:text-primary-500 dark:hover:text-primary-400 block font-medium text-gray-900 dark:text-gray-100"
//               >
//                 {link.title}
//               </Link>
//             ))}
//         </div>
//         {/* <SearchButton />
//         <ThemeSwitch />
//         <MobileNav /> */}
//       </div>
//     </header>
//   );
// };

// export default Header;

const Header = () => {
  return (
    <header className="left-0 top-0 z-50 w-full bg-gray-800 text-white shadow-lg">
      {' '}
      {/* Added fixed positioning */}
      <div className="container mx-auto flex items-center justify-between p-4">
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

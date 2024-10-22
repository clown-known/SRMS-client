import Link from 'next/link';
import { usePathname } from 'next/navigation';
import headerNavLinks from '@/data/headerNavLinks';

interface IProps {
  permission: string[];
}

const HeaderLink = (props: IProps) => {
  const { permission } = props;
  const pathname = usePathname();
  // const modules =
  //   permission && permission.length !== 0
  //     ? Array.from(new Set<string>(permission.map((per) => per.split(':')[0])))
  //     : [];
  const modules = permission && permission.length !== 0 ? permission : [];
  // console.log(modules);
  return (
    <div className="no-scrollbar hidden h-full items-center space-x-1 overflow-x-auto sm:flex">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .filter(
          (per) => modules.includes(per.permission) || per.permission === ''
        )
        .map((link) => {
          const isActive = pathname.includes(link.href);
          return (
            <Link
              key={link.title}
              href={link.href}
              className={`flex h-full items-center px-4 font-medium text-gray-900 transition-colors hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700 ${
                isActive ? 'bg-gray-500 text-white' : ''
              }`}
            >
              {link.title}
            </Link>
          );
        })}
    </div>
  );
};

export default HeaderLink;

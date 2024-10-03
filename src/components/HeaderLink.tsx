import Link from 'next/link';
import headerNavLinks from '@/data/headerNavLinks';

interface IProps {
  permission: string[];
}

const HeaderLink = (props: IProps) => {
  const { permission } = props;
  const modules =
    permission && permission.length !== 0
      ? Array.from(new Set<string>(permission.map((per) => per.split(':')[0])))
      : [];
  return (
    <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
      {headerNavLinks
        .filter((link) => link.href !== '/')
        .filter(
          (per) => modules.includes(per.permission) || per.permission === ''
        )
        .map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="hover:text-primary-500 dark:hover:text-primary-400 block font-medium text-gray-900 dark:text-gray-100"
          >
            {link.title}
          </Link>
        ))}
    </div>
  );
};
export default HeaderLink;

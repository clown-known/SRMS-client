import Link from 'next/link';

interface NavLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  [key: string]: any; // For any additional props
}

const NavLink: React.FC<NavLinkProps> = ({
  children,
  href,
  className = '',
  ...props
}) => (
  <Link
    href={href}
    {...props}
    className={`rounded-lg px-4 py-2.5 text-center duration-150 ${className}`}
  >
    {children}
  </Link>
);

export default NavLink;

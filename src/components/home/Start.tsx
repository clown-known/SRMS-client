import NavLink from './NavLink';
import SectionWrapper from './SectionWrapper';

interface StartProp {
  title: string;
  content: string;
  href: string;
}
const Start: React.FC<StartProp> = ({ title, content, href }) => (
  <SectionWrapper>
    <div className="custom-screen">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-gray-100 sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 text-gray-200">{content}</p>
        <NavLink
          href={href}
          className="mt-4 inline-block bg-gray-800 text-sm font-medium text-white hover:bg-gray-600 active:bg-gray-900"
        >
          Start Demo
        </NavLink>
      </div>
    </div>
  </SectionWrapper>
);

export default Start;

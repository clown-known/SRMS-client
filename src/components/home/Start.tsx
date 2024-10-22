import NavLink from './NavLink';
import SectionWrapper from './SectionWrapper';

const Start = () => (
  <SectionWrapper>
    <div className="custom-screen">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-gray-100 sm:text-4xl">
          Get started with Blinder today
        </h2>
        <p className="mt-3 text-gray-200">
          Hire experts to create your next idea, follow best practices, remove
          roadblocks, and delivery on schedule.
        </p>
        <NavLink
          href="/login"
          className="mt-4 inline-block bg-gray-800 text-sm font-medium text-white hover:bg-gray-600 active:bg-gray-900"
        >
          Start Demo
        </NavLink>
      </div>
    </div>
  </SectionWrapper>
);

export default Start;

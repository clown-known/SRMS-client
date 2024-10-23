import Image from 'next/image';
import SectionWrapper from './SectionWrapper';
import NavLink from './NavLink';

const CTA = () => {
  return (
    <SectionWrapper id="cta" className="pb-0">
      <div className="custom-screen px-4">
        <div className="items-center gap-x-12 lg:flex">
          <div className="flex-1 justify-center rounded-lg bg-white p-4 lg:flex">
            <Image
              width={700}
              height={600}
              src="/assets/images/system_overview.png"
              className="rounded-lg"
              alt="Create Successful Business Models with Our IT Solutions"
            />
          </div>
          <div className="mt-6 max-w-xl md:mt-0 lg:max-w-2xl">
            <h2 className="text-3xl font-semibold text-gray-100 sm:text-4xl">
              Create Successful Business Models with Our IT Solutions
            </h2>
            <p className="mt-3 text-gray-200">
              Blinder, a software development company, helps to digitize
              businesses by focusing on client’s business challenges, needs. We
              value close transparent cooperation and encourage our clients to
              participate actively in the project development life cycle.
            </p>
            <NavLink
              href="/get-started"
              className="text-md mt-4 inline-block bg-indigo-600 font-medium text-white hover:bg-indigo-700 active:bg-indigo-800"
            >
              Get started
            </NavLink>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CTA;

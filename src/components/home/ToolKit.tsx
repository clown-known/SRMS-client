/* eslint-disable react/no-array-index-key */
import Image from 'next/image';

import SectionWrapper from './SectionWrapper';

const ToolKit = () => {
  const features = [
    {
      icon: '/assets/icons/wordpress.svg',
      title: 'Wordpress',
      desc: 'WordPress is an open-source content management system (CMS).',
    },
    {
      icon: '/assets/icons/nextjs.svg',
      title: 'Next.js',
      desc: 'Next.js is a React framework that gives you building blocks to create web apps.',
    },
    {
      icon: '/assets/icons/tailwind.svg',
      title: 'Tailwind CSS',
      desc: 'Tailwind CSS is basically a utility-first CSS framework for rapidly building UIs.',
    },
    {
      icon: '/assets/icons/nodejs.svg',
      title: 'Node.js',
      desc: 'Node.js is an open-source, cross-platform, back-end JavaScript runtime environment.',
    },
    {
      icon: '/assets/icons/vercel.svg',
      title: 'Vercel',
      desc: 'Vercel is a cloud platform that enables developers to host web apps.',
    },
    {
      icon: '/assets/icons/figma.svg',
      title: 'Figma',
      desc: 'Figma is a web-based graphics editing and user interface design app.',
    },
  ];

  return (
    <SectionWrapper>
      <div
        id="toolkit"
        className="mx-auto max-w-screen-xl px-4 text-gray-100 md:px-8"
      >
        <div className="mx-auto max-w-2xl space-y-3 sm:text-center">
          <h2 className="text-3xl font-semibold text-gray-200 sm:text-4xl">
            Technology we using
          </h2>
          <p>These are a few of our technologies</p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li key={idx} className="flex gap-x-4">
                <div className="gradient-border flex h-12 w-12 flex-none items-center justify-center rounded-full">
                  <Image
                    height={30}
                    width={30}
                    src={item.icon}
                    alt={item.title}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-200">
                    {item.title}
                  </h4>
                  <p className="mt-3">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ToolKit;

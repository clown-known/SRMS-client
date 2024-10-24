/* eslint-disable @next/next/no-img-element */
import SectionWrapper from './SectionWrapper';

const Features = () => {
  const features = [
    {
      // Updated to use the provided image
      icon: (
        <img
          src="/assets/logos/website.png"
          alt="Logo"
          className="h-16 w-16 object-center invert filter"
        />
      ),
      title: 'Shipping Route Management Web App',
      desc: 'A website that allows users to easily operate, manage resources, and view routes, we believe you will be satisfied with this.',
    },
    {
      // Updated to use the provided image
      icon: (
        <img
          src="/assets/logos/insurance.png"
          alt="Logo"
          className="h-16 w-16 object-center invert filter"
        />
      ),
      title: 'Auth Service',
      desc: 'Protecting your account and control is also our goal',
    },
    {
      // Updated to use the provided image
      icon: (
        <img
          src="/assets/logos/cargo-ship.png"
          alt="Logo"
          className="h-16 w-16 object-center invert filter"
        />
      ),
      title: 'Route Service',
      desc: 'Easily search for points and routes in our system, we also provide you with effective solutions to manage it.',
    },
    {
      // Updated to use the provided image
      icon: (
        <img
          src="/assets/logos/notification-bell.png"
          alt="Logo"
          className="h-16 w-16 object-center invert filter"
        />
      ),
      title: 'Notification Service',
      desc: 'When there are any changes to your account, it will immediately notify your email address. Please check your email regularly.',
    },
  ];

  return (
    <SectionWrapper>
      <div className="mx-auto max-w-2xl space-y-3 pb-12 sm:text-center">
        <h2 className="pb-12 text-3xl font-semibold text-gray-200 sm:text-4xl">
          We have four CORES feature
        </h2>
      </div>
      <div id="features" className="custom-screen px-20 text-gray-200">
        <ul className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={idx} className="space-y-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border text-indigo-200">
                {item.icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-100">
                {item.title}
              </h4>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </SectionWrapper>
  );
};

export default Features;

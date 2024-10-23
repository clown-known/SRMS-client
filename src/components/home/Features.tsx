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
      desc: 'We care about the quality of the product. As a digital product development agency, we believe in beautiful software.',
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
      desc: 'We use the modern and most flexible and secure technologies to build the best products on the internet.',
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
      desc: 'At Software Security Solutions our mission is to raise the bar by making computer security more accessible.',
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
      desc: 'At Software Security Solutions our mission is to raise the bar by making computer security more accessible.',
    },
  ];

  return (
    <SectionWrapper>
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

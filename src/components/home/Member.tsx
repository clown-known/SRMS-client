/* eslint-disable react/no-array-index-key */
import SectionWrapper from './SectionWrapper';

const Member = () => {
  const members = [
    {
      avatar: '/assets/images/Nam.jpg',
      name: 'Nam Nguyen',
      title: 'Full-stack Developer ( Leader)',
      quote:
        'As a small business owner, I was doing everything and my workload was increasing. With this startup, I was able to save time so I could focus on the things that matter most: my clients and my family.',
    },
    {
      avatar: '/assets/images/Kiet.png',
      name: 'Kiet Lai',
      title: 'Full-stack Developer',
      quote:
        "My company's software now is easy to use, saves time and money, and is loved by a lot of users. One customer saved $10k over the course of 3 years and another saves 8 hours per week! Thanks to Blinder.",
    },
  ];

  return (
    <SectionWrapper className="pb-0">
      <div id="testimonials" className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="max-w-2xl sm:text-center md:mx-auto">
          <h2 className="text-3xl font-semibold text-gray-100 sm:text-4xl">
            Team Members
          </h2>
          <p className="mt-3 text-gray-200">
            About us and the main responsibilities.
          </p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {members.map((item, idx) => (
              <li key={idx} className="rounded-xl border bg-white p-4">
                <figure>
                  <div className="flex items-center gap-x-4">
                    <img
                      src={item.avatar}
                      className="h-20 w-20 rounded-full object-cover"
                      alt={item.name}
                    />
                    <div>
                      <span className="block font-semibold text-gray-800">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-sm text-gray-600">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <blockquote>
                    <p className="mt-6 text-gray-700">{item.quote}</p>
                  </blockquote>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Member;

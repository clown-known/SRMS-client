/* eslint-disable react/no-array-index-key */
import SectionWrapper from './SectionWrapper';

const Member = () => {
  const members = [
    {
      avatar: '/assets/images/Nam.jpg',
      name: 'Nam Nguyen',
      title: 'Full-stack Developer ( Leader)',
      quote: [
        'As a Leader, I will be responsible for planning, managing progress, orienting the project, the techniques used as well as handling business in this project.',
        'As a Full-stack developer, I am responsible for handling parts related to users, roles and permissions in the project, authentication and authorization handlers in the authentication service and other services using gRPC, nginx configuration for the gateway service, and create the interface for those sections, along with the home page design.',
      ],
    },
    {
      avatar: '/assets/images/Kiet.png',
      name: 'Kiet Lai',
      title: 'Full-stack Developer',
      quote: [
        'As a Full-stack developer, I am responsible for the route part as well as notification service, config kafka communication and interface design for the above parts, learn and integrate 3rd party services to display maps as well as route. In addition, I also create email templates to notify users.',
      ],
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
                  <blockquote className="mt-6">
                    {item.quote.map((quote, index) => (
                      <p key={index} className="text-gray-700">
                        {quote}
                      </p>
                    ))}
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

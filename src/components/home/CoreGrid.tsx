import Image from 'next/image';

const logos = [
  {
    src: '/assets/images/logo.webp',
    alt: '',
  },
];

const CoreGrid = () => (
  <div>
    <div className="custom-screen">
      <h2 className="text-center text-sm font-semibold text-gray-200">
        © 2024 Team 5. All rights reserved.
      </h2>
      <div className="mt-6">
        <ul className="h-70 flex flex-wrap items-center justify-center space-x-10 text-gray-200 md:space-x-16">
          {logos.map((item, idx) => (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={idx}
              className="h-50 w-50 flex flex-col items-center text-center"
            >
              <Image
                width={400}
                height={400}
                src={item.src}
                alt={item.alt}
                className="invert filter"
              />
              <span className="break-words text-white">{item.alt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default CoreGrid;

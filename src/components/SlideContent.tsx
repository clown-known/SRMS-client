import React from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBack, ChevronLeft, ChevronRight } from '@mui/icons-material';
// import { ArrowRightIcon } from '@heroicons/react/24/solid';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SlideProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
}

const SlideContent: React.FC<SlideProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
}) => (
  <div className="flex h-screen bg-gray-900 text-white">
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-1/2 items-center justify-center p-8"
    >
      <img
        src={imageUrl}
        alt={title}
        className="max-h-full max-w-full object-contain"
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex w-1/2 flex-col justify-center p-8"
    >
      <h2 className="mb-3 text-4xl font-bold">{title}</h2>
      <h3 className="mb-4 text-2xl text-yellow-500">{subtitle}</h3>
      <p className="mb-6 text-base">{description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex w-max items-center rounded-full bg-gray-800 px-6 py-2 text-sm text-white transition-colors hover:bg-gray-700"
      >
        LEARN MORE <ArrowBack className="ml-2 h-4 w-4" />
      </motion.button>
    </motion.div>
  </div>
);

const CustomArrow = ({ className, style, onClick, icon }: any) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <div
    className={`${className} z-10 before:content-none`}
    style={{ ...style, display: 'block' }}
    onClick={onClick}
  >
    {icon}
  </div>
);

const HomeSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    cssEase: 'linear',
    nextArrow: (
      <CustomArrow icon={<ChevronRight className="h-8 w-8 text-white" />} />
    ),
    prevArrow: (
      <CustomArrow icon={<ChevronLeft className="h-8 w-8 text-white" />} />
    ),
    // eslint-disable-next-line react/no-unstable-nested-components
    appendDots: (dots: any) => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px' }}> {dots} </ul>
      </div>
    ),
  };

  const slides: SlideProps[] = [
    {
      title: 'OPUS CONTAINER',
      subtitle: 'Container Liner Operation Solution',
      description:
        "OPUS Container is a maritime container solution that offers efficient management by integrating the entire business in container operations. From shipment booking to its safe arrival at the customer's destination, it can perform systematic process management through centralized control, which meets global standard work methods and processes.",
      imageUrl:
        'https://www.cyberlogitec.com/img/main/img_solution_cont02_3.png',
    },
    {
      title: 'OPUS CONTAINER',
      subtitle: 'Container Liner Operation Solution 2',
      description:
        "OPUS Container is a maritime container solution that offers efficient management by integrating the entire business in container operations. From shipment booking to its safe arrival at the customer's destination, it can perform systematic process management through centralized control, which meets global standard work methods and processes.",
      imageUrl:
        'https://www.cyberlogitec.com/img/main/img_solution_cont02_4.png',
    },
    // Add more slide objects here...
  ];

  return (
    <div className="relative h-screen">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SlideContent key={index} {...slide} />
        ))}
      </Slider>
    </div>
  );
};

export default HomeSlider;

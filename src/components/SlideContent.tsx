import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ArrowBack, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Image from 'next/image';
import Modal from '@mui/material/Modal';

interface SlideProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  redirectUrl: string;
}

const SlideContent: React.FC<SlideProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  redirectUrl,
}) => {
  const [open, setOpen] = useState(false); // State to manage modal visibility

  const handleOpen = () => setOpen(true); // Function to open modal
  const handleClose = () => setOpen(false); // Function to close modal

  return (
    <div className="flex h-screen text-white">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }} // Move out to the left
        transition={{ duration: 0.5 }}
        className="flex w-3/5 items-center justify-center p-8"
      >
        <Image
          width={900}
          height={800}
          src={imageUrl}
          alt={title}
          onClick={handleOpen}
          className="max-h-full max-w-full rounded-lg bg-white object-contain p-4"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }} // Move out to the right
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex w-2/5 flex-col justify-center pr-12"
      >
        <h2 className="mb-3 text-4xl font-bold">{title}</h2>
        <h3 className="mb-4 text-2xl text-yellow-500">{subtitle}</h3>
        <p className="mb-6 text-base">{description}</p>
        <a
          href={redirectUrl} // Use an anchor tag for redirection
          target="_blank" // Optional: Open in a new tab
          rel="noopener noreferrer" // Optional: Security best practice
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex w-max items-center rounded-full bg-gray-800 px-6 py-2 text-sm text-white transition-colors hover:bg-gray-700"
          >
            View Project <ArrowBack className="ml-2 h-4 w-4" />
          </motion.button>
        </a>
      </motion.div>

      {/* Modal for full-screen image */}
      <Modal
        open={open}
        onClose={handleClose}
        className="flex items-center justify-center"
      >
        <div className="bg-white p-4">
          <Image
            src={imageUrl}
            alt={title}
            layout="responsive"
            width={1000}
            height={800}
            className="max-w-screen max-h-screen object-contain p-6"
          />
        </div>
      </Modal>
    </div>
  );
};

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
  const sliderRef = useRef<Slider>(null);

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
    arrows: false, // Disable default arrows
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
      title: 'BACKEND OVERVIEW',
      subtitle:
        'Microservices Architecture with Nginx Gateway, gRPC, and Kafka for Scalable Communication',
      description:
        'Client interacts with multiple backend services through an Nginx gateway. The client sends HTTP requests to the gateway on port 3000, which routes them to the appropriate services. The Route service is accessible via HTTP on port 3002 and interacts with its dedicated PostgreSQL database for managing route-related data. The Authentication service, accessible on port 3001, manages user authentication by connecting to a PostgreSQL database and a Redis-based cache system (Cache Master). It also communicates with the Notification service through Kafka on port 9092 for event-based messaging. Additionally, the Route and Authentication services communicate internally over gRPC on port 7000. This architecture efficiently handles service routing, inter-service communication, and event-driven notifications, ensuring a scalable and modular system.',
      imageUrl: '/assets/images/system_overview.svg',
      redirectUrl: 'https://github.com/clown-known/SRMS-server',
    },
    {
      title: 'FRONTEND OVERVIEW',
      subtitle: 'Container Liner Operation Solution 2',
      description:
        'The SRMS (System Resource Management System) integrated with the Leaflet library offers a robust solution for online map management, enabling efficient control and integration of mapping activities. With Leaflet, users can effortlessly create interactive maps, from placing markers to drawing routes, all through a simple and intuitive interface.',
      imageUrl: '/assets/images/frontend.png',
      redirectUrl: 'https://github.com/clown-known/SRMS-client',
    },
    // Add more slide objects here...
  ];

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <SlideContent key={index} {...slide} />
        ))}
      </Slider>
      <IconButton
        onClick={goToPrev}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform"
        sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={goToNext}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform"
        sx={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <ChevronRight />
      </IconButton>
    </div>
  );
};

export default HomeSlider;

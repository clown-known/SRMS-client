import React from 'react';
import { motion } from 'framer-motion';

interface YouTubeVideoProps {
  videoId: string;
  title: string;
  subtitle: string;
  description: string;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoId,
  title,
  subtitle,
  description,
}) => {
  return (
    <motion.div
      className="flex h-screen bg-gray-900 text-white"
      initial={{ opacity: 0, y: 50 }} // Initial state
      whileInView={{ opacity: 1, y: 0 }} // State when in view
      transition={{ duration: 0.5 }} // Transition duration
      viewport={{ once: false }} // Allow multiple triggers
    >
      <div className="flex w-2/5 flex-col items-center justify-center p-8 text-center">
        <h2 className="mb-3 text-4xl font-bold">{title}</h2>
        <h3 className="mb-4 text-2xl text-yellow-500">{subtitle}</h3>
        <p className="mb-6 text-base">{description}</p>
      </div>
      <div className="flex w-3/5 items-center justify-center p-8">
        <div className="relative w-full max-w-3xl">
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default YouTubeVideo;

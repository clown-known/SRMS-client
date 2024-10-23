import React, { useEffect, useState } from 'react';

const backgroundImages = [
  'https://images.wallpaperscraft.com/image/single/sea_waves_ocean_126805_3840x2160.jpg',
  'https://i.pinimg.com/enabled_hi/1200x/40/40/a1/4040a1195b6c130907536a1d939fe956.jpg',
  'https://i.pinimg.com/1200x/aa/f8/08/aaf8084426912df149864928ce9b9a29.jpg',
  // Add more image URLs as needed
];

const RandomBackground: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {children}
    </div>
  );
};

export default RandomBackground;

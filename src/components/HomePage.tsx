// pages/index.tsx
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { motion } from 'framer-motion'; // For smooth animations

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    // Perform search logic here
    console.log('Searching for:', searchTerm);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600"
    >
      {/* Main Container */}
      <div className="w-full max-w-2xl space-y-8 rounded-lg bg-white p-6 shadow-lg">
        {/* Intro Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-center text-4xl font-bold text-gray-800">
            Welcome to Simple Shipping Routes
          </h1>
          <p className="mt-4 text-center text-gray-500">
            Find the best shipping routes tailored to your needs.
          </p>
        </motion.div>

        {/* Route Finder Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <TextField
              label="Enter destination"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              InputProps={{
                className: 'text-gray-800',
              }}
              sx={{ marginBottom: '20px' }}
            />
            <Button
              variant="contained"
              color="primary"
              className="w-full"
              onClick={handleSearch}
              sx={{
                backgroundColor: '#4A90E2',
                '&:hover': { backgroundColor: '#357ABD' },
              }}
            >
              Find Route
            </Button>
          </div>
        </motion.div>

        {/* Additional Interactive Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="rounded-lg bg-gray-100 p-4"
        >
          <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">
            Popular Routes
          </h2>
          <ul className="space-y-4">
            {['Route 1', 'Route 2', 'Route 3'].map((route) => (
              <motion.li
                whileHover={{ scale: 1.05 }}
                key={route}
                className="cursor-pointer rounded-lg bg-white p-4 shadow"
              >
                {route}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

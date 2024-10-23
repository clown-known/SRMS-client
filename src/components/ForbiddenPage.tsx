import { useRouter } from 'next/navigation';
import React from 'react';
import RandomBackground from '@/components/RandomBackground'; // Import the RandomBackground component

const ForbiddenPage: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/'); // Redirect to the home page or any other page
  };

  return (
    <RandomBackground className="items-center justify-center">
      <div className="flex h-64 w-96 items-center justify-center rounded-[10px] bg-gray-100 bg-opacity-70 p-10">
        {' '}
        {/* Added bg-opacity for better readability */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">403 Forbidden</h1>
          <p className="mt-4 text-lg text-gray-700">
            You do not have permission to access this page.
          </p>
          <button
            type="button"
            onClick={handleRedirect}
            className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    </RandomBackground>
  );
};

export default ForbiddenPage;

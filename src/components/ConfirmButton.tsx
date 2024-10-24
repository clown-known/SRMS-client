import React from 'react';

interface ConfirmButtonProps {
  onClick: () => void;
}

const ConfirmButton = ({ onClick }: ConfirmButtonProps) => {
  return (
    <button
      type="button"
      className="transform rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 active:translate-y-0.5"
    >
      Yes
    </button>
  );
};

export default ConfirmButton;

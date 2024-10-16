import React from 'react';

interface CancelButtonProps {
  onClick: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-gray-300 px-5 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200"
    >
      Cancel
    </button>
  );
};

export default CancelButton;

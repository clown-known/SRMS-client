import React from 'react';

interface ConfirmButtonProps {
  onClick: () => void;
}

const ConfirmButton = ({ onClick }: ConfirmButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus className="rounded-lg bg-red-300 px-5 py-3 text-center text-sm font-medium text-red-700 hover:bg-red-400 focus:outline-none focus:ring-4 focus:ring-red-200">
      Yes
    </button>
  );
};

export default ConfirmButton;

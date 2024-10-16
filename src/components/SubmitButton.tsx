import React from 'react';
import classNames from 'classnames';

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  colorClasses?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  colorClasses,
  className,
  ...props
}) => {
  const defaultColorClasses =
    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 disabled:bg-blue-300';

  const buttonClasses = classNames(
    'rounded-lg px-5 py-3 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed',
    colorClasses || defaultColorClasses,
    className
  );

  return (
    <button type="submit" className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default SubmitButton;

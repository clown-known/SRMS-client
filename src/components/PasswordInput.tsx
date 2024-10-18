import React, { useState } from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';

interface PasswordInputWithToggleProps {
  id: string;
  name: string;
  label: string;
  // eslint-disable-next-line react/require-default-props
  required?: boolean;
  // eslint-disable-next-line react/require-default-props
  minLength?: number;
}

const PasswordInputWithToggle: React.FC<PasswordInputWithToggleProps> = ({
  id,
  name,
  label,
  required = false,
  minLength = 6,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      <label
        className="mb-2 block text-sm font-bold text-gray-700"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 pr-10 leading-tight text-gray-700 shadow focus:outline-none"
          required={required}
          minLength={minLength}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <IconButton
            aria-label="toggle password visibility"
            onClick={toggleShowPassword}
            edge="end"
            size="small"
          >
            {showPassword ? (
              <VisibilityOff fontSize="small" />
            ) : (
              <Visibility fontSize="small" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputWithToggle;

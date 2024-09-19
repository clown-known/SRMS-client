import { TextField } from '@mui/material';
import React from 'react'

interface CustomInputProps {
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
  
const CustomInput: React.FC<CustomInputProps> = ({ label, type = 'text', value, onChange }) => {
  return (
    <TextField variant="outlined" label={label} value={value} onChange={onChange} fullWidth className='mb-4'  />
  )
}

export default CustomInput
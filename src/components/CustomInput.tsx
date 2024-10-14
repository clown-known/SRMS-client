import { TextField } from '@mui/material';
import React from 'react'

interface CustomInputProps {
  label: string;
  value?: string | number;
  // placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
  
const CustomInput = ({ label, value, onChange, disabled }: CustomInputProps) => {
  return (
    <TextField variant="standard" label={label} value={value ? String(value) : ''} onChange={onChange} disabled={disabled} fullWidth className='mb-4'  />
  )
}

export default CustomInput
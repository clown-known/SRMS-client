import { TextField } from '@mui/material';
import React from 'react'

interface CustomInputProps {
  label: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
  
const CustomInput = ({ label, type = 'text', value, onChange, disabled }: CustomInputProps) => {
  return (
    <TextField variant="outlined" label={label} value={value ? String(value) : ''} onChange={onChange} disabled={disabled} fullWidth className='mb-4'  />
  )
}

export default CustomInput
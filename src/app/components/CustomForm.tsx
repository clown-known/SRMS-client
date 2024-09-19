import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import React from 'react'

interface CustomFormProps{
    title: string;
    description?: string;
    fields: {
      label: string;
      type?: string;
      placeholder?: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }[]
    submitButtonText: string;
    onSubmit: () => void;
    footerText?: string;
    footerLinkText?: string;
    footerLinkHref?: string;
}


const CustomForm: React.FC<CustomFormProps> = ({ title, description, fields, submitButtonText, onSubmit, footerText, footerLinkText, footerLinkHref }) => {
  return (
    <form>
        <Typography variant="h5" component="h1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" gutterBottom>
            {description}
        </Typography>
        {fields.map((field, index)=> (
          <TextField key={index} label={field.label} type={field.type} placeholder={field.placeholder} value={field.value} onChange={field.onChange} fullWidth margin="normal" />
        ))}
        <Button variant="contained" color="primary" fullWidth onClick={onSubmit} sx={{ mt: 2 }}> {submitButtonText} </Button>
    </form>
  )
}

export default CustomForm
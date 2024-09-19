"use client";
import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import CustomForm from '@/app/components/CustomForm';
import { Metadata } from 'next';



const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const metadata: Metadata = {
    title: 'Login Page',
    description: 'Description about this page',
  }

  const handleLogin = () => {
  };

  return (
    <Grid container sx={{ height: '100vh', width: '194vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <CustomForm
          title="Welcome back!"
          description="Enter your credentials to access your account"
          fields={[
            { label: 'Email address', value: email, onChange: (e) => setEmail(e.target.value) },
            { label: 'Password', type: 'password', value: password, onChange: (e) => setPassword(e.target.value) }
          ]}
          submitButtonText="Login"
          onSubmit={handleLogin}
          footerText="Don't have an account?"
          footerLinkText="Sign Up"
          footerLinkHref="/signup"
        />
      </Grid>
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: 'url(/assets/images/side-form.jpg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          
        }}
      />
    </Grid>
  );
};

export default LoginPage;

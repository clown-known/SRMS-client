import { useState } from 'react';
import Cookies from 'js-cookie';

type CookieOptions = {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Lax' | 'Strict' | 'None';
};

export const useCookie = (key: string) => {
  // Initialize state with the current cookie value
  const [cookieValue, setCookieValue] = useState<string | undefined>(() => {
    return Cookies.get(key);
  });

  // Set a cookie
  const setCookie = (value: string, options?: CookieOptions) => {
    Cookies.set(key, value, { ...options });
    setCookieValue(value);
  };

  // Remove a cookie
  const removeCookie = () => {
    Cookies.remove(key);
    setCookieValue(undefined);
  };

  return {
    cookieValue,
    setCookie,
    removeCookie,
  };
};
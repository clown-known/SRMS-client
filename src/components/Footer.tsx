import React from 'react';
import { Facebook, LinkedIn, YouTube } from '@mui/icons-material'; // Import MUI icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-8 text-white">
      <div className="container mx-auto flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">
            {' '}
            Simple Shipping Route Management System
          </h1>
          <div className="mt-2 flex space-x-4">
            <a href="a" className="flex items-center hover:text-yellow-500">
              <Facebook className="h-5 w-5" /> {/* Facebook Icon */}
            </a>
            <a href="a" className="flex items-center hover:text-yellow-500">
              <LinkedIn className="h-5 w-5" /> {/* LinkedIn Icon */}
            </a>
            <a href="a" className="flex items-center hover:text-yellow-500">
              <YouTube className="h-5 w-5" /> {/* YouTube Icon */}
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-8 md:space-y-0">
          <div>
            <h2 className="font-bold">SOLUTIONS & SERVICES</h2>
            <ul>
              <li>POINT</li>
              <li>LOGISTICS</li>
              <li>ROUTE</li>
            </ul>
          </div>
          {/* <div>
            <h2 className="font-bold">INSIGHT</h2>
            <ul>
              <li>PRESS RELEASE</li>
              <li>ARTICLE</li>
              <li>WEBINAR</li>
            </ul>
          </div> */}
          <div>
            <h2 className="font-bold">NETWORKS</h2>
            <ul>
              <li>GLOBAL OFFICE</li>
              <li>PARTNERS</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">ABOUT</h2>
            <ul>
              <li>COMPANY</li>
              <li>HISTORY</li>
              <li>ESG</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">CONTACT</h2>
            <ul>
              <li>CONTACT US</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold">SUPPORT</h2>
            <ul>
              <li>SUPPORT</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>SRMS</p>
        <p>16th Floor, Q.12 HCMC , 70000, Republic of VietNam</p>
        <p>Tel: +84-9-1622-4476 | Fax: +84-9-1622-4476</p>
        <p>E-mail: nam.nvd.clv@gmail.com</p>
        <p className="mt-4">COPYRIGHTS © 2024 TEAM 5 ALL RIGHT RESERVED.</p>
        <div className="mt-4">
          <a href="a" className="hover:text-yellow-500">
            Privacy Policy
          </a>{' '}
          |
          <a href="a" className="hover:text-yellow-500">
            {' '}
            Online Inquiry
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

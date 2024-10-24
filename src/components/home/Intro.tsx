import React from 'react';
import { motion } from 'framer-motion';

const Intro = () => (
  <motion.section
    className="custom-screen py-28 text-gray-200"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: false }}
  >
    <div className="mx-auto max-w-4xl space-y-5 text-center">
      <motion.h1
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold sm:text-6xl"
      >
        Introduce About Our Application
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold sm:text-4xl"
      >
        Simple Shipping Route Management System
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        This system will facilitate efficient management of shipping routes in
        the sea, providing users with a robust platform to handle route
        creation, management, and notifications seamlessly
      </motion.p>
      <div className="flex items-center justify-center gap-x-3 text-sm font-medium">
        {/* <NavLink
                        href="/get-started"
                        className="text-white bg-gray-800 hover:bg-gray-600 active:bg-gray-900 "
                    >
                        Start building
                    </NavLink>
                    <NavLink
                        href="#cta"
                        className="text-gray-700 border hover:bg-gray-50"
                        scroll={false}
                    >
                        Learn more
                    </NavLink> */}
      </div>
    </div>
  </motion.section>
);

export default Intro;

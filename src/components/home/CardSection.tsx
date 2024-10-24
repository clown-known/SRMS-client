/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState, SyntheticEvent, useRef } from 'react';
import { Tabs, Tab, Box, createTheme, ThemeProvider } from '@mui/material';
import Start from './Start';

// Define the props for the TabSwitcher component (if necessary)
interface TabSwitcherProps {}

// Define the card list
const cardList = [
  {
    title: 'Demo 1',
    name: 'As a guest',
    content:
      'Guest register, after that, login and view route, update profile and last one, they are also can recovery their password',
    url: 'register',
  },
  {
    title: 'Demo 2',
    name: 'As a user',
    content:
      'Admin loggin and create the role, after that, I assign this role for user, user will login and using their permission',
    url: 'login',
  },
  {
    title: 'Demo 3',
    name: 'Demo update list',
    content: 'Content for Tab 3',
    url: 'login',
  },
  {
    title: 'Demo 4',
    name: 'Demo view list',
    content: 'Content for Tab 4',
    url: 'login',
  },
];

// Create a custom theme
const theme = createTheme({
  typography: {
    fontFamily: [
      'ui-sans-serif',
      'system-ui',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji',
    ].join(', '), // Replace with your project's default font
  },
});

const CardSection: React.FC<TabSwitcherProps> = () => {
  // Manage active tab state
  const [activeTab, setActiveTab] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null); // Reference for scrolling

  // Handle tab change event
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Scroll to the CardSection
  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="" ref={sectionRef}>
      <div className="h-16" />
      <div className="text-center text-gray-100">
        <div className="max-w-2xl sm:text-center md:mx-auto">
          <h2 className="text-3xl font-semibold text-gray-100 sm:text-4xl">
            Our Demo
          </h2>
          <p className="mt-3 text-gray-200">
            Today, We bring here four scenarios to demo with you, please don't
            hesitate to ask questions.
          </p>
        </div>
      </div>
      <ThemeProvider theme={theme}>
        <div className="flex flex-col items-center p-4">
          {/* Material UI Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="tabs example"
              sx={{
                '& .MuiTab-root': {
                  fontSize: '20px',
                  color: 'white', // Set text color to white
                  textTransform: 'none', // Disable uppercase transformation
                },
              }}
            >
              {cardList.map((card, index) => (
                <Tab
                  key={index}
                  label={card.title}
                  sx={{
                    color: 'white', // Set text color to white
                    textTransform: 'none', // Disable uppercase transformation
                  }}
                />
              ))}
            </Tabs>
          </Box>
          {/* Tab content */}
          <div className="mt-4 w-full rounded-lg border bg-gray-900 p-6 shadow-md">
            <div className="text-center">
              <Start
                content={cardList[activeTab].content}
                title={cardList[activeTab].name}
                href={cardList[activeTab].url}
              />
            </div>
          </div>
          {/* Modals on the right side */}
          <div className="fixed right-1 top-3/4 flex -translate-y-1/2 transform flex-col space-y-2">
            {cardList.map((card, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveTab(index);
                  scrollToSection();
                }} // Scroll to card on click
                className="cursor-pointer rounded-lg border bg-gray-200 p-2 shadow-lg hover:bg-gray-300"
              >
                <h4 className="text-sm font-bold">{card.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default CardSection;

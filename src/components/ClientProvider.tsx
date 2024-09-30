// 'use client';

// // This directive ensures that the component is client-side

// import { useEffect, useState } from 'react';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from '../store/store';

// export default function ClientProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true); // Ensures that PersistGate is only rendered on the client side
//   }, []);

//   if (!isClient) {
//     return { children }; // Skip PersistGate during SSR
//   }

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         {children}
//       </PersistGate>
//     </Provider>
//   );
// }

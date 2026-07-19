import React from 'react';
import Providers from './providers.js';
import AppRouter from './router.js';

export const App: React.FC = () => {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
};
export default App;

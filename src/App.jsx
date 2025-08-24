import React from 'react';
import AppRouter from './router/AppRouter.jsx';
const App = () => {
  return (
    <>
        <div className='body h-screen w-screen border-box bg-[var(--color-bg)]'>
          <AppRouter />
        </div>
    </>
  );
};
export default App;


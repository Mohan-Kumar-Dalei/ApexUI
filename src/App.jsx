import React from 'react';
import AppRouter from './router/AppRouter.jsx';
const App = () => {
  return (
    <>
        <div className='body h-[100%] w-[100%] bg-[var(--color-bg)]'>
          <AppRouter />
        </div>
    </>
  );
};
export default App;


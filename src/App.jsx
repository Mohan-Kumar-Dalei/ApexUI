import React from 'react';
import AppRouter from './router/AppRouter.jsx';
const App = () => {
  return (
    <>
        <div className='box-border bg-[var(--color-bg)]'>
          <AppRouter />
        </div>
    </>
  );
};
export default App;


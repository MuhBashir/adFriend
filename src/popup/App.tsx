import React from 'react';
import Widget from './components/Widget';

const App: React.FC = () => {
  return (
    <div className='p-4 min-h-96 min-w-96'>
      <h1 className='text-2xl font-bold'>AdFriend</h1>
      <Widget />
    </div>
  );
};

export default App;

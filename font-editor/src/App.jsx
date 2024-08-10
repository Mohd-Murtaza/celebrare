// src/App.jsx
import React from 'react';
import TextEditor from './components/TextEditor';

const App = () => {
  return (
    <div>
      <h1 className='mainHeading'>Text Editor</h1>
      <TextEditor />
    </div>
  );
};

export default App;
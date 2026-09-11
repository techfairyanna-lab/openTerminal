import React from 'react';
import { GameView } from './GameView';

function App() {
  return (
    <div className="App" style={{ background: '#000', height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <GameView />
    </div>
  );
}

export default App;
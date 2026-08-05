import React from 'react';
import { GameView } from './GameView';

function App() {
  return (
    <div className="App" style={{ background: '#000', height: '100vh', overflow: 'hidden' }}>
      <GameView onInteract={(target) => console.log("Interacted with:", target)} />
    </div>
  );
}

export default App;
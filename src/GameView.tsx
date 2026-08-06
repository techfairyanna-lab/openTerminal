import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { IsoHomeRoomScene } from './scenes/IsoHomeRoomScene';

export const GameView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<IsoHomeRoomScene | null>(null);
  
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Linux academy 6.5.0-generic #1 SMP x86_64 GNU/Linux",
    "Type 'exit' to leave the computer."
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
      },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
      scene: [IsoHomeRoomScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // The callback Phaser triggers when you press E on the computer
    const handleInteract = (target: string) => {
      if (target === 'computer') {
        // Pause the game and open the React terminal UI
        game.scene.pause('IsoHomeRoom');
        setIsTerminalOpen(true);
      }
    };

    game.registry.set('onInteract', handleInteract);

    return () => { 
      gameRef.current?.destroy(true); 
      gameRef.current = null; 
    };
  }, []);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim().toLowerCase();
    const newOut = [...terminalOutput, `user@home:~$ ${cmd}`];

    if (cmd === 'help') {
      newOut.push("Commands: ls, cd /, exit");
    } else if (cmd === 'ls') {
      newOut.push("documents  downloads  pictures  notes.txt");
    } else if (cmd === 'exit') {
      closeTerminal();
      return;
    } else if (cmd === 'cd /') {
      newOut.push("Entering root directory...");
      setTerminalOutput(newOut);
      setTimeout(() => {
        alert("SCREEN GLITCH! (We will load the Backrooms scene here later)");
        closeTerminal();
      }, 1000);
      return;
    } else {
      newOut.push(`bash: ${cmd}: command not found`);
    }

    setTerminalOutput(newOut);
    setInputValue("");
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setInputValue("");
    // Resume the Phaser game
    gameRef.current?.scene.resume('IsoHomeRoom');
  };

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', background: '#111' }}>
      {isTerminalOpen && (
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.9)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 100
        }}>
          <div style={{ 
            width: '800px', 
            height: '500px', 
            background: '#000', 
            border: '2px solid #333', 
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '0 0 30px rgba(0,255,0,0.1)'
          }}>
            <div style={{ color: '#0f0', fontFamily: 'monospace', flexGrow: 1, overflowY: 'auto' }}>
              {terminalOutput.map((line, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>)}
            </div>
            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', marginTop: '10px' }}>
              <span style={{ color: '#0f0', fontFamily: 'monospace', marginRight: '8px' }}>user@home:~$</span>
              <input 
                autoFocus
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  color: '#0f0', 
                  fontFamily: 'monospace', 
                  flexGrow: 1 
                }}
              />
            </form>
            <button onClick={closeTerminal} style={{ marginTop: '10px', background: '#333', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', alignSelf: 'flex-end' }}>Close (Exit)</button>
          </div>
        </div>
      )}
    </div>
  );
};
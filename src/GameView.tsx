import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { IsoHomeRoomScene } from './scenes/IsoHomeRoomScene';
import { ImageRoomScene } from './scenes/ImageRoomScene';
import { RootRoomScene } from './scenes/RootRoomScene';
import { ImageRootRoomScene } from './scenes/ImageRootRoomScene';
import GameTerminal from './components/GameTerminal';

export type RoomKey = 'IsoHomeRoom' | 'ImageRoom' | 'RootRoom' | 'ImageRootRoom';

const isRootRoom = (room: RoomKey): boolean => room === 'RootRoom' || room === 'ImageRootRoom';

export const GameView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [fayeMessage, setFayeMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentRoom, setCurrentRoom] = useState<RoomKey>('IsoHomeRoom');

  const currentRoomRef = useRef<RoomKey>('IsoHomeRoom');

  const switchRoom = (targetRoom: RoomKey) => {
    if (targetRoom === currentRoomRef.current) return;

    setIsTerminalOpen(false);
    setInputValue("");
    setFayeMessage("");

    const prevRoom = currentRoomRef.current;
    currentRoomRef.current = targetRoom;
    setCurrentRoom(targetRoom);

    if (gameRef.current) {
      const prevScene = gameRef.current.scene.getScene(prevRoom);
      if (prevScene && 'setTerminalMode' in (prevScene as unknown as Record<string, unknown>)) {
        (prevScene as unknown as { setTerminalMode: (isOpen: boolean) => void }).setTerminalMode(false);
      }

      gameRef.current.scene.resume(prevRoom);
      gameRef.current.scene.stop(prevRoom);
      gameRef.current.scene.start(targetRoom);

      const nextScene = gameRef.current.scene.getScene(targetRoom);
      if (nextScene?.input?.keyboard) {
        nextScene.input.keyboard.enabled = true;
      }
    }
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setInputValue("");
    
    const activeKey = currentRoomRef.current;
    const scene = gameRef.current?.scene.getScene(activeKey);
    if (scene && 'setTerminalMode' in (scene as unknown as Record<string, unknown>)) {
      (scene as unknown as { setTerminalMode: (isOpen: boolean) => void }).setTerminalMode(false);
    }
    if (scene?.input?.keyboard) {
      scene.input.keyboard.enabled = true;
      scene.input.keyboard.addCapture([
        Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.A,
        Phaser.Input.Keyboard.KeyCodes.S, Phaser.Input.Keyboard.KeyCodes.D,
        Phaser.Input.Keyboard.KeyCodes.E, Phaser.Input.Keyboard.KeyCodes.SPACE,
        Phaser.Input.Keyboard.KeyCodes.UP, Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT, Phaser.Input.Keyboard.KeyCodes.RIGHT
      ]);
    }
    
    gameRef.current?.scene.resume(activeKey);
  };

  // Global ESC key listener to close terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTerminalOpen) {
        closeTerminal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen]);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      pixelArt: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 600 },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
      scene: [IsoHomeRoomScene, ImageRoomScene, RootRoomScene, ImageRootRoomScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.registry.set('onFayeSpeak', (text: string) => {
      setFayeMessage(text);
    });

    const handleInteract = (target: string) => {
      if (isRootRoom(currentRoomRef.current)) return;
      if (target === 'computer') {
        const activeKey = currentRoomRef.current;
        game.scene.pause(activeKey);
        
        const scene = game.scene.getScene(activeKey);
        if (scene && 'setTerminalMode' in (scene as unknown as Record<string, unknown>)) {
          (scene as unknown as { setTerminalMode: (isOpen: boolean) => void }).setTerminalMode(true);
        }
        if (scene?.input?.keyboard) {
          scene.input.keyboard.enabled = false;
          scene.input.keyboard.clearCaptures();
        }

        startLesson();
        setIsTerminalOpen(true);
      } else {
        let message = "";
        if (target === 'documents') message = "That's Documents/. Everything you've ever saved is filed neatly in there.";
        else if (target === 'downloads') message = "Downloads/! Fresh stuff from the internet lands in that bin. Careful what you run.";
        else if (target === 'door') message = "The root directory? It's locked. Go open the terminal and type 'cd root' first.";
        
        const speak = game.registry.get('onFayeSpeak') as (text: string) => void;
        if (speak) speak(message);
      }
    };

    game.registry.set('onInteract', handleInteract);
    return () => { gameRef.current?.destroy(true); gameRef.current = null; };
  }, []);

  const startLesson = () => {
    setOutput([
      "Linux academy 6.5.0-generic #1 SMP x86_64 GNU/Linux",
      "Type 'help' for commands. Type 'exit' to leave terminal."
    ]);
    setFayeMessage("Welcome to the terminal! Type 'cd root' to head to the root directory.");
  };

  const handleSubmit = () => {
    const input = inputValue.trim();
    if (!input) return;
    const newOutput = [...output, `user@home:~$ ${input}`];
    
    if (input === 'exit') {
      closeTerminal();
      return;
    }

    if (input === 'clear') {
      setOutput([]);
      setInputValue("");
      return;
    }

    if (input === 'help') {
      newOutput.push("Available commands: ls, pwd, cd root, help, clear, exit");
    } else if (input === 'ls') {
      newOutput.push("Documents  Downloads  Projects  root_door");
    } else if (input === 'pwd') {
      newOutput.push("/home/user");
    } else if (input === 'cd root') {
      const targetRoot: RoomKey = currentRoomRef.current === 'ImageRoom' ? 'ImageRootRoom' : 'RootRoom';
      newOutput.push("Access granted. Door unlocked.");
      setFayeMessage("Access granted! Entering root room...");
      setOutput(newOutput);
      setInputValue("");
      setTimeout(() => {
        switchRoom(targetRoot);
      }, 1000);
      return;
    } else if (input === 'cd' || input.startsWith('cd ') || input.startsWith('cd/') || input.startsWith('cd.')) {
      newOutput.push("Permission denied. You need root access to proceed.");
    } else {
      newOutput.push("Command not found. Fork this repo and write your own commands to expand the game!");
    }

    setOutput(newOutput);
    setInputValue("");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', background: '#111', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: THE GAME */}
      <div style={{ flex: 1, height: '100%', position: 'relative', background: '#000' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

        {/* ROOM DESIGN SELECTOR / SWITCHER UI */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(17, 17, 27, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '2px solid #313244',
          borderRadius: '10px',
          padding: '6px 12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          fontFamily: "'VT323', monospace",
        }}>
          <span style={{ 
            color: '#a6adc8', 
            fontSize: '18px', 
            marginRight: '4px',
            userSelect: 'none',
            letterSpacing: '0.5px'
          }}>
            ROOM DESIGN:
          </span>

          {!isRootRoom(currentRoom) ? (
            <>
              <button
                onClick={() => switchRoom('IsoHomeRoom')}
                title="Switch to Isometric Home Room (Default)"
                style={{
                  background: currentRoom === 'IsoHomeRoom' ? '#a6e3a1' : 'rgba(255, 255, 255, 0.05)',
                  color: currentRoom === 'IsoHomeRoom' ? '#11111b' : '#cdd6f4',
                  border: currentRoom === 'IsoHomeRoom' ? '2px solid #94e2d5' : '1px solid #45475a',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '20px',
                  fontFamily: "'VT323', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: currentRoom === 'IsoHomeRoom' ? '0 0 12px rgba(166, 227, 161, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{currentRoom === 'IsoHomeRoom' ? '●' : '○'}</span>
                Iso Home Room (Default)
              </button>

              <button
                onClick={() => switchRoom('ImageRoom')}
                title="Switch to Illustrated Image Room (Alternative)"
                style={{
                  background: currentRoom === 'ImageRoom' ? '#f5c2e7' : 'rgba(255, 255, 255, 0.05)',
                  color: currentRoom === 'ImageRoom' ? '#11111b' : '#cdd6f4',
                  border: currentRoom === 'ImageRoom' ? '2px solid #f5c2e7' : '1px solid #45475a',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '20px',
                  fontFamily: "'VT323', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: currentRoom === 'ImageRoom' ? '0 0 12px rgba(245, 194, 231, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{currentRoom === 'ImageRoom' ? '●' : '○'}</span>
                Image Room (Alternative)
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => switchRoom('RootRoom')}
                title="Switch to Isometric Root Room"
                style={{
                  background: currentRoom === 'RootRoom' ? '#89b4fa' : 'rgba(255, 255, 255, 0.05)',
                  color: currentRoom === 'RootRoom' ? '#11111b' : '#cdd6f4',
                  border: currentRoom === 'RootRoom' ? '2px solid #b4befe' : '1px solid #45475a',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '20px',
                  fontFamily: "'VT323', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: currentRoom === 'RootRoom' ? '0 0 12px rgba(137, 180, 250, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{currentRoom === 'RootRoom' ? '●' : '○'}</span>
                Iso Root Room
              </button>

              <button
                onClick={() => switchRoom('ImageRootRoom')}
                title="Switch to Image Root Room (Blank Canvas)"
                style={{
                  background: currentRoom === 'ImageRootRoom' ? '#f5c2e7' : 'rgba(255, 255, 255, 0.05)',
                  color: currentRoom === 'ImageRootRoom' ? '#11111b' : '#cdd6f4',
                  border: currentRoom === 'ImageRootRoom' ? '2px solid #f5c2e7' : '1px solid #45475a',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  fontSize: '20px',
                  fontFamily: "'VT323', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                  boxShadow: currentRoom === 'ImageRootRoom' ? '0 0 12px rgba(245, 194, 231, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: '13px' }}>{currentRoom === 'ImageRootRoom' ? '●' : '○'}</span>
                Image Root Room (Blank)
              </button>

              <button
                onClick={() => switchRoom(currentRoom === 'ImageRootRoom' ? 'ImageRoom' : 'IsoHomeRoom')}
                title="Return to Home Room"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#cdd6f4',
                  border: '1px solid #45475a',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '18px',
                  fontFamily: "'VT323', monospace",
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>←</span> Exit to Home
              </button>
            </>
          )}
        </div>

        {/* GLOBAL FAE DIALOGUE BOX — only visible in Home rooms, completely hidden in Root rooms */}
        {fayeMessage && !isRootRoom(currentRoom) && (
          <div style={{ 
            position: 'absolute', 
            bottom: '30px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '50%', // Takes up 50% of the game screen width!
            
            background: 'rgba(5, 5, 5, 0.95)', 
            border: '6px solid #f5c2e7', 
            borderRadius: '12px',
            boxShadow: '0 0 30px rgba(245,194,231,0.4)', 
            padding: '28px 40px', // Extra fat padding
            display: 'flex', 
            alignItems: 'center',
            zIndex: 30, 
            pointerEvents: 'none',
            boxSizing: 'border-box' // Ensures padding doesn't break width
          }}>
            <span style={{ 
              fontFamily: "'VT323', monospace", 
              fontSize: '36px', // Huge FAE label
              color: '#f5c2e7', 
              fontWeight: 'bold', 
              marginRight: '30px', 
              borderRight: '3px solid #313244', 
              paddingRight: '30px', 
              lineHeight: '1',
              flexShrink: 0
            }}>FAE:</span>
            <span style={{ 
              fontFamily: "'VT323', monospace", 
              fontSize: '32px', // Huge message text
              color: '#e8ffe8', 
              textShadow: '0 0 8px rgba(232,255,232,0.4)', 
              lineHeight: '1.3'
            }}>{fayeMessage}</span>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: THE TERMINAL (only visible in Home rooms, completely hidden in Root rooms) */}
      {isTerminalOpen && !isRootRoom(currentRoom) && (
        <div style={{ width: '30vw', height: '100%', flexShrink: 0, borderLeft: '4px solid #313244' }}>
          <GameTerminal 
            output={output}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
            onClose={closeTerminal}
          />
        </div>
      )}
    </div>
  );
};
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { IsoHomeRoomScene } from './scenes/IsoHomeRoomScene';
import { RootRoomScene } from './scenes/RootRoomScene';
import GameTerminal from './GameTerminal';
import { linuxCommandEngine } from './lib/linux/linuxCommandEngine';
import { OutputType as CommandTranslateOutput } from './endpoints/command/translate_POST.schema';

export const GameView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [breakdown, setBreakdown] = useState<CommandTranslateOutput | null>(null);
  const [fayeMessage, setFayeMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [storyStep, setStoryStep] = useState(0);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      pixelArt: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 600 },
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
      scene: [IsoHomeRoomScene, RootRoomScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Allow Phaser to update React's Fae dialogue box
    game.registry.set('onFayeSpeak', (text: string) => {
      setFayeMessage(text);
    });

    const handleInteract = (target: string) => {
      if (target === 'computer') {
        game.scene.pause('IsoHomeRoom');
        
        const scene = game.scene.getScene('IsoHomeRoom') as IsoHomeRoomScene;
        if (scene?.input?.keyboard) {
          scene.input.keyboard.enabled = false;
          scene.input.keyboard.clearCaptures();
        }

        startLesson();
        setIsTerminalOpen(true);
      }
    };

    game.registry.set('onInteract', handleInteract);
    return () => { gameRef.current?.destroy(true); gameRef.current = null; };
  }, []);

  const startLesson = () => {
    setStoryStep(1);
    setBreakdown(null);
    setOutput([
      "Linux academy 6.5.0-generic #1 SMP x86_64 GNU/Linux",
      "Type 'help' for commands. Type 'exit' to leave terminal."
    ]);
    setFayeMessage("Welcome to the terminal! Let's make sure the shell is awake. Type `echo \"Hello World\"` and press Enter.");
  };

  const handleSubmit = () => {
    const cmd = inputValue.trim();
    const newOutput = [...output, `user@home:~$ ${cmd}`];
    
    if (cmd.toLowerCase() === 'exit') {
      closeTerminal();
      return;
    }

    // --- DEVELOPER CHEAT CODE ---
    if (cmd.toLowerCase() === 'devmode') {
      setOutput([...newOutput, "DEVMODE ACTIVATED: Skipping to Root Room..."]);
      setFayeMessage("Skipping chapter...");
      setInputValue("");
      setTimeout(() => {
        setIsTerminalOpen(false);
        gameRef.current?.scene.stop('IsoHomeRoom');
        gameRef.current?.scene.start('RootRoom');
      }, 1000);
      return;
    }

    const result = linuxCommandEngine.translate(cmd) as CommandTranslateOutput;
    setBreakdown(result);

    if (result.exampleOutput.length > 0) {
      result.exampleOutput.forEach(line => {
        line.segments.forEach(seg => newOutput.push(seg.text));
      });
    } else if (result.commandNotInDatabase) {
      newOutput.push(`bash: ${cmd}: command not found`);
    }

    // Story Logic
    const lowerCmd = cmd.toLowerCase();
    if (storyStep === 1 && lowerCmd === 'echo "hello world"') {
      setFayeMessage("Good, the shell is awake. The shell remembers everything. Type `history`.");
      setStoryStep(2);
    } else if (storyStep === 2 && lowerCmd === 'history') {
      setFayeMessage("Now, where are we? Type `pwd` to print the working directory.");
      setStoryStep(3);
    } else if (storyStep === 3 && lowerCmd === 'pwd') {
      setFayeMessage("/home/user. Let's see what's in your home directory. Type `ls`.");
      setStoryStep(4);
    } else if (storyStep === 4 && lowerCmd === 'ls') {
      setFayeMessage("Wait, what is 'root_door'? It wasn't there before... Type `cat root_door` to read it.");
      setStoryStep(5);
    } else if (storyStep === 5 && lowerCmd === 'cat root_door') {
      setFayeMessage("The root directory? I thought that was just a theoretical concept... Type `cd /` to see what it does.");
      setStoryStep(6);
    } else if (storyStep === 6 && lowerCmd === 'cd /') {
      setFayeMessage("Hold on... the system is glitching! What's happening?!");
      setOutput([...newOutput, "Entering root directory..."]);
      setInputValue("");
      setTimeout(() => {
        setIsTerminalOpen(false);
        gameRef.current?.scene.stop('IsoHomeRoom');
        gameRef.current?.scene.start('RootRoom');
      }, 1500);
      return;
    } else {
      setFayeMessage("Follow the instructions to proceed, or experiment with other commands!");
    }

    setOutput(newOutput);
    setInputValue("");
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
    setInputValue("");
    
    const scene = gameRef.current?.scene.getScene('IsoHomeRoom') as IsoHomeRoomScene;
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
    gameRef.current?.scene.resume('IsoHomeRoom');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', background: '#111', overflow: 'hidden' }}>
      
      {/* LEFT SIDE: THE GAME */}
      <div style={{ flex: 1, height: '100%', position: 'relative', background: '#000' }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* RIGHT SIDE: THE TERMINAL (Hidden until opened) */}
      {isTerminalOpen && (
        <div style={{ width: '450px', height: '100%', flexShrink: 0, borderLeft: '4px solid #313244' }}>
          <GameTerminal 
            output={output}
            breakdown={breakdown}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onSubmit={handleSubmit}
            onClose={closeTerminal}
          />
        </div>
      )}

      {/* GLOBAL FAE DIALOGUE BOX (Always at the bottom center, overlaying everything) */}
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: isTerminalOpen ? 'calc(50% - 225px)' : '50%', // Shifts left when terminal is open
        transform: 'translateX(-50%)', 
        width: '90%', 
        maxWidth: '600px', 
        background: 'rgba(5, 5, 5, 0.9)', 
        border: '2px solid #f5c2e7', 
        boxShadow: '0 0 20px rgba(245,194,231,0.2)',
        padding: '12px 20px', 
        display: 'flex', 
        alignItems: 'center',
        zIndex: 20, 
        pointerEvents: 'none'
      }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '22px', color: '#f5c2e7', fontWeight: 'bold', marginRight: '15px', borderRight: '1px solid #313244', paddingRight: '15px' }}>FAE:</span>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: '#e8ffe8', textShadow: '0 0 5px rgba(232,255,232,0.3)' }}>{fayeMessage}</span>
      </div>
    </div>
  );
};
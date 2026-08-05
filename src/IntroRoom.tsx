import React, { useState, useEffect, useRef } from 'react';

interface IntroRoomProps {
  onEnterBackrooms: () => void;
}

export const IntroRoom: React.FC<IntroRoomProps> = ({ onEnterBackrooms }) => {
  const [fairyText, setFairyText] = useState("Oh! You're awake! Don't panic, but running that script sort of... sucked you inside the server.");
  const [terminalOutput, setTerminalOutput] = useState<string[]>(["Welcome to your /home directory. Type 'help' to see commands."]);
  const [inputValue, setInputValue] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll terminal to bottom
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputValue.trim().toLowerCase();
    const newOutput = [...terminalOutput, `user@home:~$ ${cmd}`];

    if (cmd === 'help') {
      newOutput.push("Available commands: ls, cat <file>, cd <directory>");
      setFairyText("Type 'ls' to look around the room. It's safe here, I promise!");
    } else if (cmd === 'ls') {
      newOutput.push("notes.txt");
      setFairyText("I see a notes.txt file! Try typing 'cat notes.txt' to read it.");
    } else if (cmd === 'cat notes.txt') {
      newOutput.push("To escape the server, you must travel to the root of the file system. Type: cd /");
      setFairyText("The root directory! It's... a bit chaotic out there. But it's the only way out. Type 'cd /' when you're ready.");
    } else if (cmd === 'cd /') {
      newOutput.push("Changing directory to / ...");
      setFairyText("Hold on tight! Here we go!");
      setIsTransitioning(true);
      
      // Wait 2 seconds for the transition animation, then load the game
      setTimeout(() => {
        onEnterBackrooms();
      }, 2000);
      return;
    } else {
      newOutput.push(`bash: ${cmd}: command not found`);
      setFairyText("Hmm, that didn't work. Try typing 'help' to see what you can do!");
    }

    setTerminalOutput(newOutput);
    setInputValue("");
  };

  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      background: '#1e1e2e', // Cozy dark mode background
      color: '#cdd6f4',
      fontFamily: 'sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glitch Transition Overlay */}
      {isTransitioning && (
        <div style={{
          position: 'absolute', inset: 0, background: '#000', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'flicker 0.2s infinite'
        }}>
          <h1 style={{ color: '#d4cf7a', fontFamily: 'monospace', fontSize: '48px' }}>ENTERING /</h1>
          <style>{`
            @keyframes flicker {
              0% { opacity: 0.8; background: #000; }
              50% { opacity: 1; background: #d4cf7a; }
              100% { opacity: 0.8; background: #000; }
            }
          `}</style>
        </div>
      )}

      <div style={{ display: 'flex', width: '800px', gap: '20px' }}>
        {/* Left Side: Tech Fairy */}
        <div style={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/assets/fairy.png" alt="Tech Fairy" style={{ width: '200px', height: 'auto', filter: 'drop-shadow(0 0 10px #89b4fa)' }} />
          {/* RPG Dialogue Box */}
          <div style={{
            marginTop: '20px', background: '#313244', border: '2px solid #89b4fa',
            borderRadius: '8px', padding: '15px', minHeight: '100px', width: '100%',
            boxShadow: '0 0 10px rgba(137, 180, 250, 0.3)'
          }}>
            <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5 }}>
              <strong style={{ color: '#89b4fa' }}>Faye:</strong> {fairyText}
            </p>
          </div>
        </div>

        {/* Right Side: Terminal */}
        <div style={{ width: '500px', background: '#11111b', border: '1px solid #45475a', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#181825', padding: '5px', borderBottom: '1px solid #45475a', fontSize: '12px', color: '#6c7086' }}>
            ● ● ● user@home: ~
          </div>
          <div style={{ padding: '15px', fontFamily: 'monospace', fontSize: '13px', flexGrow: 1, overflowY: 'auto', color: '#a6e3a1' }}>
            {terminalOutput.map((line, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>)}
            <div ref={terminalEndRef} />
          </div>
          <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #45475a' }}>
            <span style={{ color: '#89b4fa', fontFamily: 'monospace', marginRight: '8px' }}>user@home:~$</span>
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)} 
              autoFocus
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#cdd6f4', fontFamily: 'monospace', flexGrow: 1 }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
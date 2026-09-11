import React, { useEffect, useRef } from 'react';

interface GameTerminalProps {
  output: string[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const GameTerminal: React.FC<GameTerminalProps> = ({
  output, inputValue, onInputChange, onSubmit, onClose
}) => {
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    outputRef.current?.scrollTo(0, outputRef.current.scrollHeight); 
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [output]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit();
    if (e.key === 'Escape') onClose();
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
    @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

    .terminal-scroll::-webkit-scrollbar { width: 10px; }
    .terminal-scroll::-webkit-scrollbar-track { background: #11111b; }
    .terminal-scroll::-webkit-scrollbar-thumb { background: #313244; border-radius: 4px; }
    .terminal-scroll::-webkit-scrollbar-thumb:hover { background: #45475a; }
    .terminal-scroll { scrollbar-width: thin; scrollbar-color: #313244 #11111b; }
  `;

  const PROMPT_PREFIX = 'user@home:~$';

  const renderOutputLine = (line: string) => {
    if (line.startsWith(PROMPT_PREFIX)) {
      const rest = line.slice(PROMPT_PREFIX.length);
      return (
        <>
          <span style={{ color: '#89b4fa' }}>{PROMPT_PREFIX}</span>
          <span>{rest}</span>
        </>
      );
    }
    return line;
  };

  return (
    <div style={{ height: '100%', width: '100%', background: '#11111b', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideIn 0.3s forwards' }}>
      <style>{globalStyles}</style>
      
      {/* Header */}
      <div style={{ height: '48px', background: '#181825', borderBottom: '2px solid #313244', display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f38ba8' }}></div>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#f9e2af' }}></div>
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#a6e3a1' }}></div>
        </div>
        <span style={{ marginLeft: '20px', fontFamily: "'VT323', monospace", fontSize: '24px', color: '#cdd6f4' }}>user@home: ~</span>
        
        <button 
          onClick={onClose} 
          style={{ 
            marginLeft: 'auto', 
            background: '#f38ba8', 
            color: '#11111b', 
            border: 'none', 
            padding: '6px 16px', 
            borderRadius: '4px', 
            fontFamily: "'VT323', monospace", 
            fontSize: '18px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          ESC to Exit
        </button>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        
        {/* CRT Scanlines overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)', pointerEvents: 'none', zIndex: 5 }}></div>

        {/* Terminal Output & Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', zIndex: 2, minHeight: 0 }}>
          <div ref={outputRef} className="terminal-scroll" style={{ flex: 1, overflowY: 'auto', minHeight: 0, fontFamily: "'VT323', monospace", fontSize: '28px', lineHeight: '1.2', color: '#a6e3a1', textShadow: '0 0 8px rgba(166,227,161,0.4)' }}>
            {output.map((line, i) => <div key={i} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>{renderOutputLine(line)}</div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', flexShrink: 0, fontFamily: "'VT323', monospace", fontSize: '28px' }}>
            <span style={{ color: '#89b4fa', marginRight: '12px' }}>user@home:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#a6e3a1', fontFamily: "'VT323', monospace", fontSize: '28px', flexGrow: 1, caretColor: '#a6e3a1' }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTerminal;
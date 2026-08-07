import React, { useEffect, useRef } from 'react';
import { OutputType as CommandTranslateOutput } from './endpoints/command/translate_POST.schema';

interface GameTerminalProps {
  output: string[];
  breakdown: CommandTranslateOutput | null;
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const GameTerminal: React.FC<GameTerminalProps> = ({
  output, breakdown, inputValue, onInputChange, onSubmit, onClose
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
  `;

  return (
    <div style={{ height: '100%', width: '100%', background: '#11111b', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideIn 0.3s forwards' }}>
      <style>{globalStyles}</style>
      
      {/* Header */}
      <div style={{ height: '36px', background: '#181825', borderBottom: '2px solid #313244', display: 'flex', alignItems: 'center', padding: '0 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f38ba8', cursor: 'pointer' }} onClick={onClose}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f9e2af' }}></div>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#a6e3a1' }}></div>
        </div>
        <span style={{ marginLeft: '20px', fontFamily: "'VT323', monospace", fontSize: '18px', color: '#cdd6f4' }}>user@home: ~</span>
      </div>

      {/* Main Layout: Output on top, Breakdown on bottom */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
        
        {/* CRT Scanlines overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)', pointerEvents: 'none', zIndex: 5 }}></div>

        {/* Top Section: Terminal Output & Input */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', zIndex: 2, minHeight: 0 }}>
          <div ref={outputRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0, fontFamily: "'VT323', monospace", fontSize: '20px', color: '#a6e3a1', textShadow: '0 0 8px rgba(166,227,161,0.4)' }}>
            {output.map((line, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', flexShrink: 0, fontFamily: "'VT323', monospace", fontSize: '20px' }}>
            <span style={{ color: '#89b4fa', marginRight: '8px' }}>user@home:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#a6e3a1', fontFamily: "'VT323', monospace", fontSize: '20px', flexGrow: 1, caretColor: '#a6e3a1' }}
              autoComplete="off"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Bottom Section: Syntax Breakdown Panel */}
        <div style={{ height: '180px', flexShrink: 0, padding: '12px', overflowY: 'auto', background: '#181825', borderTop: '2px solid #313244', zIndex: 2 }}>
          <h3 style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#89b4fa', marginTop: 0, marginBottom: '10px', borderBottom: '1px solid #313244', paddingBottom: '5px' }}>Syntax Breakdown</h3>
          {breakdown && breakdown.syntaxBreakdown.map((part, i) => (
            <div key={i} style={{ marginBottom: '8px', padding: '6px', background: '#11111b', borderRadius: '4px', borderLeft: `4px solid ${part.type === 'command' ? '#89b4fa' : part.type === 'flag' ? '#f9e2af' : '#a6e3a1'}` }}>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#cdd6f4' }}>{part.part}</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#6c7086', marginTop: '2px' }}>{part.description}</div>
            </div>
          ))}
          {!breakdown && <div style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#6c7086' }}>Awaiting command...</div>}
        </div>
      </div>
    </div>
  );
};

export default GameTerminal;
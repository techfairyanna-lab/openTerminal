import React, { useEffect, useRef, useMemo } from 'react';

// Props interface for the RetroTerminal component
interface RetroTerminalProps {
  output: string[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const RetroTerminal: React.FC<RetroTerminalProps> = ({
  output,
  inputValue,
  onInputChange,
  onSubmit,
  onClose,
}) => {
  // Refs for DOM manipulation
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll output to bottom when new lines are added
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus the input field on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle Enter to submit and Escape to close the terminal
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Calculate dynamic input width based on text length (monospace VT323 approximation)
  const inputWidth = useMemo(() => {
    const charWidth = 14.4; // Approximate pixel width per character at 24px
    const minWidth = charWidth * 2;
    const maxWidth = 680; // Prevent overflow past prompt and cursor area
    return Math.min(maxWidth, Math.max(minWidth, inputValue.length * charWidth));
  }, [inputValue]);

  // Google Font import and CSS keyframe animations injected via style tag
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    @keyframes slideUp {
      from {
        transform: translateY(50vh);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  // Inline styles for all elements using Catppuccin Mocha palette
  const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
    terminal: {
      width: '800px',
      height: '500px',
      backgroundColor: '#11111b',
      border: '8px solid #313244',
      borderRadius: '6px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: `
        0 0 40px rgba(137, 180, 250, 0.2),
        0 0 80px rgba(137, 180, 250, 0.1),
        inset 0 0 60px rgba(0, 0, 0, 0.8),
        inset 0 0 20px rgba(166, 227, 161, 0.05)
      `,
      fontFamily: "'VT323', monospace",
      fontSize: '24px',
      color: '#a6e3a1',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      background: 'radial-gradient(ellipse at center, #181825 0%, #11111b 100%)',
    },
    scanlines: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0px, rgba(0, 0, 0, 0.2) 1px, transparent 1px, transparent 3px)',
      pointerEvents: 'none',
      zIndex: 3,
    },
    header: {
      height: '36px',
      backgroundColor: '#181825',
      borderBottom: '2px solid #313244',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '14px',
      paddingRight: '14px',
      zIndex: 2,
      flexShrink: 0,
    },
    dots: {
      display: 'flex',
      gap: '8px',
    },
    dotRed: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#f38ba8',
      boxShadow: '0 0 6px rgba(243, 139, 168, 0.6)',
      cursor: 'pointer',
    },
    dotYellow: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#f9e2af',
      boxShadow: '0 0 6px rgba(249, 226, 175, 0.6)',
    },
    dotGreen: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#a6e3a1',
      boxShadow: '0 0 6px rgba(166, 227, 161, 0.6)',
    },
    headerTitle: {
      marginLeft: '20px',
      fontSize: '16px',
      color: '#cdd6f4',
      letterSpacing: '0.5px',
    },
    output: {
      flex: 1,
      padding: '16px 20px',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative',
      zIndex: 1,
    },
    line: {
      textShadow: '0 0 8px rgba(166, 227, 161, 0.4)',
      lineHeight: '1.3',
      marginBottom: '4px',
      wordBreak: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    inputLine: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '4px',
    },
    prompt: {
      color: '#89b4fa',
      textShadow: '0 0 8px rgba(137, 180, 250, 0.6)',
      marginRight: '8px',
      flexShrink: 0,
    },
    input: {
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#a6e3a1',
      fontFamily: "'VT323', monospace",
      fontSize: '24px',
      padding: 0,
      margin: 0,
      caretColor: 'transparent',
      textShadow: '0 0 8px rgba(166, 227, 161, 0.4)',
      lineHeight: '1.3',
    },
    cursor: {
      animation: 'blink 1s step-end infinite',
      color: '#a6e3a1',
      textShadow: '0 0 8px rgba(166, 227, 161, 0.6)',
      flexShrink: 0,
      lineHeight: '1',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{globalStyles}</style>
      <div style={styles.terminal} onClick={(e) => e.stopPropagation()}>
        {/* CRT Scanline overlay */}
        <div style={styles.scanlines} />

        {/* Terminal header with macOS-style traffic light dots */}
        <div style={styles.header}>
          <div style={styles.dots}>
            <div style={styles.dotRed} onClick={onClose} title="Close" />
            <div style={styles.dotYellow} />
            <div style={styles.dotGreen} />
          </div>
          <span style={styles.headerTitle}>user@home: ~</span>
        </div>

        {/* Scrollable output area with input line at the bottom */}
        <div ref={outputRef} style={styles.output}>
          {output.map((line, i) => (
            <div key={i} style={styles.line}>
              {line}
            </div>
          ))}
          <div style={styles.inputLine}>
            <span style={styles.prompt}>$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ ...styles.input, width: `${inputWidth}px` }}
              autoComplete="off"
              spellCheck={false}
            />
            {/* Flickering terminal cursor */}
            <span style={styles.cursor}>_</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetroTerminal;
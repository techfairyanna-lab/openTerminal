import React, { useState, useEffect, useRef } from 'react';

export const TerminalMode: React.FC<{ onExit: () => void, onEnterBackrooms: () => void }> = ({ onExit, onEnterBackrooms }) => {
  const [output, setOutput] = useState<string[]>(["Linux academy 6.5.0-generic #1 SMP x86_64 GNU/Linux", "Type 'exit' to leave the computer."]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    const newOut = [...output, `user@home:~$ ${cmd}`];

    if (cmd === 'ls') newOut.push("documents  notes.txt  computer.log");
    else if (cmd === 'cat notes.txt') newOut.push("To escape the server, travel to the root directory. Type: cd /");
    else if (cmd === 'exit') { onExit(); return; }
    else if (cmd === 'cd /') {
      newOut.push("Entering root directory...");
      setOutput(newOut);
      setTimeout(() => onEnterBackrooms(), 1500);
      return;
    }
    else newOut.push(`bash: ${cmd}: command not found`);

    setOutput(newOut);
    setInput("");
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000', color: '#0f0', fontFamily: 'monospace', padding: '40px', display: 'flex', flexDirection: 'column' }} onClick={() => (document.getElementById('term-input') as HTMLInputElement)?.focus()}>
      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        {output.map((line, i) => <div key={i} style={{ whiteSpace: 'pre-wrap' }}>{line}</div>)}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <span style={{ marginRight: 8 }}>user@home:~$</span>
        <input id="term-input" autoFocus value={input} onChange={(e) => setInput(e.target.value)} style={{ background: 'transparent', border: 'none', outline: 'none', color: '#0f0', fontFamily: 'monospace', flexGrow: 1 }} />
      </form>
    </div>
  );
};
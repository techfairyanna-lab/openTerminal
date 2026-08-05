import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { HomeRoomScene } from './scenes/HomeRoomScene';

export const GameView: React.FC<{ onInteract: (target: string) => void }> = ({ onInteract }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerRef.current,
      pixelArt: true,
      physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 } } },
      scene: [HomeRoomScene],
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Pass the React function to Phaser safely using the registry
    game.registry.set('onInteract', onInteract);

    return () => { 
      gameRef.current?.destroy(true); 
      gameRef.current = null; 
    };
  }, [onInteract]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
      <div ref={containerRef} style={{ border: '4px solid #444', borderRadius: '8px' }} />
    </div>
  );
};
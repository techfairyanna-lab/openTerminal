import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { BackroomsScene } from './BackroomsScene';
import styles from './PhaserGame.module.css';

export const PhaserGame: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameContainerRef.current || phaserGameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameContainerRef.current,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [BackroomsScene],
      backgroundColor: '#0a0a0c',
    };

    phaserGameRef.current = new Phaser.Game(config);

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.gameWrapper}>
      <div ref={gameContainerRef} className={styles.canvasContainer} />
    </div>
  );
};

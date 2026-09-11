// RoomAlignmentTool.tsx
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface Offsets {
  x: number;
  y: number;
  scale: number;
}

const RoomAlignmentTool: React.FC = () => {
  const [offsets, setOffsets] = useState<Offsets>({ x: 0, y: 0, scale: 1 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!gameContainerRef.current) return;

    class AlignmentScene extends Phaser.Scene {
      private leftImg!: Phaser.GameObjects.Image;
      private rightImg!: Phaser.GameObjects.Image;
      private leftScale: number = 1;
      
      constructor() {
        super({ key: 'AlignmentScene' });
      }

      preload() {
        this.load.image('room_left', 'assets/LeftNB.png');
        this.load.image('room_right', 'assets/RightNB.png');
      }

      create() {
        // Place the right image first (bottom layer)
        const rightImg = this.add.image(800, 0, 'room_right');
        rightImg.setOrigin(0, 0);
        const baseScale = 600 / rightImg.height;
        rightImg.setScale(baseScale);
        rightImg.setDepth(0);

        // Place the left image (top layer) with the same initial scale
        this.leftImg = this.add.image(0, 0, 'room_left');
        this.leftImg.setOrigin(0, 0);
        this.leftScale = baseScale; // Start with matching scale
        this.leftImg.setScale(this.leftScale);
        this.leftImg.setDepth(1);

        this.rightImg = rightImg;

        setOffsets({ x: this.leftImg.x, y: this.leftImg.y, scale: this.leftScale });

        if (this.input.keyboard) {
          this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            let moved = false;
            const step = 2; // Move 2 pixels per tap

            if (event.key === 'ArrowLeft') { this.leftImg.x -= step; moved = true; }
            else if (event.key === 'ArrowRight') { this.leftImg.x += step; moved = true; }
            else if (event.key === 'ArrowUp') { this.leftImg.y -= step; moved = true; }
            else if (event.key === 'ArrowDown') { this.leftImg.y += step; moved = true; }
            // Scale Controls: '[' makes it smaller, ']' makes it bigger
            else if (event.key === '[') { this.leftScale -= 0.001; this.leftImg.setScale(this.leftScale); moved = true; }
            else if (event.key === ']') { this.leftScale += 0.001; this.leftImg.setScale(this.leftScale); moved = true; }

            if (moved) {
              setOffsets({ 
                x: Math.round(this.leftImg.x), 
                y: Math.round(this.leftImg.y), 
                scale: parseFloat(this.leftScale.toFixed(4)) 
              });
            }
          });
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1600,
      height: 650,
      parent: gameContainerRef.current,
      backgroundColor: '#333333',
      scene: AlignmentScene,
      scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.CENTER_BOTH },
      pixelArt: false
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleCopyToClipboard = () => {
    const textToCopy = `X: ${offsets.x}, Y: ${offsets.y}, Scale: ${offsets.scale}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err: unknown) => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Room Alignment Tool</h2>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div ref={gameContainerRef} style={{ border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }} />
        
        <div style={{ 
          position: 'absolute', top: 10, left: 10, display: 'flex', gap: '20px', alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <span>X: {offsets.x}</span>
            <span style={{ marginLeft: '15px' }}>Y: {offsets.y}</span>
            <span style={{ marginLeft: '15px' }}>Scale: {offsets.scale}</span>
          </div>
          <button onClick={handleCopyToClipboard} style={{ padding: '8px 16px', fontSize: '14px', fontWeight: 'bold', color: 'white', backgroundColor: copied ? '#4CAF50' : '#007BFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {copied ? 'Copied!' : 'Copy Values'}
          </button>
        </div>
      </div>
      
      <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
        Arrow Keys: Move X/Y <br/>
        `[` and `]` Keys: Adjust Left Image Scale (to fix height mismatches)
      </p>
    </div>
  );
};

export default RoomAlignmentTool;
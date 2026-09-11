import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

interface Wall { x: number; y: number; w: number; h: number; }
interface Zone { x: number; y: number; id: string; color: number; }

const ZONE_COLORS: { [key: string]: number } = {
  computer: 0x00ff00, // Green
  door: 0xff0000,     // Red
  documents: 0x0000ff,// Blue
  bed: 0xffff00,      // Yellow
  box: 0xff00ff       // Magenta
};

const CoordinateFinderTool: React.FC = () => {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<string>('wall');
  
  const wallsRef = useRef<Wall[]>([]);
  const zonesRef = useRef<Zone[]>([]);
  const modeRef = useRef<string>('wall');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => { wallsRef.current = walls; }, [walls]);
  useEffect(() => { zonesRef.current = zones; }, [zones]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    if (!gameContainerRef.current || gameRef.current) return;

    class MapperScene extends Phaser.Scene {
      private gfx!: Phaser.GameObjects.Graphics;
      private labels!: Phaser.GameObjects.Container;
      private isDragging = false;
      private startX = 0;
      private startY = 0;
      private currentMouse = { x: 0, y: 0 };

      constructor() { super('MapperScene'); }

      preload() {
        this.load.image('room_left', 'assets/LeftNB.png');
        this.load.image('room_right', 'assets/RightNB.png');
      }

      create() {
        this.cameras.main.setBackgroundColor('#222222');
        
        const rightImg = this.add.image(800, 0, 'room_right').setOrigin(0, 0);
        const rightScale = 600 / rightImg.height;
        rightImg.setScale(rightScale).setDepth(-100);

        const leftImg = this.add.image(520, 146, 'room_left').setOrigin(0, 0);
        leftImg.setScale(0.5683).setDepth(-99);

        this.cameras.main.centerOn(700, 350);

        this.gfx = this.add.graphics();
        this.gfx.setDepth(1000);
        
        // Container to hold text labels so they don't lag the graphics redraw
        this.labels = this.add.container(0, 0).setDepth(1001);
        
        this.drawAll();

        this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
          const zoom = this.cameras.main.zoom;
          this.cameras.main.setZoom(Phaser.Math.Clamp(zoom - deltaY * 0.001, 0.1, 3));
          this.drawAll();
        });

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
          if (pointer.leftButtonDown()) {
            const currentMode = modeRef.current;
            if (currentMode === 'wall') {
              this.isDragging = true;
              this.startX = pointer.worldX;
              this.startY = pointer.worldY;
            } else {
              // It's a zone click! Add it instantly.
              zonesRef.current.push({ 
                x: Math.round(pointer.worldX), 
                y: Math.round(pointer.worldY), 
                id: currentMode, 
                color: ZONE_COLORS[currentMode] || 0xffffff 
              });
              setZones([...zonesRef.current]);
              this.drawAll();
            }
          }
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
          this.currentMouse = { x: pointer.worldX, y: pointer.worldY };
          if (this.isDragging) this.drawAll();
        });

        this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
          if (this.isDragging) {
            this.isDragging = false;
            const endX = pointer.worldX;
            const endY = pointer.worldY;
            const w = Math.abs(endX - this.startX);
            const h = Math.abs(endY - this.startY);
            
            if (w > 5 && h > 5) {
              const cx = Math.round(Math.min(this.startX, endX) + w / 2);
              const cy = Math.round(Math.min(this.startY, endY) + h / 2);
              wallsRef.current.push({ x: cx, y: cy, w: Math.round(w), h: Math.round(h) });
              setWalls([...wallsRef.current]);
            }
            this.drawAll();
          }
        });
      }

      public drawAll() {
        this.gfx.clear();
        this.labels.removeAll(true); // Clear old text labels
        const zoom = this.cameras.main.zoom || 1;
        
        // Draw Walls (Red)
        this.gfx.fillStyle(0xff0000, 0.3);
        this.gfx.lineStyle(2 / zoom, 0xff0000, 1);
        wallsRef.current.forEach(wall => {
          this.gfx.fillRect(wall.x - wall.w/2, wall.y - wall.h/2, wall.w, wall.h);
          this.gfx.strokeRect(wall.x - wall.w/2, wall.y - wall.h/2, wall.w, wall.h);
        });

        // Draw Zones (Colored dots with labels)
        zonesRef.current.forEach(zone => {
          this.gfx.fillStyle(zone.color, 1);
          this.gfx.fillCircle(zone.x, zone.y, 6 / zoom);
          
          // Add text label
          const text = this.add.text(zone.x + 10, zone.y - 10, `${zone.id}Zone`, { 
            fontFamily: 'monospace', 
            fontSize: `${14 / zoom}px`, 
            color: '#ffffff',
            backgroundColor: '#000000'
          });
          this.labels.add(text);
        });

        // Draw current drag selection
        if (this.isDragging) {
          this.gfx.lineStyle(2 / zoom, 0x00ff00, 1);
          this.gfx.fillStyle(0x00ff00, 0.2);
          const w = this.currentMouse.x - this.startX;
          const h = this.currentMouse.y - this.startY;
          this.gfx.fillRect(this.startX, this.startY, w, h);
          this.gfx.strokeRect(this.startX, this.startY, w, h);
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1400,
      height: 700,
      parent: gameContainerRef.current,
      backgroundColor: '#222222',
      scene: MapperScene,
      scale: { mode: Phaser.Scale.NONE, autoCenter: Phaser.Scale.CENTER_BOTH },
      pixelArt: false
    };

    gameRef.current = new Phaser.Game(config);

    return () => { if (gameRef.current) { gameRef.current.destroy(true); gameRef.current = null; } };
  }, []);

  const handleCopyAll = () => {
    const zoneCode = zones.map(z => `this.${z.id}Zone = createZone(${z.x}, ${z.y});`).join('\n');
    const wallCode = walls.map(w => `createWall(${w.x}, ${w.y}, ${w.w}, ${w.h});`).join('\n');
    const fullCode = `// --- ZONES ---\n${zoneCode}\n\n// --- WALLS ---\n${wallCode}`;

    navigator.clipboard.writeText(fullCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: '#fff', minHeight: '100vh' }}>
      <h2>Coordinate Finder & Wall Mapper</h2>
      
      <div style={{ marginBottom: '16px', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: '#333', padding: '12px', borderRadius: '8px' }}>
        <label style={{ fontSize: '16px', fontWeight: 'bold' }}>Current Tool:</label>
        <select 
          value={mode} 
          onChange={(e) => setMode(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '16px', backgroundColor: '#444', color: '#fff', border: '1px solid #777', borderRadius: '4px' }}
        >
          <option value="wall">Wall (Click & Drag)</option>
          <option value="computer">Computer Zone (Click)</option>
          <option value="door">Door Zone (Click)</option>
          <option value="documents">Documents Zone (Click)</option>
          <option value="box">Box Zone (Click)</option>
        </select>
        <span style={{ color: '#aaa', fontSize: '14px' }}>Right-Click drag to pan. Scroll to zoom.</span>
      </div>
      
      <div style={{ position: 'relative', display: 'inline-block', border: '2px solid #555', overflow: 'hidden' }}>
        <div ref={gameContainerRef} onContextMenu={e => e.preventDefault()} />
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>Zones ({zones.length})</h3>
          {zones.map((z, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
              <code style={{ backgroundColor: '#333', padding: '6px 10px', borderRadius: 4, fontFamily: 'monospace', flex: 1 }}>
                this.{z.id}Zone = createZone({z.x}, {z.y});
              </code>
              <button onClick={() => { zonesRef.current.splice(i, 1); setZones([...zonesRef.current]); }} style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
        
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h3>Walls ({walls.length})</h3>
          {walls.map((w, i) => (
            <div key={i} style={{ marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
              <code style={{ backgroundColor: '#333', padding: '6px 10px', borderRadius: 4, fontFamily: 'monospace', flex: 1 }}>
                createWall({w.x}, {w.y}, {w.w}, {w.h});
              </code>
              <button onClick={() => { wallsRef.current.splice(i, 1); setWalls([...wallsRef.current]); }} style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleCopyAll} style={{ marginTop: 20, padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: copied ? '#4CAF50' : '#007BFF', color: 'white', border: 'none', borderRadius: '6px' }}>
        {copied ? 'Copied!' : 'Copy All Code to Clipboard'}
      </button>
    </div>
  );
};

export default CoordinateFinderTool;
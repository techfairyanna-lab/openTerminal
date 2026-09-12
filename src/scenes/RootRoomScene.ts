import Phaser from 'phaser';

// ------------------------------------------------------------------
//  RootRoomScene — Linux "/" (Root) directory as a futuristic
//  isometric "System Core" data chamber.
//
//  • Catppuccin-mocha palette, matching IsoHomeRoomScene
//  • Dark diamond-grid floor with glowing neon data pathways
//  • Metallic server racks for /etc, /var, /usr built with the
//    boxTexture primitive, blinking LED pixels on top
//  • Central monolithic master terminal built with boxTexture
//  • Real MULTIPLY lightmap canvas + per-light glow pools
//  • Walkable: 11×11 grid, player sprite, WASD / arrows, camera follow
//  • Interactable /home door to exit
// ------------------------------------------------------------------

const W = 800;
const H = 600;
const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 120;
const WALL_THICKNESS = 0.2;
const GRID_W = 11;
const GRID_H = 11;
const ORIGIN_X = 400;
const ORIGIN_Y = 170;

// Catppuccin-mocha palette
const C_BASE     = 0x1e1e2e;
const C_CRUST    = 0x11111b;
const C_MANTLE   = 0x181825;
const C_SURFACE0 = 0x313244;
const C_SURFACE1 = 0x45475a;
const C_SURFACE2 = 0x585b70;
const C_OVERLAY0 = 0x6c7086;
const C_SUBTEXT0 = 0xa6adc8;
const C_TEXT     = 0xcdd6f4;
const C_BLUE     = 0x89b4fa;
const C_LAVENDER = 0xb4befe;
const C_SAPPHIRE = 0x74c7ec;
const C_TEAL     = 0x94e2d5;
const C_GREEN    = 0xa6e3a1;
const C_YELLOW   = 0xf9e2af;
const C_PEACH    = 0xfab387;
const C_MAUVE    = 0xcba6f7;
const C_PINK     = 0xf5c2e7;
const C_RED      = 0xf38ba8;

// Player pixel-art colors (shared with IsoHomeRoomScene)
const C_HAIR = '#7c5c49';
const C_SKIN = '#ffd9b3';
const C_HOOD = '#89b4fa';
const C_PANT = '#313244';
const C_SHOE = '#f5e0dc';
const C_EYE  = '#1e1e2e';

interface RackDef {
  id: string;
  label: string;
  desc: string;
  gx: number;
  gy: number;
  ledColor: number;
  glowColor: number;
}

interface SolidTile {
  x: number;
  y: number;
}

interface InteractableDef {
  id: string;
  gx: number;
  gy: number;
  radius: number;
  prompt: string;
  line: string;
}

type DrawCallback = { (cx: CanvasRenderingContext2D): void };

export class RootRoomScene extends Phaser.Scene {
  // Lightmap state
  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;

  // Tracked light sources
  private monolithLight = { x: 0, y: 0 };
  private rackLights: { x: number; y: number; tint: number }[] = [];

  // Holographic + crown props around the monolith
  private coreRingA?: Phaser.GameObjects.Sprite;
  private coreRingB?: Phaser.GameObjects.Sprite;
  private coreGlow?: Phaser.GameObjects.Sprite;
  private coreScreenText?: Phaser.GameObjects.Text;
  private coreScreenTextIdx = 0;

  // LED sprites that need blink tweens
  private ledOverlays: { sprite: Phaser.GameObjects.Sprite; tint: number }[] = [];

  // Player state
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private playerGrid = { x: 5, y: 9 };
  private moving = false;
  private moveProxy = { t: 0 };
  private solids: SolidTile[] = [];
  
  // Interaction state
  private interactables: InteractableDef[] = [];
  private nearTarget: InteractableDef | null = null;
  private promptText!: Phaser.GameObjects.Text;

  constructor() {
    super('RootRoom');
  }

  // ============================== ISO MATH =============================

  private isoToScreen(gx: number, gy: number): { x: number; y: number } {
    return {
      x: ORIGIN_X + (gx - gy) * (TILE_W / 2),
      y: ORIGIN_Y + (gx + gy) * (TILE_H / 2),
    };
  }

  private computeDepth(gx: number, gy: number, spriteYOffset: number): number {
    return (gx + gy) * 10 + spriteYOffset;
  }

  // ============================== CREATE =============================

  create(): void {
    this.interactables = [];
    
    this.makeTextures();
    this.buildFloor();
    this.buildWalls();
    this.buildSystemCore();
    this.buildServerRacks();
    this.buildAtmosphere();
    this.buildPlayer();
    this.buildUI();
    this.buildLighting();
    this.buildInput();

    this.cameras.main.setBackgroundColor(C_CRUST);
    this.cameras.main.setBounds(-300, -200, 1500, 1100);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.fadeIn(800, 2, 6, 14);

    if (this.coreRingA) {
      this.tweens.add({
        targets: this.coreRingA,
        rotation: Math.PI * 2,
        duration: 8000,
        repeat: -1,
      });
    }
    if (this.coreRingB) {
      this.tweens.add({
        targets: this.coreRingB,
        rotation: -Math.PI * 2,
        duration: 12000,
        repeat: -1,
      });
    }
    if (this.coreGlow) {
      this.tweens.add({
        targets: this.coreGlow,
        alpha: 0.45,
        scale: 1.08,
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    const self = this;
    const lines = [
      '> mount -t proc',
      '> ls /',
      '/bin /etc /var /usr',
      '/tmp /dev /proc',
      '> uname -r',
      '6.5.0-generic',
      '> uptime',
      '42:13:07',
      '> █',
    ];
    this.coreScreenTextIdx = 0;
    const cycle = function (): void {
      if (!self.coreScreenText) return;
      self.coreScreenText.setText(lines[self.coreScreenTextIdx % lines.length]);
      self.coreScreenTextIdx++;
    };
    cycle();
    this.time.addEvent({ delay: 1800, callback: cycle, loop: true });

    // Independent blink animations for every rack LED
    for (const entry of this.ledOverlays) {
      this.tweens.add({
        targets: entry.sprite,
        alpha: 0.25 + Math.random() * 0.3,
        duration: 400 + Math.random() * 1400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  // ============================== TEXTURE HELPERS =============================

  private canvasTexture(key: string, w: number, h: number, draw: DrawCallback): void {
    if (this.textures.exists(key)) return;
    const ct = this.textures.createCanvas(key, w, h);
    if (!ct) return;
    draw(ct.context);
    ct.refresh();
  }

  private diamondPath(cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
    cx.beginPath();
    cx.moveTo(x, y - h / 2);
    cx.lineTo(x + w / 2, y);
    cx.lineTo(x, y + h / 2);
    cx.lineTo(x - w / 2, y);
    cx.closePath();
  }

  private boxTexture(
    key: string,
    fw: number,
    fh: number,
    height: number,
    topCol: string,
    leftCol: string,
    rightCol: string,
    detail?: DrawCallback
  ): void {
    const cw = (fw + fh) * (TILE_W / 2);
    const chh = (fw + fh) * (TILE_H / 2);
    this.canvasTexture(key, cw, chh + height, function (cx) {
      const ax = fh * (TILE_W / 2);
      const bx = ax + fw * (TILE_W / 2);
      const byy = fw * (TILE_H / 2);
      const cxp = fw * (TILE_W / 2);
      const cyp = chh;
      const dx = 0;
      const dy = fh * (TILE_H / 2);

      cx.fillStyle = leftCol;
      cx.beginPath();
      cx.moveTo(dx, dy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(dx, dy + height);
      cx.closePath(); cx.fill();

      cx.fillStyle = rightCol;
      cx.beginPath();
      cx.moveTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(bx, byy + height);
      cx.closePath(); cx.fill();

      cx.fillStyle = topCol;
      cx.beginPath();
      cx.moveTo(ax, 0); cx.lineTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(dx, dy);
      cx.closePath(); cx.fill();

      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(ax, 0); cx.lineTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(dx, dy);
      cx.closePath(); cx.stroke();

      cx.beginPath();
      cx.moveTo(cxp, cyp); cx.lineTo(cxp, cyp + height);
      cx.stroke();

      cx.fillStyle = '#1e1e2e';
      cx.fillRect(0, dy - 1, 2, height + 2);
      cx.fillRect(cw - 2, byy - 1, 2, height + 2);

      if (detail) detail(cx);
    });
  }

  private wallTexture(key: string, fw: number, fh: number, height: number, detail?: DrawCallback): void {
    const cw = (fw + fh) * (TILE_W / 2);
    const chh = (fw + fh) * (TILE_H / 2);
    this.canvasTexture(key, cw, chh + height, function (cx) {
      const ax = fh * (TILE_W / 2);
      const bx = ax + fw * (TILE_W / 2);
      const byy = fw * (TILE_H / 2);
      const cxp = fw * (TILE_W / 2);
      const cyp = chh;
      const dx = 0;
      const dy = fh * (TILE_H / 2);

      cx.fillStyle = '#313244';
      cx.beginPath();
      cx.moveTo(dx, dy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(dx, dy + height);
      cx.closePath(); cx.fill();

      cx.fillStyle = '#1e1e2e';
      cx.beginPath();
      cx.moveTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(bx, byy + height);
      cx.closePath(); cx.fill();

      cx.fillStyle = '#45475a';
      cx.beginPath();
      cx.moveTo(ax, 0); cx.lineTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(dx, dy);
      cx.closePath(); cx.fill();

      const baseH = 12;
      cx.fillStyle = '#181825';
      cx.beginPath();
      cx.moveTo(dx, dy + height - baseH); cx.lineTo(cxp, cyp + height - baseH); cx.lineTo(cxp, cyp + height); cx.lineTo(dx, dy + height);
      cx.closePath(); cx.fill();

      cx.fillStyle = '#11111b';
      cx.beginPath();
      cx.moveTo(bx, byy + height - baseH); cx.lineTo(cxp, cyp + height - baseH); cx.lineTo(cxp, cyp + height); cx.lineTo(bx, byy + height);
      cx.closePath(); cx.fill();

      if (detail) detail(cx);

      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(ax, 0); cx.lineTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(dx, dy);
      cx.closePath(); cx.stroke();

      cx.beginPath();
      cx.moveTo(cxp, cyp); cx.lineTo(cxp, cyp + height);
      cx.stroke();

      cx.fillStyle = '#1e1e2e';
      cx.fillRect(0, dy - 1, 2, height + 2);
      cx.fillRect(cw - 2, byy - 1, 2, height + 2);
    });
  }

  // ============================== FLOOR TILES =============================

  private makeFloorTileTexture(key: string, pattern: number, intensity: number): void {
    const self = this;
    const traceColor = intensity > 1.1 ? C_TEAL : C_BLUE;
    const traceHex = '#' + traceColor.toString(16).padStart(6, '0');

    this.canvasTexture(key, TILE_W, TILE_H, function (cx) {
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.fillStyle = '#1e1e2e';
      cx.fill();

      cx.save();
      cx.translate(32, 16);
      cx.scale(0.78, 0.5);
      cx.beginPath();
      cx.moveTo(0, -8); cx.lineTo(8, 0); cx.lineTo(0, 8); cx.lineTo(-8, 0);
      cx.closePath();
      cx.fillStyle = '#11111b';
      cx.fill();
      cx.restore();

      cx.strokeStyle = traceHex;
      cx.lineWidth = 1;
      cx.lineCap = 'round';
      cx.lineJoin = 'round';

      const a = 0.55 + 0.4 * intensity;
      if (pattern === 0) {
        cx.globalAlpha = a;
        cx.beginPath();
        cx.moveTo(0, 12); cx.lineTo(64, 12);
        cx.moveTo(0, 20); cx.lineTo(20, 20);
        cx.moveTo(28, 20); cx.lineTo(64, 20);
        cx.stroke();
        cx.fillStyle = traceHex;
        cx.fillRect(20, 11, 2, 2);
        cx.fillRect(28, 11, 2, 2);
        cx.fillRect(20, 19, 2, 2);
        cx.fillRect(40, 19, 2, 2);
      } else if (pattern === 1) {
        cx.globalAlpha = a;
        cx.beginPath();
        cx.moveTo(32, 0); cx.lineTo(32, 32);
        cx.moveTo(16, 16); cx.lineTo(32, 16);
        cx.moveTo(32, 16); cx.lineTo(48, 16);
        cx.stroke();
        cx.fillStyle = traceHex;
        cx.fillRect(31, 15, 2, 2);
        cx.fillRect(15, 15, 2, 2);
        cx.fillRect(47, 15, 2, 2);
      } else if (pattern === 2) {
        cx.globalAlpha = a;
        cx.beginPath();
        cx.moveTo(0, 8); cx.lineTo(24, 8);
        cx.lineTo(32, 16); cx.lineTo(40, 16);
        cx.moveTo(48, 24); cx.lineTo(64, 24);
        cx.stroke();
        cx.fillStyle = traceHex;
        cx.fillRect(23, 7, 2, 2);
        cx.fillRect(39, 15, 2, 2);
        cx.fillRect(47, 23, 2, 2);
      } else if (pattern === 3) {
        cx.globalAlpha = a;
        cx.beginPath();
        cx.moveTo(0, 16); cx.lineTo(24, 16);
        cx.moveTo(24, 16); cx.lineTo(32, 8);
        cx.moveTo(24, 16); cx.lineTo(32, 24);
        cx.stroke();
        cx.fillStyle = traceHex;
        cx.fillRect(31, 7, 2, 2);
        cx.fillRect(31, 23, 2, 2);
        cx.fillRect(23, 15, 2, 2);
      } else if (pattern === 4) {
        cx.globalAlpha = a * 0.7;
        cx.beginPath();
        cx.moveTo(8, 16); cx.lineTo(56, 16);
        cx.moveTo(32, 0); cx.lineTo(32, 32);
        cx.stroke();
        cx.globalAlpha = a;
        cx.fillStyle = traceHex;
        cx.fillRect(31, 15, 2, 2);
      } else {
        cx.globalAlpha = a * 0.4;
        cx.beginPath();
        cx.moveTo(8, 4); cx.lineTo(16, 4);
        cx.moveTo(56, 4); cx.lineTo(48, 4);
        cx.moveTo(8, 28); cx.lineTo(16, 28);
        cx.moveTo(56, 28); cx.lineTo(48, 28);
        cx.stroke();
        cx.globalAlpha = a;
        cx.fillStyle = traceHex;
        cx.fillRect(7, 3, 2, 2);
        cx.fillRect(55, 3, 2, 2);
        cx.fillRect(7, 27, 2, 2);
        cx.fillRect(55, 27, 2, 2);
      }
      cx.globalAlpha = 1;

      cx.strokeStyle = '#313244';
      cx.lineWidth = 1;
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.stroke();
    });
  }

  private makeCenterTileTexture(): void {
    const self = this;
    this.canvasTexture('sys_floor_center', TILE_W, TILE_H, function (cx) {
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.fillStyle = '#1e1e2e';
      cx.fill();

      cx.save();
      cx.translate(32, 16);
      cx.scale(0.5, 0.3);
      cx.beginPath();
      cx.moveTo(0, -8); cx.lineTo(8, 0); cx.lineTo(0, 8); cx.lineTo(-8, 0);
      cx.closePath();
      cx.fillStyle = '#11111b';
      cx.fill();
      cx.restore();

      cx.strokeStyle = '#94e2d5';
      cx.lineWidth = 1.5;
      cx.lineCap = 'round';
      cx.globalAlpha = 0.95;
      cx.beginPath();
      cx.moveTo(0, 16); cx.lineTo(20, 16); cx.lineTo(32, 8);
      cx.moveTo(64, 16); cx.lineTo(44, 16); cx.lineTo(32, 8);
      cx.moveTo(32, 0); cx.lineTo(32, 8);
      cx.moveTo(32, 24); cx.lineTo(32, 32);
      cx.stroke();
      cx.globalAlpha = 1;

      cx.fillStyle = '#94e2d5';
      cx.fillRect(30, 6, 4, 4);
      cx.fillStyle = '#cdd6f4';
      cx.fillRect(31, 7, 2, 2);

      cx.strokeStyle = '#313244';
      cx.lineWidth = 1;
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.stroke();
    });
  }

  // ============================== SERVER RACK (boxTexture) =============================

  private makeServerRackTexture(rackKey: string, label: string, ledColor: number): void {
    const ledHex = '#' + ledColor.toString(16).padStart(6, '0');

    this.boxTexture(
      rackKey,
      1, 1, 156,
      '#313244',
      '#1e1e2e',
      '#45475a',
      function (cx) {
        cx.fillStyle = '#11111b';
        cx.fillRect(20, 6, 24, 8);
        cx.fillStyle = '#45475a';
        for (let vx = 22; vx < 42; vx += 3) {
          cx.fillRect(vx, 8, 2, 4);
        }
        cx.fillStyle = ledHex;
        cx.fillRect(30, 4, 4, 2);

        cx.fillStyle = '#11111b';
        cx.fillRect(34, 20, 28, 6);
        cx.fillStyle = '#cdd6f4';
        cx.font = 'bold 4px monospace';
        cx.fillText(label, 36, 24);

        const ledPatterns = [ledHex, ledHex, '#f9e2af', '#f38ba8', ledHex];
        for (let s = 0; s < 5; s++) {
          const sy = 32 + s * 24;

          cx.fillStyle = '#11111b';
          cx.fillRect(34, sy, 28, 18);

          cx.fillStyle = '#585b70';
          cx.fillRect(34, sy, 28, 1);
          cx.fillRect(34, sy, 1, 18);

          cx.fillStyle = '#585b70';
          cx.fillRect(35, sy + 2, 26, 1);

          for (let l = 0; l < 3; l++) {
            const lx = 38 + l * 5;
            const ly = sy + 10;
            cx.fillStyle = '#000000';
            cx.fillRect(lx, ly, 3, 3);
          }

          cx.fillStyle = '#a6adc8';
          cx.font = '3px monospace';
          cx.fillText('OK', 56, sy + 6);
        }

        const pedestalY = 32 + 5 * 24 + 6;
        cx.fillStyle = ledHex;
        cx.globalAlpha = 0.95;
        cx.fillRect(34, pedestalY, 28, 2);
        cx.globalAlpha = 0.35;
        cx.fillRect(34, pedestalY - 4, 28, 6);
        cx.globalAlpha = 1;
      }
    );
  }

  // ============================== MONOLITH (boxTexture) =============================

  private makeMonolithTexture(): void {
    this.boxTexture(
      'sys_monolith',
      1, 1, 180,
      '#313244',
      '#1e1e2e',
      '#45475a',
      function (cx) {
        cx.fillStyle = '#89b4fa';
        cx.fillRect(28, 14, 8, 2);
        cx.fillRect(24, 16, 16, 2);
        cx.fillRect(20, 18, 24, 2);
        cx.fillRect(24, 20, 16, 2);
        cx.fillRect(28, 22, 8, 2);
        cx.fillStyle = '#cdd6f4';
        cx.fillRect(30, 17, 4, 2);

        cx.globalAlpha = 0.3;
        cx.fillStyle = '#89b4fa';
        cx.beginPath();
        cx.moveTo(20, 18); cx.lineTo(44, 18); cx.lineTo(32, 6);
        cx.closePath();
        cx.fill();
        cx.globalAlpha = 1;

        cx.fillStyle = '#89b4fa';
        cx.globalAlpha = 0.9;
        cx.fillRect(36, 20, 1, 160);
        cx.fillRect(60, 20, 1, 160);
        cx.globalAlpha = 1;

        cx.fillStyle = '#94e2d5';
        for (let y = 24; y < 180; y += 6) {
          cx.globalAlpha = (y % 12 === 0) ? 0.95 : 0.4;
          cx.fillRect(36, y, 1, 2);
          cx.fillRect(60, y, 1, 2);
        }
        cx.globalAlpha = 1;

        cx.fillStyle = '#11111b';
        cx.fillRect(40, 50, 16, 90);

        cx.fillStyle = '#89b4fa';
        cx.fillRect(40, 49, 16, 1);
        cx.fillRect(40, 140, 16, 1);
        cx.fillRect(39, 50, 1, 90);
        cx.fillRect(56, 50, 1, 90);

        cx.fillStyle = '#181825';
        cx.fillRect(41, 51, 14, 88);

        cx.fillStyle = '#89b4fa';
        cx.fillRect(34, 165, 28, 2);
        cx.globalAlpha = 0.4;
        cx.fillRect(34, 161, 28, 6);
        cx.globalAlpha = 1;

        cx.fillStyle = '#cdd6f4';
        cx.font = 'bold 5px monospace';
        cx.fillText('SYS://CORE', 36, 175);

        cx.fillStyle = '#585b70';
        cx.fillRect(30, 10, 4, 4);
        cx.fillStyle = '#f5c2e7';
        cx.fillRect(31, 8, 2, 2);
      }
    );
  }

  // ============================== RING / GLOW / PLAYER TEXTURES =============================

  private makeRingTextures(): void {
    this.canvasTexture('sys_ring_a', 144, 36, function (cx) {
      cx.clearRect(0, 0, 144, 36);
      cx.strokeStyle = '#89b4fa';
      cx.lineWidth = 1.5;
      cx.beginPath();
      cx.ellipse(72, 18, 68, 14, 0, 0, Math.PI * 2);
      cx.stroke();
      cx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const x1 = 72 + Math.cos(a) * 68;
        const y1 = 18 + Math.sin(a) * 14;
        const x2 = 72 + Math.cos(a) * 64;
        const y2 = 18 + Math.sin(a) * 14;
        cx.beginPath();
        cx.moveTo(x1, y1); cx.lineTo(x2, y2);
        cx.stroke();
      }
      cx.fillStyle = '#89b4fa';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
        const x = 72 + Math.cos(a) * 68;
        const y = 18 + Math.sin(a) * 14;
        cx.fillRect(x - 1.5, y - 1.5, 3, 3);
      }
    });

    this.canvasTexture('sys_ring_b', 168, 36, function (cx) {
      cx.clearRect(0, 0, 168, 36);
      cx.strokeStyle = '#94e2d5';
      cx.lineWidth = 1;
      cx.globalAlpha = 0.7;
      cx.beginPath();
      cx.ellipse(84, 18, 80, 16, 0, 0, Math.PI * 2);
      cx.stroke();
      cx.globalAlpha = 0.4;
      cx.setLineDash([4, 3]);
      cx.beginPath();
      cx.ellipse(84, 18, 74, 12, 0, 0, Math.PI * 2);
      cx.stroke();
      cx.setLineDash([]);
      cx.globalAlpha = 0.9;
      cx.fillStyle = '#94e2d5';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        const x = 84 + Math.cos(a) * 80;
        const y = 18 + Math.sin(a) * 16;
        cx.fillRect(x - 1, y - 1, 2, 2);
      }
    });
  }

  private makeCoreGlowTexture(): void {
    this.canvasTexture('sys_core_glow', 192, 96, function (cx) {
      cx.clearRect(0, 0, 192, 96);
      const grad = cx.createRadialGradient(96, 48, 0, 96, 48, 96);
      grad.addColorStop(0, 'rgba(137, 180, 250, 0.55)');
      grad.addColorStop(0.4, 'rgba(148, 226, 213, 0.25)');
      grad.addColorStop(1, 'rgba(137, 180, 250, 0)');
      cx.fillStyle = grad;
      cx.fillRect(0, 0, 192, 96);
    });
  }

  private makeLedPixelTexture(): void {
    this.canvasTexture('sys_led_pixel', 1, 1, function (cx) {
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = '#ffffff';
      cx.fillRect(0, 0, 1, 1);
    });
  }

  private makeMoteTextures(): void {
    this.canvasTexture('sys_mote', 8, 8, function (cx) {
      cx.clearRect(0, 0, 8, 8);
      cx.fillStyle = '#89b4fa';
      cx.fillRect(3, 3, 2, 2);
      cx.globalAlpha = 0.4;
      cx.fillRect(2, 2, 4, 4);
      cx.globalAlpha = 1;
    });
    this.canvasTexture('sys_mote_teal', 8, 8, function (cx) {
      cx.clearRect(0, 0, 8, 8);
      cx.fillStyle = '#94e2d5';
      cx.fillRect(3, 3, 2, 2);
      cx.globalAlpha = 0.4;
      cx.fillRect(2, 2, 4, 4);
      cx.globalAlpha = 1;
    });
  }

  private makeGlowRadialTexture(): void {
    this.canvasTexture('glow_radial', 128, 128, function (cx) {
      const grad = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = grad;
      cx.fillRect(0, 0, 128, 128);
    });
  }

  private makePlayerFrames(): void {
    const self = this;

    const drawBlock = function (
      cx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      color: string
    ): void {
      cx.fillStyle = '#1e1e2e';
      cx.fillRect(x - 1, y - 1, w + 2, h + 2);
      cx.fillStyle = color;
      cx.fillRect(x, y, w, h);
    };

    const playerFrame = function (key: string, dir: 'd' | 'u' | 's', f: number): void {
      if (self.textures.exists(key)) return;
      const ct = self.textures.createCanvas(key, 24, 32);
      if (!ct) return;
      const cx = ct.context;

      const legs = function (frame: number): void {
        if (frame === 0) {
          drawBlock(cx, 9, 22, 2, 7, C_PANT);
          drawBlock(cx, 13, 22, 2, 7, C_PANT);
          drawBlock(cx, 8, 29, 3, 2, C_SHOE);
          drawBlock(cx, 13, 29, 3, 2, C_SHOE);
        } else {
          drawBlock(cx, 9, 22, 2, 5, C_PANT);
          drawBlock(cx, 8, 27, 3, 2, C_SHOE);
          drawBlock(cx, 13, 22, 2, 7, C_PANT);
          drawBlock(cx, 13, 29, 3, 2, C_SHOE);
        }
      };

      if (dir === 'd') {
        drawBlock(cx, 6, 2, 12, 3, C_HAIR);
        drawBlock(cx, 5, 4, 2, 9, C_HAIR);
        drawBlock(cx, 17, 4, 2, 9, C_HAIR);
        drawBlock(cx, 8, 5, 8, 6, C_SKIN);
        drawBlock(cx, 8, 5, 8, 2, C_HAIR);
        drawBlock(cx, 9, 8, 2, 2, C_EYE);
        drawBlock(cx, 13, 8, 2, 2, C_EYE);
        drawBlock(cx, 7, 11, 10, 7, C_HOOD);
        drawBlock(cx, 5, 11, 2, 6, C_HOOD);
        drawBlock(cx, 17, 11, 2, 6, C_HOOD);
        drawBlock(cx, 7, 18, 10, 4, C_PANT);
        legs(f);
      } else if (dir === 'u') {
        drawBlock(cx, 5, 2, 14, 12, C_HAIR);
        drawBlock(cx, 7, 12, 10, 6, C_HOOD);
        drawBlock(cx, 7, 18, 10, 4, C_PANT);
        legs(f);
      } else {
        drawBlock(cx, 6, 2, 9, 11, C_HAIR);
        drawBlock(cx, 6, 2, 10, 3, C_HAIR);
        drawBlock(cx, 12, 5, 6, 6, C_SKIN);
        drawBlock(cx, 12, 5, 6, 2, C_HAIR);
        drawBlock(cx, 15, 8, 2, 2, C_EYE);
        drawBlock(cx, 8, 11, 8, 7, C_HOOD);
        drawBlock(cx, 10, 12, 3, 6, C_HOOD);
        drawBlock(cx, 8, 18, 8, 4, C_PANT);
        if (f === 0) {
          drawBlock(cx, 9, 22, 3, 7, C_PANT);
          drawBlock(cx, 13, 22, 3, 7, C_PANT);
          drawBlock(cx, 9, 29, 4, 2, C_SHOE);
          drawBlock(cx, 13, 29, 4, 2, C_SHOE);
        } else {
          drawBlock(cx, 9, 22, 3, 7, C_PANT);
          drawBlock(cx, 9, 29, 4, 2, C_SHOE);
          drawBlock(cx, 14, 22, 3, 5, C_PANT);
          drawBlock(cx, 14, 27, 4, 2, C_SHOE);
        }
      }
      ct.refresh();
    };

    playerFrame('pf_d0', 'd', 0);
    playerFrame('pf_d1', 'd', 1);
    playerFrame('pf_u0', 'u', 0);
    playerFrame('pf_u1', 'u', 1);
    playerFrame('pf_s0', 's', 0);
    playerFrame('pf_s1', 's', 1);

    if (!this.anims.exists('walk-down')) {
      this.anims.create({ key: 'walk-down', frames: [{ key: 'pf_d0' }, { key: 'pf_d1' }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: 'walk-up', frames: [{ key: 'pf_u0' }, { key: 'pf_u1' }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: 'walk-side', frames: [{ key: 'pf_s0' }, { key: 'pf_s1' }], frameRate: 6, repeat: -1 });
    }
  }

  private makeDoorTexture(): void {
    this.wallTexture('sys_door_home', 1, WALL_THICKNESS, WALL_H, function (cx) {
      // Dark inset
      cx.fillStyle = '#11111b';
      cx.beginPath();
      cx.moveTo(6, 24); cx.lineTo(26, 34); cx.lineTo(26, 136); cx.lineTo(6, 126);
      cx.closePath(); cx.fill();
      
      // Glowing blue door
      cx.fillStyle = '#89b4fa';
      cx.beginPath();
      cx.moveTo(8, 28); cx.lineTo(24, 36); cx.lineTo(24, 130); cx.lineTo(8, 122);
      cx.closePath(); cx.fill();
      
      // Label
      cx.fillStyle = '#cdd6f4';
      cx.font = 'bold 6px monospace';
      cx.fillText('/home', 10, 80);
    });
  }

  private makeTextures(): void {
    for (let i = 0; i < 6; i++) {
      this.makeFloorTileTexture('sys_floor_' + i, i, 1);
    }
    this.makeFloorTileTexture('sys_floor_path', 4, 1.3);
    this.makeCenterTileTexture();

    this.wallTexture('sys_wall_back', 1, WALL_THICKNESS, WALL_H);
    this.wallTexture('sys_wall_side', WALL_THICKNESS, 1, WALL_H);
    this.makeDoorTexture();

    this.makeMonolithTexture();
    this.makeRingTextures();
    this.makeCoreGlowTexture();
    this.makeLedPixelTexture();
    this.makeMoteTextures();
    this.makeGlowRadialTexture();
    this.makePlayerFrames();
  }

  // ============================== SPRITE HELPERS =============================

  private addBoxSprite(
    key: string,
    bx: number,
    by: number,
    fw: number,
    fh: number,
    offsetY: number,
    height: number
  ): Phaser.GameObjects.Sprite {
    const cx = bx + (fw - 1) / 2;
    const cy = by + (fh - 1) / 2;
    const p = this.isoToScreen(cx, cy);
    const chh = (fw + fh) * (TILE_H / 2);
    const canvasHeight = chh + height;
    const sprite = this.add.sprite(p.x, p.y - height, key);
    sprite.setOrigin(0.5, (chh / 2) / canvasHeight);
    sprite.setDepth(this.computeDepth(cx, cy, offsetY));
    return sprite;
  }

  private addIsoSprite(
    key: string,
    gx: number,
    gy: number,
    offsetY: number,
    originY?: number
  ): Phaser.GameObjects.Sprite {
    const p = this.isoToScreen(gx, gy);
    const sprite = this.add.sprite(p.x, p.y, key);
    sprite.setOrigin(0.5, originY ?? 0.5);
    sprite.setDepth(this.computeDepth(gx, gy, offsetY));
    return sprite;
  }

  // ============================== BUILD SCENE =============================

  private buildFloor(): void {
    for (let gx = 0; gx < GRID_W; gx++) {
      for (let gy = 0; gy < GRID_H; gy++) {
        const idx = (gx + gy * 2) % 6;
        const tileKey = 'sys_floor_' + idx;
        this.addIsoSprite(tileKey, gx, gy, 0, 0.5);
      }
    }

    this.addIsoSprite('sys_floor_center', 5, 5, 1, 0.5);

    this.addIsoSprite('sys_floor_path', 4, 4, 0.5, 0.5);
    this.addIsoSprite('sys_floor_path', 3, 3, 0.5, 0.5);
    this.addIsoSprite('sys_floor_path', 6, 4, 0.5, 0.5);
    this.addIsoSprite('sys_floor_path', 7, 3, 0.5, 0.5);
    this.addIsoSprite('sys_floor_path', 5, 6, 0.5, 0.5);
    this.addIsoSprite('sys_floor_path', 5, 7, 0.5, 0.5);
  }

  private buildWalls(): void {
    this.solids = [];
    for (let gy = 0; gy < GRID_H; gy++) {
      this.addBoxSprite('sys_wall_side', 0, gy, WALL_THICKNESS, 1, -2, WALL_H);
      this.solids.push({ x: 0, y: gy });
    }
    for (let gx = 0; gx < GRID_W; gx++) {
      if (gx === 2) {
        this.addBoxSprite('sys_door_home', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
        this.interactables.push({ 
          id: 'door_home', 
          gx: 2, 
          gy: 0.6, 
          radius: 1.5, 
          prompt: '[E] Return to /home', 
          line: 'Returning to /home...' 
        });
      } else {
        this.addBoxSprite('sys_wall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      }
      this.solids.push({ x: gx, y: 0 });
    }
  }

  private buildSystemCore(): void {
    const centerGx = 5;
    const centerGy = 5;
    const coreP = this.isoToScreen(centerGx, centerGy);

    this.coreGlow = this.add.sprite(coreP.x, coreP.y + 10, 'sys_core_glow');
    this.coreGlow.setOrigin(0.5, 0.5);
    this.coreGlow.setAlpha(0.75);
    this.coreGlow.setDepth(this.computeDepth(centerGx, centerGy, 2));

    this.addBoxSprite('sys_monolith', centerGx, centerGy, 1, 1, 15, 180);
    this.solids.push({ x: centerGx, y: centerGy });

    this.monolithLight = { x: coreP.x + 16, y: coreP.y - 90 };

    this.coreScreenText = this.add.text(coreP.x + 16, coreP.y - 90, '', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#94e2d5',
    });
    this.coreScreenText.setOrigin(0.5, 0.5);
    this.coreScreenText.setDepth(this.computeDepth(centerGx, centerGy, 16));

    this.coreRingA = this.add.sprite(coreP.x, coreP.y - 80, 'sys_ring_a');
    this.coreRingA.setOrigin(0.5, 0.5);
    this.coreRingA.setDepth(this.computeDepth(centerGx, centerGy, 25));

    this.coreRingB = this.add.sprite(coreP.x, coreP.y - 100, 'sys_ring_b');
    this.coreRingB.setOrigin(0.5, 0.5);
    this.coreRingB.setDepth(this.computeDepth(centerGx, centerGy, 24));

    const crown = this.add.text(coreP.x, coreP.y - 140, '[ SYS ]', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#89b4fa',
      backgroundColor: 'rgba(17, 17, 27, 0.85)',
      padding: { x: 6, y: 3 },
    });
    crown.setOrigin(0.5, 0.5);
    crown.setDepth(this.computeDepth(centerGx, centerGy, 26));
    this.tweens.add({
      targets: crown,
      y: coreP.y - 150,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private buildServerRacks(): void {
    const racks: RackDef[] = [
      { id: 'etc', label: '/etc', desc: 'System configuration files.', gx: 2, gy: 3, ledColor: C_BLUE,   glowColor: C_BLUE },
      { id: 'var', label: '/var', desc: 'Variable data and logs.',    gx: 8, gy: 3, ledColor: C_YELLOW, glowColor: C_PEACH },
      { id: 'usr', label: '/usr', desc: 'User-land software.',        gx: 5, gy: 8, ledColor: C_GREEN,  glowColor: C_GREEN },
    ];

    for (const def of racks) {
      const rackKey = 'sys_rack_' + def.id;
      this.makeServerRackTexture(rackKey, def.label, def.ledColor);

      const p = this.isoToScreen(def.gx, def.gy);

      this.addBoxSprite(rackKey, def.gx, def.gy, 1, 1, 8, 156);
      this.solids.push({ x: def.gx, y: def.gy });

      const label = this.add.text(p.x, p.y + 28, def.label, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#cdd6f4',
        backgroundColor: 'rgba(17, 17, 27, 0.85)',
        padding: { x: 5, y: 2 },
      });
      label.setOrigin(0.5, 0.5);
      label.setDepth(this.computeDepth(def.gx, def.gy, 10));
      this.tweens.add({
        targets: label,
        y: label.y - 3,
        duration: 2000 + Math.random() * 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      const desc = this.add.text(p.x, p.y + 44, def.desc, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#a6adc8',
        backgroundColor: 'rgba(17, 17, 27, 0.7)',
        padding: { x: 4, y: 2 },
      });
      desc.setOrigin(0.5, 0.5);
      desc.setDepth(this.computeDepth(def.gx, def.gy, 10));

      const rackDepth = this.computeDepth(def.gx, def.gy, 9);
      for (let s = 0; s < 5; s++) {
        for (let l = 0; l < 3; l++) {
          const recessX = p.x + 6 + l * 5;
          const recessY = p.y - 130 + s * 24;

          const roll = Math.random();
          let color = def.ledColor;
          if (roll < 0.15) color = C_YELLOW;
          else if (roll < 0.22) color = C_RED;

          const led = this.add.sprite(recessX + 1, recessY + 1, 'sys_led_pixel');
          led.setOrigin(0, 0);
          led.setDepth(rackDepth);
          led.setTint(color);
          this.ledOverlays.push({ sprite: led, tint: color });
        }
      }

      this.rackLights.push({ x: p.x + 8, y: p.y - 78, tint: def.glowColor });
    }
  }

  private buildAtmosphere(): void {
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 900;
      const y = (Math.random() - 0.5) * 500;
      const isTeal = Math.random() < 0.4;
      const mote = this.add.sprite(
        ORIGIN_X + x,
        ORIGIN_Y + y,
        isTeal ? 'sys_mote_teal' : 'sys_mote'
      );
      mote.setOrigin(0.5, 0.5);
      mote.setAlpha(0.5 + Math.random() * 0.4);
      mote.setDepth(400);
      mote.setScrollFactor(0.3);

      this.tweens.add({
        targets: mote,
        y: mote.y - 30 - Math.random() * 30,
        alpha: 0,
        duration: 3000 + Math.random() * 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  private buildPlayer(): void {
    const p = this.isoToScreen(this.playerGrid.x, this.playerGrid.y);
    this.player = this.physics.add.sprite(p.x, p.y - 8, 'pf_d0');
    this.player.setOrigin(0.5, 0.85);
    this.player.setDepth(this.computeDepth(this.playerGrid.x, this.playerGrid.y, 10));
    this.player.stop();
  }

  private buildUI(): void {
    this.promptText = this.add
      .text(W / 2, H - 40, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#f9e2af',
        backgroundColor: 'rgba(17,17,27,0.85)',
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(600)
      .setVisible(false)
      .setScrollFactor(0);
  }

  private buildInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keySpace = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
  }

  // ============================== MOVEMENT =============================

  private isFree(gx: number, gy: number): boolean {
    const outX = Math.min(gx, -1) === gx || Math.max(gx, GRID_W) === gx;
    const outY = Math.min(gy, -1) === gy || Math.max(gy, GRID_H) === gy;
    if (outX || outY) return false;
    return !this.solids.some((s) => s.x === gx && s.y === gy);
  }

  private startMove(dx: number, dy: number, anim: string, flip: boolean): void {
    const self = this;
    const from = { x: this.playerGrid.x, y: this.playerGrid.y };
    const to = { x: from.x + dx, y: from.y + dy };
    if (!this.isFree(to.x, to.y)) return;

    this.moving = true;
    this.playerGrid = to;
    this.player.play(anim, true);
    this.player.setFlipX(flip);

    this.moveProxy.t = 0;
    this.tweens.add({
      targets: this.moveProxy,
      t: 1,
      duration: 180,
      ease: 'Linear',
      onUpdate: () => {
        const curX = Phaser.Math.Linear(from.x, to.x, this.moveProxy.t);
        const curY = Phaser.Math.Linear(from.y, to.y, this.moveProxy.t);
        const p = this.isoToScreen(curX, curY);
        this.player.setPosition(p.x, p.y - 8);
        this.player.setDepth(this.computeDepth(curX, curY, 10));
      },
      onComplete: () => {
        this.moving = false;
        if (
          !this.cursors.up.isDown && !this.cursors.down.isDown &&
          !this.cursors.left.isDown && !this.cursors.right.isDown &&
          !this.keyW.isDown && !this.keyS.isDown &&
          !this.keyA.isDown && !this.keyD.isDown
        ) {
          this.player.stop();
        }
      },
    });
  }

  override update(time: number, delta: number): void {
    // Dynamically update lights to follow player
    this.redrawLights();

    if (!this.moving) {
      if (this.cursors.up.isDown || this.keyW.isDown) this.startMove(0, -1, 'walk-up', false);
      else if (this.cursors.down.isDown || this.keyS.isDown) this.startMove(0, 1, 'walk-down', false);
      else if (this.cursors.left.isDown || this.keyA.isDown) this.startMove(-1, 0, 'walk-side', true);
      else if (this.cursors.right.isDown || this.keyD.isDown) this.startMove(1, 0, 'walk-side', false);
      else this.player.stop();
    }

    // Check for interactions
    this.nearTarget = null;
    let best = Infinity;
    for (const def of this.interactables) {
      const d = Phaser.Math.Distance.Between(this.playerGrid.x, this.playerGrid.y, def.gx, def.gy);
      const within = Math.sign(def.radius - d) === 1;
      const closer = Math.sign(best - d) === 1;
      if (within && closer) {
        best = d;
        this.nearTarget = def;
      }
    }

    if (this.nearTarget) {
      this.promptText.setText(this.nearTarget.prompt);
      this.promptText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE) || Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
        if (this.nearTarget.id === 'door_home') {
          this.cameras.main.fadeOut(500, 0, 0, 0);
          this.time.delayedCall(600, () => {
            this.scene.start('IsoHomeRoom');
          });
        }
      }
    } else {
      this.promptText.setVisible(false);
    }
  }

  // ============================== LIGHTING (lightmap + glow pools) =============================

  private buildLighting(): void {
    const self = this;

    if (this.textures.exists('lightmap')) {
      this.textures.remove('lightmap');
    }
    this.lightTex = this.textures.createCanvas('lightmap', 1200, 900)!;
    this.lightCtx = this.lightTex.context;
    this.add
      .image(600, 450, 'lightmap')
      .setBlendMode(Phaser.BlendModes.MULTIPLY)
      .setDepth(500);

    const pool = function (x: number, y: number, tint: number, scale: number, alpha: number): void {
      self.add
        .sprite(x, y, 'glow_radial')
        .setTint(tint)
        .setScale(scale)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.SCREEN)
        .setDepth(501);
    };

    pool(this.monolithLight.x, this.monolithLight.y, C_BLUE, 2.8, 0.40);
    pool(this.monolithLight.x, this.monolithLight.y, C_TEAL, 1.5, 0.30);

    for (const light of this.rackLights) {
      pool(light.x, light.y, light.tint, 1.6, 0.32);
    }

    this.redrawLights();
  }

  private punch(x: number, y: number, r: number, strength: number): void {
    const cx = this.lightCtx;
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    const gr = cx.createRadialGradient(x, y, r * 0.1, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,' + strength + ')');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr;
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fill();
    cx.restore();
  }

  private redrawLights(): void {
    const cx = this.lightCtx;
    cx.globalCompositeOperation = 'source-over';
    cx.fillStyle = 'rgb(122,122,152)';
    cx.fillRect(0, 0, 1200, 900);

    this.punch(this.monolithLight.x, this.monolithLight.y, 200, 0.85);

    for (const light of this.rackLights) {
      this.punch(light.x, light.y, 130, 0.75);
    }

    // Add a dynamic light around the player
    if (this.player) {
      this.punch(this.player.x, this.player.y - 8, 110, 0.32);
    }

    this.lightTex.refresh();
  }

  // ============================== HUD =============================

  private buildHUD(): void {
    this.add
      .text(12, 8, 'SYS://CORE  ·  /', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#89b4fa',
        backgroundColor: 'rgba(17, 17, 27, 0.85)',
        padding: { x: 6, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(600);

    this.add
      .text(W - 12, 8, 'STATUS: ONLINE  ·  UID:0', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#a6e3a1',
        backgroundColor: 'rgba(17, 17, 27, 0.85)',
        padding: { x: 6, y: 3 },
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(600);

    this.add
      .text(
        12,
        H - 100,
        [
          '┌─ /',
          '│  ├─ /bin',
          '│  ├─ /etc  ◀',
          '│  ├─ /var  ◀',
          '│  ├─ /usr  ◀',
          '│  ├─ /tmp',
          '│  ├─ /dev',
          '│  └─ /proc',
        ].join('\n'),
        {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#a6adc8',
          backgroundColor: 'rgba(17, 17, 27, 0.75)',
          padding: { x: 6, y: 4 },
          lineSpacing: 2,
        }
      )
      .setScrollFactor(0)
      .setDepth(600)
      .setAlpha(0.85);

    this.add
      .text(
        W - 12,
        H - 56,
        ['kernel 6.5.0-generic', 'arch x86_64', 'uptime 42:13:07'].join('\n'),
        {
          fontFamily: 'monospace',
          fontSize: '9px',
          color: '#89b4fa',
          backgroundColor: 'rgba(17, 17, 27, 0.75)',
          padding: { x: 6, y: 4 },
          lineSpacing: 2,
        }
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(600);
  }
}
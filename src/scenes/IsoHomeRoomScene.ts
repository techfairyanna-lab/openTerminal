import Phaser from 'phaser';

// ------------------------------------------------------------------
//  IsoHomeRoomScene — the "/home" directory, 2.5D isometric edition.
//  Clean 16-bit SNES style, flat colors, thick outlines.
// ------------------------------------------------------------------

const W = 800;
const H = 600;
const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 120;
const WALL_THICKNESS = 0.2;
const LOW_WALL_H = 14;
const DESK_H = 26;
const GRID_W = 9;
const GRID_H = 7;
const ORIGIN_X = W / 2;
const ORIGIN_Y = 170;

// Catppuccin-mocha palette
const C_BASE0 = 0x1e1e2e;
const C_BLUE = 0x89b4fa;
const C_PINK = 0xf5c2e7;
const C_MAUVE = 0xcba6f7;
const C_YELLOW = 0xf9e2af;
const C_PEACH = 0xfab387;

interface InteractableDef {
  id: string;
  gx: number;
  gy: number;
  radius: number;
  prompt: string;
  line: string;
}

interface SolidTile {
  x: number;
  y: number;
}

interface ExploredMap {
  computer: boolean;
  cabinet: boolean;
  trash: boolean;
  pictures: boolean;
}

type TargetCallback = { (target: string): void };
type DrawCallback = { (cx: CanvasRenderingContext2D): void };

type ExploreId = 'computer' | 'cabinet' | 'trash' | 'pictures';

const EXPLORE_IDS: ExploreId[] = ['computer', 'cabinet', 'trash', 'pictures'];

export class IsoHomeRoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;

  private playerGrid = { x: 3, y: 5 };
  private moving = false;
  private moveProxy = { t: 0 };
  private solids: SolidTile[] = [];

  private fairy!: Phaser.GameObjects.Sprite;
  private fairyWings!: Phaser.GameObjects.Sprite;
  private fairyGlow!: Phaser.GameObjects.Sprite;
  private fairyBase = { x: 0, y: 0 };
  private fairyGrid = { x: 5, y: 4 };

  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;
  private lampWorld = { x: 0, y: 0 };
  private crtWorld = { x: 0, y: 0 };

  private onInteract?: TargetCallback;

  private interactables: InteractableDef[] = [];
  private nearTarget: InteractableDef | null = null;
  private promptText!: Phaser.GameObjects.Text;
  private exploreText!: Phaser.GameObjects.Text;
  private lockUntil = 0;
  private explored: ExploredMap = {
    computer: false,
    cabinet: false,
    trash: false,
    pictures: false,
  };
  private doorUnlocked = false;
  private doorSprite!: Phaser.GameObjects.Sprite;

  // Kept to avoid breaking other internal references, but no longer locks movement
  private dlgActive = false; 
  private dlgFull = '';
  private dlgDone = true;
  private pendingUnlock = false;

  constructor() {
    super('IsoHomeRoom');
  }

  // ==================== ISO MATH ====================

  private isoToScreen(gx: number, gy: number): { x: number; y: number } {
    const screenX = (gx - gy) * (TILE_W / 2);
    const screenY = (gx + gy) * (TILE_H / 2);
    return { x: ORIGIN_X + screenX, y: ORIGIN_Y + screenY };
  }

  private computeDepth(gx: number, gy: number, spriteYOffset: number): number {
    return (gx + gy) * 10 + spriteYOffset;
  }

  private between(v: number, lo: number, hi: number): boolean {
    return Math.min(hi, Math.max(lo, v)) === v;
  }

  // ============================== CREATE ==============================

  create(): void {
    const self = this;
    this.onInteract = this.game.registry.get('onInteract') as TargetCallback | undefined;

    this.makeTextures();
    this.buildRoom();
    this.buildActors();
    this.buildLighting();
    this.buildUI();
    this.buildInput();

    this.cameras.main.fadeIn(600);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const speak = this.game.registry.get('onFayeSpeak') as ((text: string) => void) | undefined;
        if (speak) speak("Welcome to /home! Go to the computer and press [E] to open the terminal, then head to the root directory.");
      }
    });
  }

  // ============================= TEXTURES =============================

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
      cx.moveTo(dx, dy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = rightCol;
      cx.beginPath();
      cx.moveTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = topCol;
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.fill();

      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 2;
      
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.stroke();
      
      cx.beginPath();
      cx.moveTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.stroke();
      
      // FIX: Solid edges to prevent clipping
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

      cx.fillStyle = '#b56545';
      cx.beginPath();
      cx.moveTo(dx, dy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#9a5236';
      cx.beginPath();
      cx.moveTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#8b5a2b';
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.fill();

      const baseH = 12;
      cx.fillStyle = '#5c4033';
      cx.beginPath();
      cx.moveTo(dx, dy + height - baseH);
      cx.lineTo(cxp, cyp + height - baseH);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#4a332a';
      cx.beginPath();
      cx.moveTo(bx, byy + height - baseH);
      cx.lineTo(cxp, cyp + height - baseH);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      if (detail) detail(cx);

      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.stroke();
      
      cx.beginPath();
      cx.moveTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.stroke();

      cx.fillStyle = '#1e1e2e';
      cx.fillRect(0, dy - 1, 2, height + 2);
      cx.fillRect(cw - 2, byy - 1, 2, height + 2);
    });
  }

  private makeTextures(): void {
    const self = this;

    const floorTex = function (key: string, base: string, line: string): void {
      self.canvasTexture(key, TILE_W, TILE_H, function (cx) {
        cx.fillStyle = base;
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.fill();
        
        cx.strokeStyle = line;
        cx.lineWidth = 2;
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.stroke();
      });
    };
    floorTex('isofloora', '#5c4a3d', '#1e1e2e');
    floorTex('isofloorb', '#4f3f33', '#1e1e2e');

    this.canvasTexture('isorug', TILE_W, TILE_H, function (cx) {
      cx.fillStyle = '#8b2635';
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.fill();
      
      cx.fillStyle = '#c89b3c';
      self.diamondPath(cx, 32, 16, TILE_W - 16, TILE_H - 8);
      cx.fill();
      
      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 2;
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.stroke();
    });

    this.wallTexture('isowall_back', 1, WALL_THICKNESS, WALL_H);
    this.wallTexture('isowall_left', WALL_THICKNESS, 1, WALL_H);

    this.wallTexture('isodoorwall', 1, WALL_THICKNESS, WALL_H, function (cx) {
      cx.fillStyle = '#1e1e2e';
      cx.beginPath();
      cx.moveTo(4, 21);
      cx.lineTo(28, 33);
      cx.lineTo(28, 138);
      cx.lineTo(4, 126);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(6, 24);
      cx.lineTo(26, 34);
      cx.lineTo(26, 136);
      cx.lineTo(6, 126);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#4a392b';
      cx.beginPath();
      cx.moveTo(9, 42);
      cx.lineTo(23, 49);
      cx.lineTo(23, 74);
      cx.lineTo(9, 67);
      cx.closePath();
      cx.fill();

      cx.beginPath();
      cx.moveTo(9, 82);
      cx.lineTo(23, 89);
      cx.lineTo(23, 122);
      cx.lineTo(9, 115);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#f9e2af';
      cx.fillRect(21, 86, 3, 4);
      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 1;
      cx.strokeRect(21, 86, 3, 4);
    });

    this.wallTexture('isodooropen', 1, WALL_THICKNESS, WALL_H, function (cx) {
      cx.fillStyle = '#0b0b10';
      cx.beginPath();
      cx.moveTo(6, 24);
      cx.lineTo(26, 34);
      cx.lineTo(26, 136);
      cx.lineTo(6, 126);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#1e1e2e';
      cx.beginPath();
      cx.moveTo(25, 33);
      cx.lineTo(39, 27);
      cx.lineTo(39, 131);
      cx.lineTo(25, 137);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(26, 34);
      cx.lineTo(38, 28);
      cx.lineTo(38, 130);
      cx.lineTo(26, 136);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#4a392b';
      cx.beginPath();
      cx.moveTo(29, 52);
      cx.lineTo(35, 49);
      cx.lineTo(35, 82);
      cx.lineTo(29, 85);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#f9e2af';
      cx.fillRect(32, 84, 3, 4);
      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 1;
      cx.strokeRect(32, 84, 3, 4);
    });

    const picBack = function (key: string, frameCol: string, matteCol: string, art: DrawCallback): void {
      self.canvasTexture(key, 24, 26, function (cx) {
        cx.fillStyle = '#1e1e2e';
        cx.beginPath();
        cx.moveTo(0, 0);
        cx.lineTo(22, 10);
        cx.lineTo(22, 26);
        cx.lineTo(0, 16);
        cx.closePath();
        cx.fill();

        cx.fillStyle = frameCol;
        cx.beginPath();
        cx.moveTo(1, 1);
        cx.lineTo(21, 11);
        cx.lineTo(21, 25);
        cx.lineTo(1, 15);
        cx.closePath();
        cx.fill();

        cx.save();
        cx.beginPath();
        cx.moveTo(4, 5);
        cx.lineTo(18, 12);
        cx.lineTo(18, 21);
        cx.lineTo(4, 14);
        cx.closePath();
        cx.fillStyle = matteCol;
        cx.fill();
        cx.clip();

        if (art) art(cx);
        cx.restore();
      });
    };

    const windowLeftLarge = function (key: string, frameCol: string, glassCol: string): void {
      self.canvasTexture(key, 40, 56, function (cx) {
        cx.fillStyle = '#1e1e2e';
        cx.beginPath();
        cx.moveTo(39, 2);
        cx.lineTo(5, 19);
        cx.lineTo(5, 51);
        cx.lineTo(39, 34);
        cx.closePath();
        cx.fill();

        cx.fillStyle = frameCol;
        cx.beginPath();
        cx.moveTo(38, 4);
        cx.lineTo(6, 20);
        cx.lineTo(6, 48);
        cx.lineTo(38, 32);
        cx.closePath();
        cx.fill();

        cx.fillStyle = glassCol;
        cx.beginPath();
        cx.moveTo(36, 7);
        cx.lineTo(8, 21);
        cx.lineTo(8, 45);
        cx.lineTo(36, 31);
        cx.closePath();
        cx.fill();

        cx.strokeStyle = '#1e1e2e';
        cx.lineWidth = 4;
        cx.beginPath();
        cx.moveTo(22, 14); cx.lineTo(22, 38);
        cx.moveTo(6, 34); cx.lineTo(38, 18);
        cx.stroke();

        cx.strokeStyle = frameCol;
        cx.lineWidth = 2;
        cx.beginPath();
        cx.moveTo(22, 14); cx.lineTo(22, 38);
        cx.moveTo(6, 34); cx.lineTo(38, 18);
        cx.stroke();
      });
    };

    const sunsetArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#cba6f7'; cx.fillRect(0, 0, 24, 12);
      cx.fillStyle = '#fab387'; cx.fillRect(0, 12, 24, 14);
      cx.fillStyle = '#f9e2af'; cx.fillRect(9, 7, 6, 6);
      cx.fillStyle = '#89dceb'; cx.fillRect(0, 18, 24, 8);
      cx.fillStyle = '#f9e2af'; cx.fillRect(7, 19, 10, 2); cx.fillRect(6, 22, 12, 2);
    };

    const mountainArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#89b4fa'; cx.fillRect(0, 0, 24, 26);
      cx.fillStyle = '#f9e2af'; cx.fillRect(15, 5, 4, 4);
      cx.fillStyle = '#585b70';
      cx.beginPath(); cx.moveTo(2, 22); cx.lineTo(10, 7); cx.lineTo(18, 22); cx.closePath(); cx.fill();
      cx.fillStyle = '#f5e0dc'; cx.fillRect(8, 10, 4, 4);
      cx.fillStyle = '#a6e3a1'; cx.fillRect(0, 19, 24, 7);
    };

    const forestArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#94e2d5'; cx.fillRect(0, 0, 24, 18);
      cx.fillStyle = '#3b2f2b'; cx.fillRect(0, 18, 24, 8);
      cx.fillStyle = '#7c5c49'; cx.fillRect(10, 13, 4, 6);
      cx.fillStyle = '#40a02b';
      cx.beginPath(); cx.moveTo(12, 3); cx.lineTo(18, 14); cx.lineTo(6, 14); cx.closePath(); cx.fill();
      cx.fillStyle = '#a6e3a1'; cx.fillRect(9, 6, 6, 4);
    };

    const heartArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#313244'; cx.fillRect(0, 0, 24, 26);
      cx.fillStyle = '#f5c2e7';
      cx.fillRect(6, 9, 4, 4); cx.fillRect(12, 9, 4, 4);
      cx.fillRect(5, 11, 12, 4); cx.fillRect(7, 15, 8, 3);
      cx.fillRect(9, 18, 4, 2); cx.fillRect(10, 20, 2, 2);
    };

    const starArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#1e1e2e'; cx.fillRect(0, 0, 24, 26);
      cx.fillStyle = '#f9e2af';
      cx.fillRect(10, 4, 4, 4); cx.fillRect(8, 8, 8, 4);
      cx.fillRect(4, 10, 16, 3); cx.fillRect(8, 13, 8, 3);
      cx.fillRect(6, 16, 4, 3); cx.fillRect(14, 16, 4, 3);
    };

    picBack('iso_pic_sunset', '#7c5c49', '#1e1e2e', sunsetArt);
    picBack('iso_pic_mountain', '#585b70', '#1e1e2e', mountainArt);
    picBack('iso_pic_forest', '#45475a', '#1e1e2e', forestArt);
    picBack('iso_pic_heart', '#b4637a', '#1e1e2e', heartArt);
    picBack('iso_pic_star', '#313244', '#1e1e2e', starArt);

    windowLeftLarge('iso_window_warm_large', '#5a4636', '#f9e2af');
    windowLeftLarge('iso_window_cool_large', '#5a4636', '#89dceb');

    this.boxTexture('isodesk', 1, 2, DESK_H, '#8b5a2b', '#6d4c41', '#795548', function (cx) {
      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(48, 48); cx.lineTo(80, 32); cx.lineTo(80, 42); cx.lineTo(48, 58); cx.closePath(); cx.stroke();
      cx.fillStyle = '#f9e2af'; cx.fillRect(62, 44, 4, 4);
      cx.beginPath(); cx.moveTo(8, 42); cx.lineTo(24, 50); cx.lineTo(24, 60); cx.lineTo(8, 52); cx.closePath(); cx.stroke();
      cx.fillStyle = '#f9e2af'; cx.fillRect(14, 52, 4, 4);
    });

    this.canvasTexture('iso_crt', 44, 48, function (cx) {
      cx.fillStyle = '#585b70';
      cx.beginPath(); cx.moveTo(4, 9); cx.lineTo(22, 18); cx.lineTo(22, 44); cx.lineTo(4, 35); cx.closePath(); cx.fill();
      cx.fillStyle = '#45475a';
      cx.beginPath(); cx.moveTo(40, 9); cx.lineTo(22, 18); cx.lineTo(22, 44); cx.lineTo(40, 35); cx.closePath(); cx.fill();
      
      cx.fillStyle = '#1e1e2e';
      cx.beginPath(); cx.moveTo(37, 14); cx.lineTo(25, 20); cx.lineTo(25, 38); cx.lineTo(37, 32); cx.closePath(); cx.fill();
      
      cx.fillStyle = '#a6e3a1'; cx.fillRect(27, 22, 8, 2); cx.fillRect(27, 26, 6, 2);
      cx.fillStyle = '#89b4fa'; cx.fillRect(27, 30, 7, 2);
      
      cx.fillStyle = '#6c7086';
      self.diamondPath(cx, 22, 9, 36, 18); cx.fill();
      
      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(4, 9); cx.lineTo(22, 18); cx.lineTo(22, 44); cx.lineTo(4, 35); cx.closePath(); cx.stroke();
      cx.beginPath(); cx.moveTo(40, 9); cx.lineTo(22, 18); cx.lineTo(22, 44); cx.lineTo(40, 35); cx.closePath(); cx.stroke();
      self.diamondPath(cx, 22, 9, 36, 18); cx.stroke();
      cx.beginPath(); cx.moveTo(37, 14); cx.lineTo(25, 20); cx.lineTo(25, 38); cx.lineTo(37, 32); cx.closePath(); cx.stroke();
    });

    this.canvasTexture('iso_lamp', 24, 44, function (cx) {
      self.diamondPath(cx, 12, 38, 20, 10);
      cx.fillStyle = '#585b70'; cx.fill();
      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      self.diamondPath(cx, 12, 38, 20, 10); cx.stroke();
      
      cx.fillStyle = '#1e1e2e'; cx.fillRect(10, 16, 4, 22);
      
      cx.fillStyle = '#fab387';
      cx.beginPath(); cx.moveTo(4, 16); cx.lineTo(20, 16); cx.lineTo(12, 4); cx.closePath(); cx.fill();
      cx.strokeStyle = '#1e1e2e';
      cx.beginPath(); cx.moveTo(4, 16); cx.lineTo(20, 16); cx.lineTo(12, 4); cx.closePath(); cx.stroke();
      
      cx.fillStyle = '#f9e2af'; cx.fillRect(10, 16, 4, 4);
    });

    this.boxTexture('iso_docbox', 1, 1, 54, '#585b70', '#3a3c4e', '#45475a', function (cx) {
      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(0, 22); cx.lineTo(32, 38); cx.lineTo(64, 22); cx.stroke();

      cx.fillStyle = '#f9e2af';
      cx.beginPath(); cx.moveTo(8, 44); cx.lineTo(22, 51); cx.lineTo(22, 60); cx.lineTo(8, 53); cx.closePath(); cx.fill();
      cx.stroke();
      
      cx.fillStyle = '#f9e2af';
      cx.beginPath(); cx.moveTo(42, 51); cx.lineTo(56, 44); cx.lineTo(56, 53); cx.lineTo(42, 60); cx.closePath(); cx.fill();
      cx.stroke();
    });

    this.canvasTexture('iso_trash', 40, 34, function (cx) {
      cx.fillStyle = '#45475a';
      cx.beginPath(); cx.moveTo(0, 10); cx.lineTo(20, 20); cx.lineTo(20, 34); cx.lineTo(0, 24); cx.closePath(); cx.fill();
      cx.fillStyle = '#313244';
      cx.beginPath(); cx.moveTo(40, 10); cx.lineTo(20, 20); cx.lineTo(20, 34); cx.lineTo(40, 24); cx.closePath(); cx.fill();

      cx.fillStyle = '#585b70'; self.diamondPath(cx, 20, 10, 40, 20); cx.fill();
      cx.fillStyle = '#1e1e2e'; self.diamondPath(cx, 20, 10, 28, 14); cx.fill();

      cx.fillStyle = '#89b4fa';
      cx.fillRect(28, 17, 4, 8);
      cx.beginPath(); cx.moveTo(26, 25); cx.lineTo(34, 25); cx.lineTo(30, 30); cx.closePath(); cx.fill();

      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(0, 10); cx.lineTo(20, 20); cx.lineTo(20, 34); cx.lineTo(0, 24); cx.closePath(); cx.stroke();
      cx.beginPath(); cx.moveTo(40, 10); cx.lineTo(20, 20); cx.lineTo(20, 34); cx.lineTo(40, 24); cx.closePath(); cx.stroke();
      self.diamondPath(cx, 20, 10, 40, 20); cx.stroke();
    });

    this.canvasTexture('iso_chair', 64, 70, function (cx) {
      cx.fillStyle = '#6d4c41';
      cx.beginPath(); cx.moveTo(12, 38); cx.lineTo(32, 28); cx.lineTo(32, 10); cx.lineTo(12, 20); cx.closePath(); cx.fill();
      cx.fillStyle = '#1e1e2e';
      cx.fillRect(10, 38, 4, 14); cx.fillRect(50, 38, 4, 14); cx.fillRect(30, 48, 4, 14);

      self.diamondPath(cx, 32, 38, 40, 20); cx.fillStyle = '#8b5a2b'; cx.fill();
      self.diamondPath(cx, 32, 38, 26, 13); cx.fillStyle = '#fab387'; cx.fill();

      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(12, 38); cx.lineTo(32, 28); cx.lineTo(32, 10); cx.lineTo(12, 20); cx.closePath(); cx.stroke();
      self.diamondPath(cx, 32, 38, 40, 20); cx.stroke();
      self.diamondPath(cx, 32, 38, 26, 13); cx.stroke();
    });

    this.canvasTexture('glow_radial', 128, 128, function (cx) {
      const grad = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.35)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = grad;
      cx.fillRect(0, 0, 128, 128);
    });

    // Fae Wings (Scaled down to 75% to match her smaller body)
    this.canvasTexture('fairy_wings', 60, 40, function (cx) {
      cx.save();
      cx.translate(30, 20);
      cx.scale(0.75, 0.75);
      cx.translate(-30, -20);

      const drawWing = function (dir: number): void {
        const X = function (v: number): number { return dir === 1 ? v : 60 - v; };

        cx.fillStyle = '#313244';
        cx.beginPath();
        cx.moveTo(X(31), 18); cx.lineTo(X(40), 6); cx.lineTo(X(50), 3);
        cx.lineTo(X(48), 12); cx.lineTo(X(55), 15); cx.lineTo(X(47), 22); cx.lineTo(X(31), 24);
        cx.closePath(); cx.fill();
        
        cx.beginPath();
        cx.moveTo(X(31), 24); cx.lineTo(X(48), 24); cx.lineTo(X(44), 32);
        cx.lineTo(X(36), 37); cx.lineTo(X(31), 30);
        cx.closePath(); cx.fill();

        cx.fillStyle = '#22c8e6';
        cx.fillRect(X(38)-2, 10, 6, 3); cx.fillRect(X(42)-2, 16, 5, 3); cx.fillRect(X(38)-2, 24, 6, 3);

        cx.lineWidth = 2; cx.strokeStyle = '#f562a5';
        cx.beginPath();
        cx.moveTo(X(31), 18); cx.lineTo(X(40), 6); cx.lineTo(X(50), 3);
        cx.lineTo(X(48), 12); cx.lineTo(X(55), 15); cx.lineTo(X(47), 22); cx.lineTo(X(31), 24);
        cx.closePath(); cx.stroke();
        
        cx.beginPath();
        cx.moveTo(X(31), 24); cx.lineTo(X(48), 24); cx.lineTo(X(44), 32);
        cx.lineTo(X(36), 37); cx.lineTo(X(31), 30);
        cx.closePath(); cx.stroke();
      };

      drawWing(1); drawWing(-1);
      cx.restore();
    });

    // Fae Body (Scaled to 75%, bigger eyes)
    this.canvasTexture('fairy', 32, 40, function (cx) {
      const PINK = '#f562a5';
      const SKIN = '#e0955f';
      const WHITE = '#f5e0dc';
      
      cx.save();
      cx.translate(16, 20);
      cx.scale(0.75, 0.75);
      cx.translate(-16, -20);

      const drawShape = (path: () => void, fillColor: string) => {
        cx.fillStyle = '#1e1e2e';
        cx.strokeStyle = '#1e1e2e';
        cx.lineWidth = 2;
        cx.beginPath();
        path();
        cx.fill();
        cx.stroke();
        
        cx.fillStyle = fillColor;
        cx.beginPath();
        path();
        cx.fill();
      };

      // Wand
      cx.strokeStyle = '#1e1e2e'; cx.lineWidth = 3;
      cx.beginPath(); cx.moveTo(24, 25); cx.lineTo(28, 15); cx.stroke();
      cx.strokeStyle = '#c58f5a'; cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(24, 25); cx.lineTo(28, 15); cx.stroke();

      drawShape(() => {
        cx.moveTo(28, 8); cx.lineTo(30, 13); cx.lineTo(35, 15); cx.lineTo(30, 17);
        cx.lineTo(28, 22); cx.lineTo(26, 17); cx.lineTo(21, 15); cx.lineTo(26, 13);
        cx.closePath();
      }, PINK);

      drawShape(() => { cx.arc(9, 7, 4, 0, Math.PI * 2); cx.arc(23, 7, 4, 0, Math.PI * 2); }, PINK);
      drawShape(() => { cx.arc(16, 13, 6, 0, Math.PI * 2); }, SKIN);
      drawShape(() => { cx.arc(16, 11, 6.5, Math.PI, 0); cx.rect(10, 10, 12, 3); }, PINK);

      // BIGGER EYES
      cx.fillStyle = '#1e1e2e';
      cx.fillRect(11, 12, 3, 4); cx.fillRect(18, 12, 3, 4);
      cx.fillStyle = '#ffffff';
      cx.fillRect(11, 12, 1, 1); cx.fillRect(18, 12, 1, 1);
      cx.fillStyle = '#f38ba8';
      cx.fillRect(10, 17, 3, 1); cx.fillRect(19, 17, 3, 1);
      cx.fillStyle = '#8c2f3f';
      cx.fillRect(15, 18, 2, 1);

      drawShape(() => { cx.moveTo(12, 20); cx.lineTo(8, 24); cx.lineTo(10, 26); cx.lineTo(14, 22); cx.closePath(); }, SKIN);
      drawShape(() => { cx.moveTo(20, 20); cx.lineTo(24, 24); cx.lineTo(22, 26); cx.lineTo(18, 22); cx.closePath(); }, SKIN);

      drawShape(() => {
        cx.moveTo(12, 20); cx.lineTo(20, 20); cx.lineTo(22, 28);
        cx.lineTo(26, 36); cx.lineTo(6, 36); cx.lineTo(10, 28);
        cx.closePath();
      }, WHITE);
      
      cx.fillStyle = PINK; cx.fillRect(12, 26, 8, 2);
      cx.strokeStyle = '#d84f9b'; cx.lineWidth = 1;
      cx.beginPath(); cx.moveTo(14, 28); cx.lineTo(12, 35); cx.moveTo(18, 28); cx.lineTo(20, 35); cx.stroke();

      cx.restore();
    });

    // Player Sprites (Proportional 1:1:1 body segments, eyes added)
    const HAIR = '#7c5c49';
    const SKIN = '#ffd9b3';
    const HOOD = '#89b4fa';
    const PANT = '#313244';
    const SHOE = '#f5e0dc';
    const EYE = '#1e1e2e';
    
    const playerFrame = function (key: string, dir: 'd' | 'u' | 's', f: number): void {
      if (self.textures.exists(key)) return;
      const ct = self.textures.createCanvas(key, 24, 32);
      if (!ct) return;
      const cx = ct.context;
      
      const drawBlock = (x: number, y: number, w: number, h: number, color: string) => {
        cx.fillStyle = '#1e1e2e'; cx.fillRect(x-1, y-1, w+2, h+2);
        cx.fillStyle = color; cx.fillRect(x, y, w, h);
      };
      
      if (dir === 'd') {
        // Head & Hair
        drawBlock(5, 2, 14, 8, HAIR);
        drawBlock(7, 4, 10, 8, SKIN);
        drawBlock(6, 2, 12, 3, HAIR);
        drawBlock(5, 4, 2, 5, HAIR);
        drawBlock(17, 4, 2, 5, HAIR);
        
        // Eyes
        drawBlock(8, 8, 2, 3, '#ffffff');
        drawBlock(14, 8, 2, 3, '#ffffff');
        cx.fillStyle = EYE; 
        cx.fillRect(9, 9, 2, 2);
        cx.fillRect(14, 9, 2, 2);
        
        // Body
        drawBlock(6, 12, 12, 9, HOOD);
        drawBlock(4, 13, 2, 7, HOOD);
        drawBlock(18, 13, 2, 7, HOOD);
        drawBlock(4, 20, 2, 2, SKIN);
        drawBlock(18, 20, 2, 2, SKIN);
        
        // Legs
        if (f === 0) {
          drawBlock(7, 21, 4, 5, PANT); drawBlock(13, 21, 4, 5, PANT);
          drawBlock(6, 26, 5, 3, SHOE); drawBlock(13, 26, 5, 3, SHOE);
        } else {
          drawBlock(7, 21, 4, 3, PANT); drawBlock(6, 24, 5, 3, SHOE);
          drawBlock(13, 21, 4, 5, PANT); drawBlock(13, 26, 5, 3, SHOE);
        }
      } else if (dir === 'u') {
        // Head & Hair
        drawBlock(5, 2, 14, 10, HAIR);
        
        // Body
        drawBlock(6, 12, 12, 9, HOOD);
        drawBlock(4, 13, 2, 7, HOOD);
        drawBlock(18, 13, 2, 7, HOOD);
        drawBlock(4, 20, 2, 2, SKIN);
        drawBlock(18, 20, 2, 2, SKIN);
        
        // Legs
        if (f === 0) {
          drawBlock(7, 21, 4, 5, PANT); drawBlock(13, 21, 4, 5, PANT);
          drawBlock(6, 26, 5, 3, SHOE); drawBlock(13, 26, 5, 3, SHOE);
        } else {
          drawBlock(7, 21, 4, 3, PANT); drawBlock(6, 24, 5, 3, SHOE);
          drawBlock(13, 21, 4, 5, PANT); drawBlock(13, 26, 5, 3, SHOE);
        }
      } else {
        // Head & Hair
        drawBlock(7, 2, 11, 10, HAIR);
        drawBlock(12, 4, 6, 8, SKIN);
        drawBlock(11, 2, 7, 3, HAIR);
        drawBlock(7, 4, 2, 6, HAIR);
        
        // Eye (Side profile)
        drawBlock(14, 8, 3, 3, '#ffffff');
        cx.fillStyle = EYE; 
        cx.fillRect(15, 9, 2, 2);
        
        // Body
        drawBlock(8, 12, 9, 9, HOOD);
        drawBlock(10, 13, 4, 7, HOOD);
        drawBlock(10, 20, 4, 2, SKIN);
        
        // Legs
        if (f === 0) {
          drawBlock(8, 21, 4, 5, PANT); drawBlock(12, 21, 4, 5, PANT);
          drawBlock(7, 26, 5, 3, SHOE); drawBlock(12, 26, 5, 3, SHOE);
        } else {
          drawBlock(8, 21, 4, 3, PANT); drawBlock(7, 24, 5, 3, SHOE);
          drawBlock(12, 21, 4, 5, PANT); drawBlock(12, 26, 5, 3, SHOE);
        }
      }
      ct.refresh();
    };

    playerFrame('pf_d0', 'd', 0); playerFrame('pf_d1', 'd', 1);
    playerFrame('pf_u0', 'u', 0); playerFrame('pf_u1', 'u', 1);
    playerFrame('pf_s0', 's', 0); playerFrame('pf_s1', 's', 1);

    if (!this.anims.exists('walk-down')) {
      this.anims.create({ key: 'walk-down', frames: [{ key: 'pf_d0' }, { key: 'pf_d1' }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: 'walk-up', frames: [{ key: 'pf_u0' }, { key: 'pf_u1' }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: 'walk-side', frames: [{ key: 'pf_s0' }, { key: 'pf_s1' }], frameRate: 6, repeat: -1 });
    }
  }

  // ============================== ROOM ==============================

  private addBoxSprite(
    key: string,
    bx: number,
    by: number,
    fw: number,
    fh: number,
    offsetY = 0,
    height: number = WALL_H
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

  private buildRoom(): void {
    this.solids = [];

    for (let gx = 0; gx !== GRID_W; gx++) {
      for (let gy = 0; gy !== GRID_H; gy++) {
        const tileKey = (gx + gy) % 2 === 0 ? 'isofloora' : 'isofloorb';
        this.addIsoSprite(tileKey, gx, gy, 0, 0.5);
        if (this.between(gx, 2, 4) && this.between(gy, 2, 4)) {
          this.addIsoSprite('isorug', gx, gy, 1, 0.5);
        }
      }
    }

    for (let gx = 0; gx !== GRID_W; gx++) {
      if (gx === 7) {
        this.doorSprite = this.addBoxSprite('isodoorwall', 7, 0, 1, WALL_THICKNESS, 0, WALL_H);
        this.solids.push({ x: 7, y: 0 });
      } else {
        this.addBoxSprite('isowall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      }
    }

    for (let gy = 0; gy !== GRID_H; gy++) {
      this.addBoxSprite('isowall_left', 0, gy, WALL_THICKNESS, 1, -2, WALL_H);
    }

    const pic1 = this.addIsoSprite('iso_pic_sunset', 1, 0, 0, 1);
    pic1.x += 16; pic1.y -= 74;

    const pic2 = this.addIsoSprite('iso_pic_mountain', 2, 0, 0, 1);
    pic2.x += 16; pic2.y -= 82;

    const pic3 = this.addIsoSprite('iso_pic_forest', 3, 0, 0, 1);
    pic3.x += 16; pic3.y -= 70;

    const pic4 = this.addIsoSprite('iso_pic_heart', 4, 0, 0, 1);
    pic4.x += 16; pic4.y -= 84;

    const pic5 = this.addIsoSprite('iso_pic_star', 5, 0, 0, 1);
    pic5.x += 16; pic5.y -= 72;

    const window1 = this.addIsoSprite('iso_window_warm_large', 0, 2, 0, 48 / 56);
    window1.x -= 16; window1.y -= 66;

    const window2 = this.addIsoSprite('iso_window_cool_large', 0, 5, 0, 48 / 56);
    window2.x -= 16; window2.y -= 66;

    this.addBoxSprite('isodesk', 6, 2, 1, 2, 6, DESK_H);
    this.solids.push({ x: 6, y: 2 });
    this.solids.push({ x: 6, y: 3 });

    const crtPt = this.isoToScreen(6, 2.5);
    this.crtWorld = { x: crtPt.x - 6, y: crtPt.y - DESK_H - 14 };
    this.add
      .sprite(crtPt.x, crtPt.y - DESK_H, 'iso_crt')
      .setOrigin(0.5, 44 / 48)
      .setDepth(this.computeDepth(6, 2.5, 9));

    const binPt = this.isoToScreen(0, 4);
    this.add
      .sprite(binPt.x, binPt.y, 'iso_trash')
      .setOrigin(0.5, 1)
      .setDepth(this.computeDepth(0, 4, 0));
    this.solids.push({ x: 0, y: 4 });

    const lampPt = this.isoToScreen(8, 0);
    this.lampWorld = { x: lampPt.x, y: lampPt.y - 24 };
    this.add
      .sprite(lampPt.x, lampPt.y, 'iso_lamp')
      .setOrigin(0.5, 40 / 44)
      .setDepth(this.computeDepth(8, 0, 1));
    this.solids.push({ x: 8, y: 0 });

    const docsPt = this.isoToScreen(0, 3);
    this.add
      .sprite(docsPt.x, docsPt.y, 'iso_docbox')
      .setOrigin(0.5, 70 / 86)
      .setDepth(this.computeDepth(0, 3, 0));
    this.solids.push({ x: 0, y: 3 });

    const chairPt = this.isoToScreen(7, 2);
    this.add
      .sprite(chairPt.x, chairPt.y, 'iso_chair')
      .setOrigin(0.5, 52 / 70)
      .setFlipX(true)
      .setDepth(this.computeDepth(7, 2, 6));
    this.solids.push({ x: 7, y: 2 });

    this.interactables = [
      { id: 'computer', gx: 6, gy: 2.5, radius: 1.4, prompt: '[E] Log in to terminal', line: 'Logging you in! The terminal is your window to the whole system.' },
      { id: 'door', gx: 7, gy: 0.6, radius: 1.2, prompt: '[E] Try the root door', line: 'That door leads to / — the root directory. The whole filesystem is out there!' },
      { id: 'cabinet', gx: 0, gy: 3, radius: 1.2, prompt: '[E] Open Documents/', line: "That's Documents/. Everything you've ever saved is filed neatly in there." },
      { id: 'trash', gx: 0, gy: 4, radius: 1.45, prompt: '[E] Check Downloads/', line: 'Downloads/! Fresh stuff from the internet lands in that bin. Careful what you run.' },
      { id: 'pictures', gx: 2.5, gy: 1, radius: 1.35, prompt: '[E] Browse Pictures/', line: 'Pictures/! Memories, rendered in glorious 24-bit color.' },
    ];
  }

  private buildActors(): void {
    const p = this.isoToScreen(this.playerGrid.x, this.playerGrid.y);
    this.player = this.physics.add.sprite(p.x, p.y, 'pf_d0');
    this.player.setOrigin(0.5, 0.8);
    this.player.setDepth(this.computeDepth(this.playerGrid.x, this.playerGrid.y, 10));

    const fPt = this.isoToScreen(this.fairyGrid.x, this.fairyGrid.y);
    this.fairyBase = fPt;
    this.fairyWings = this.add.sprite(fPt.x, fPt.y - 22, 'fairy_wings').setOrigin(0.5, 0.5);
    this.fairy = this.add.sprite(fPt.x, fPt.y - 22, 'fairy').setOrigin(0.5, 0.5);
    this.fairyGlow = this.add
      .sprite(fPt.x, fPt.y - 22, 'glow_radial')
      .setTint(C_PINK)
      .setScale(1.4)
      .setAlpha(0.35)
      .setBlendMode(Phaser.BlendModes.SCREEN)
      .setDepth(this.computeDepth(this.fairyGrid.x, this.fairyGrid.y, 5));

    this.tweens.add({ targets: this.fairy, y: fPt.y - 30, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.fairy, x: fPt.x + 8, duration: 2600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this.fairyWings, alpha: 0.55, duration: 320, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }

  // =========================== LIGHTING ===========================

  private buildLighting(): void {
    const self = this;
    if (this.textures.exists('lightmap')) {
      this.textures.remove('lightmap');
    }
    this.lightTex = this.textures.createCanvas('lightmap', W, H)!;
    this.lightCtx = this.lightTex.context;
    this.add.image(W / 2, H / 2, 'lightmap').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(500);

    const pool = function (x: number, y: number, tint: number, scale: number, alpha: number): void {
      self.add
        .sprite(x, y, 'glow_radial')
        .setTint(tint)
        .setScale(scale)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.SCREEN)
        .setDepth(501);
    };
    pool(this.lampWorld.x, this.lampWorld.y, C_YELLOW, 2.8, 0.35);
    pool(this.crtWorld.x, this.crtWorld.y, C_BLUE, 1.8, 0.28);
    pool(this.fairyBase.x, this.fairyBase.y, C_PINK, 1.0, 0.3);
    const doorPt = this.isoToScreen(7, 0);
    pool(doorPt.x, doorPt.y - 40, C_PEACH, 1.1, 0.16);

    const win1Pt = this.isoToScreen(0, 2);
    pool(win1Pt.x - 18, win1Pt.y - 88, C_YELLOW, 1.7, 0.16);
    pool(win1Pt.x + 26, win1Pt.y + 2, C_YELLOW, 1.2, 0.10);

    const win2Pt = this.isoToScreen(0, 5);
    pool(win2Pt.x - 18, win2Pt.y - 88, C_BLUE, 1.6, 0.14);
    pool(win2Pt.x + 26, win2Pt.y + 2, C_BLUE, 1.1, 0.08);
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
    cx.fillRect(0, 0, W, H);
    this.punch(this.lampWorld.x, this.lampWorld.y, 200, 0.9);
    this.punch(this.crtWorld.x, this.crtWorld.y, 130, 0.7);
    this.punch(this.fairy.x, this.fairy.y, 90, 0.5);
    this.punch(this.player.x, this.player.y - 8, 110, 0.32);

    const win1Pt = this.isoToScreen(0, 2);
    this.punch(win1Pt.x - 12, win1Pt.y - 72, 150, 0.35);

    const win2Pt = this.isoToScreen(0, 5);
    this.punch(win2Pt.x - 12, win2Pt.y - 72, 140, 0.30);

    this.lightTex.refresh();
  }

  // ============================== UI ==============================

  private buildUI(): void {
    this.promptText = this.add
      .text(400, 300, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#f9e2af',
        backgroundColor: 'rgba(17,17,27,0.85)',
        padding: { x: 6, y: 4 },
      })
      .setOrigin(0.5)
      .setDepth(600)
      .setVisible(false);
    this.tweens.add({ targets: this.promptText, y: '-=3', duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add
      .text(12, 10, 'WASD / arrows hop the grid · E interact', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setDepth(600)
      .setAlpha(0.8);

    this.exploreText = this.add
      .text(W - 12, 10, 'explored 0/4', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setOrigin(1, 0)
      .setDepth(600)
      .setAlpha(0.9);
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

  // =========================== DIALOGUE ===========================

  private openDialogue(line: string): void {
    // Modified to NOT lock player movement
    this.dlgFull = line;
    this.dlgDone = true;
    this.promptText.setVisible(false);

    const speak = this.game.registry.get('onFayeSpeak') as ((text: string) => void) | undefined;
    if (speak) speak(line);
  }

  private advanceDialogue(): void {
    this.lockUntil = this.time.now + 250;
    if (this.pendingUnlock) {
      this.pendingUnlock = false;
      this.openDialogue("You're ready. The door to / is unlocked!");
    }
  }

  // ======================== EXPLORATION LOGIC ========================

  private exploredCount(): number {
    const self = this;
    return EXPLORE_IDS.filter(function (id) {
      return self.explored[id];
    }).length;
  }

  private markExplored(id: ExploreId): void {
    if (this.explored[id]) return;
    this.explored[id] = true;
    const n = this.exploredCount();
    const allDone = Math.min(n, EXPLORE_IDS.length) === EXPLORE_IDS.length;
    if (allDone && !this.doorUnlocked) {
      this.doorUnlocked = true;
      this.pendingUnlock = true;
      this.doorSprite.setTexture('isodooropen');
      this.exploreText.setText('explored 4/4 — door unlocked!');
      this.exploreText.setColor('#a6e3a1');
      this.openDialogue("You're ready. The door to / is unlocked!"); // Fire message without locking
    } else {
      this.exploreText.setText('explored ' + n + '/4');
    }
  }

  private lineFor(target: InteractableDef): string {
    if (target.id === 'door') {
      if (!this.doorUnlocked) {
        return "Go open the terminal and type 'cd root' to head to the root directory!";
      }
      return 'That door leads to / — the root directory. The whole filesystem is out there!';
    }
    const eid = target.id as ExploreId;
    this.markExplored(eid);
    return target.line;
  }

  // ========================= GRID MOVEMENT =========================

  private isFree(gx: number, gy: number): boolean {
    const outX = Math.min(gx, -1) === gx || Math.max(gx, GRID_W) === gx;
    const outY = Math.min(gy, -1) === gy || Math.max(gy, GRID_H) === gy;
    if (outX || outY) return false;
    return !this.solids.some(function (s) {
      return s.x === gx && s.y === gy;
    });
  }

  private startMove(dx: number, dy: number, anim: string, flip: boolean): void {
    const self = this;
    const from = { x: this.playerGrid.x, y: this.playerGrid.y };
    const to = { x: from.x + dx, y: from.y + dy };
    if (!this.isFree(to.x, to.y)) return;
    this.moving = true;
    this.moveProxy.t = 0;
    this.player.setFlipX(flip);
    this.player.play(anim, true);
    this.tweens.add({
      targets: this.moveProxy,
      t: 1,
      duration: 170,
      ease: 'Sine.easeInOut',
      onUpdate: function () {
        const fx = Phaser.Math.Linear(from.x, to.x, self.moveProxy.t);
        const fy = Phaser.Math.Linear(from.y, to.y, self.moveProxy.t);
        const p = self.isoToScreen(fx, fy);
        self.player.x = p.x;
        self.player.y = p.y;
        self.player.setDepth(self.computeDepth(fx, fy, 5));
      },
      onComplete: function () {
        self.playerGrid.x = to.x;
        self.playerGrid.y = to.y;
        self.moving = false;
      },
    });
  }

  // ============================ UPDATE ============================

  update(time: number, delta: number): void {
    this.redrawLights();

    this.fairyWings.setPosition(this.fairy.x, this.fairy.y);
    this.fairyGlow.setPosition(this.fairy.x, this.fairy.y);
    this.fairy.setDepth(this.computeDepth(this.fairyGrid.x, this.fairyGrid.y, 6));
    this.fairyWings.setDepth(this.computeDepth(this.fairyGrid.x, this.fairyGrid.y, 5));

    // Removed the if(this.dlgActive) block so player can walk while dialogue is active

    if (!this.moving) {
      if (this.cursors.up.isDown || this.keyW.isDown) this.startMove(0, -1, 'walk-up', false);
      else if (this.cursors.down.isDown || this.keyS.isDown) this.startMove(0, 1, 'walk-down', false);
      else if (this.cursors.left.isDown || this.keyA.isDown) this.startMove(-1, 0, 'walk-side', true);
      else if (this.cursors.right.isDown || this.keyD.isDown) this.startMove(1, 0, 'walk-side', false);
      else this.player.stop();
    }

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
      const p = this.isoToScreen(this.playerGrid.x, this.playerGrid.y);
      this.promptText.setPosition(p.x, p.y - 50);
      this.promptText.setVisible(true);
      const unlocked = Math.sign(time - this.lockUntil) === 1;
      if (Phaser.Input.Keyboard.JustDown(this.keyE) && unlocked) {
        const target = this.nearTarget;
        this.openDialogue(this.lineFor(target));
        if (target.id === 'computer') {
          this.onInteract?.('computer');
        }
      }
    } else {
      this.promptText.setVisible(false);
    }
  }
}
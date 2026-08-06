import Phaser from 'phaser';

// ------------------------------------------------------------------
//  IsoHomeRoomScene — the "/home" directory, 2.5D isometric edition.
//  Small enclosed cozy room: four walls, closed root door on the
//  back wall, terminal + downloads sitting on the table, corner
//  lamp, tall Documents/ box, no floating labels, and an
//  exploration-gated root door.
//  NOTE: written without angle-bracket characters so it survives
//  copy/paste pipelines that eat them.
// ------------------------------------------------------------------

const W = 800;
const H = 600;
const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 120; // Taller walls for a cozier, more enclosed room feel
const WALL_THICKNESS = 0.2; // Slimmer walls to look like real drywall
const LOW_WALL_H = 14;
const DESK_H = 26;
// decreased walking space: tiny 9x7 room, walls on all four sides
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

// call-signature types (no arrow syntax needed)
type TargetCallback = { (target: string): void };
type DrawCallback = { (cx: CanvasRenderingContext2D): void };

type ExploreId = 'computer' | 'cabinet' | 'trash' | 'pictures';

const EXPLORE_IDS: ExploreId[] = ['computer', 'cabinet', 'trash', 'pictures'];

export class IsoHomeRoomScene extends Phaser.Scene {
  // player + input
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;

  // grid movement
  private playerGrid = { x: 3, y: 5 };
  private moving = false;
  private moveProxy = { t: 0 };
  private solids: SolidTile[] = [];

  // actors
  private fairy!: Phaser.GameObjects.Sprite;
  private fairyWings!: Phaser.GameObjects.Sprite;
  private fairyGlow!: Phaser.GameObjects.Sprite;
  private fairyBase = { x: 0, y: 0 };
  private fairyGrid = { x: 5, y: 4 };

  // lighting
  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;
  private lampWorld = { x: 0, y: 0 };
  private crtWorld = { x: 0, y: 0 };

  // react bridge
  private onInteract?: TargetCallback;

  // interaction + exploration state
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
  private pendingUnlock = false;
  private doorSprite!: Phaser.GameObjects.Sprite;

  // dialogue
  private dlgBox!: Phaser.GameObjects.Rectangle;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgText!: Phaser.GameObjects.Text;
  private dlgArrow!: Phaser.GameObjects.Text;
  private dlgActive = false;
  private dlgFull = '';
  private dlgShown = 0;
  private dlgAcc = 0;
  private dlgDone = false;

  constructor() {
    super('IsoHomeRoom');
  }

  // ==================== ISO MATH (manual, no plugin) ====================

  private isoToScreen(gx: number, gy: number): { x: number; y: number } {
    const screenX = (gx - gy) * (TILE_W / 2);
    const screenY = (gx + gy) * (TILE_H / 2);
    return { x: ORIGIN_X + screenX, y: ORIGIN_Y + screenY };
  }

  private computeDepth(gx: number, gy: number, spriteYOffset: number): number {
    return (gx + gy) * 10 + spriteYOffset;
  }

  // inclusive integer range check without relational operators
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
      delay: 900,
      callback: function () {
        self.openDialogue(
          'Welcome to /home! Explore everything: your Documents, Downloads, Pictures and Terminal. Then the root door will open.'
        );
      },
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

      cx.strokeStyle = 'rgba(17,17,27,0.6)';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.stroke();
      cx.beginPath();
      cx.moveTo(dx, dy);
      cx.lineTo(dx, dy + height);
      cx.moveTo(bx, byy);
      cx.lineTo(bx, byy + height);
      cx.moveTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.stroke();

      if (detail) detail(cx);
    });
  }

  // Dedicated method for drawing warm wallpaper, baseboards, and subtle stripes
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

      // Left face (warm terracotta wallpaper)
      cx.fillStyle = '#e29578';
      cx.beginPath();
      cx.moveTo(dx, dy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      // Right face (same color to make wallpaper uniform across corners)
      cx.fillStyle = '#e29578';
      cx.beginPath();
      cx.moveTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      // Top face (warm wood trim)
      cx.fillStyle = '#d4a373';
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.fill();

      // Baseboards
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

      // Wallpaper subtle vertical stripes
      cx.strokeStyle = 'rgba(255, 235, 205, 0.25)';
      cx.lineWidth = 2;
      for (let i = 1; i !== 10; i++) {
        const t = i / 10;
        const x1 = dx + (cxp - dx) * t;
        const y1 = dy + (cyp - dy) * t;
        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x1, y1 + height - baseH);
        cx.stroke();
      }
      for (let i = 1; i !== 10; i++) {
        const t = i / 10;
        const x1 = cxp + (bx - cxp) * t;
        const y1 = cyp + (byy - cyp) * t;
        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x1, y1 + height - baseH);
        cx.stroke();
      }

      if (detail) detail(cx);

      // Outlines
      cx.strokeStyle = 'rgba(17,17,27,0.5)';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.stroke();
      cx.beginPath();
      cx.moveTo(dx, dy);
      cx.lineTo(dx, dy + height);
      cx.moveTo(bx, byy);
      cx.lineTo(bx, byy + height);
      cx.moveTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.stroke();
    });
  }

  private makeTextures(): void {
    const self = this;

    const P = function (
      cx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      c: string
    ): void {
      cx.fillStyle = c;
      cx.fillRect(x, y, w, h);
    };

    const floorTex = function (key: string, base: string): void {
      self.canvasTexture(key, TILE_W, TILE_H, function (cx) {
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.fillStyle = base;
        cx.fill();
        cx.save();
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.clip();
        cx.strokeStyle = '#2a211f';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(16, 8);
        cx.lineTo(48, 24);
        cx.moveTo(16, 24);
        cx.lineTo(48, 8);
        cx.stroke();
        cx.fillStyle = '#4a3b36';
        cx.fillRect(24, 12, 3, 1);
        cx.fillRect(40, 18, 3, 1);
        cx.fillRect(30, 20, 2, 1);
        cx.restore();
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.strokeStyle = 'rgba(17,17,27,0.7)';
        cx.stroke();
      });
    };
    floorTex('isofloora', '#3b2f2b');
    floorTex('isofloorb', '#40342e');

    this.canvasTexture('isorug', TILE_W, TILE_H, function (cx) {
      self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
      cx.fillStyle = '#2b2640';
      cx.fill();
      self.diamondPath(cx, 32, 16, TILE_W - 16, TILE_H - 8);
      cx.strokeStyle = '#585090';
      cx.lineWidth = 2;
      cx.stroke();
      self.diamondPath(cx, 32, 16, 12, 6);
      cx.fillStyle = '#45407a';
      cx.fill();
    });

    // Slim, tall, warm wallpaper walls
    this.wallTexture('isowall_back', 1, WALL_THICKNESS, WALL_H);
    this.wallTexture('isowall_left', WALL_THICKNESS, 1, WALL_H);

    // CLOSED wooden door on the back wall (root exit), extended all the way to the ground
    this.wallTexture('isodoorwall', 1, WALL_THICKNESS, WALL_H, function (cx) {
      // door frame
      cx.fillStyle = '#3b2f2b';
      cx.beginPath();
      cx.moveTo(5, 22);
      cx.lineTo(27, 33);
      cx.lineTo(27, 137);
      cx.lineTo(5, 126);
      cx.closePath();
      cx.fill();

      // door body
      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(6, 24);
      cx.lineTo(26, 34);
      cx.lineTo(26, 136);
      cx.lineTo(6, 126);
      cx.closePath();
      cx.fill();

      // door panels
      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 1;

      cx.beginPath();
      cx.moveTo(9, 42);
      cx.lineTo(23, 49);
      cx.lineTo(23, 74);
      cx.lineTo(9, 67);
      cx.closePath();
      cx.stroke();

      cx.beginPath();
      cx.moveTo(9, 82);
      cx.lineTo(23, 89);
      cx.lineTo(23, 122);
      cx.lineTo(9, 115);
      cx.closePath();
      cx.stroke();

      // knob
      cx.fillStyle = '#f9e2af';
      cx.fillRect(22, 86, 2, 3);
    });

    // OPEN door: dark opening + swung slab, also down to the ground
    this.wallTexture('isodooropen', 1, WALL_THICKNESS, WALL_H, function (cx) {
      // dark opening
      cx.fillStyle = '#0b0b10';
      cx.beginPath();
      cx.moveTo(6, 24);
      cx.lineTo(26, 34);
      cx.lineTo(26, 136);
      cx.lineTo(6, 126);
      cx.closePath();
      cx.fill();

      // faint warm light spilling out
      cx.fillStyle = 'rgba(249,226,175,0.14)';
      cx.beginPath();
      cx.moveTo(9, 42);
      cx.lineTo(23, 49);
      cx.lineTo(23, 122);
      cx.lineTo(9, 115);
      cx.closePath();
      cx.fill();

      // swung door slab
      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(26, 34);
      cx.lineTo(38, 28);
      cx.lineTo(38, 130);
      cx.lineTo(26, 136);
      cx.closePath();
      cx.fill();

      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 1;
      cx.stroke();

      // panel on swung door
      cx.beginPath();
      cx.moveTo(29, 52);
      cx.lineTo(35, 49);
      cx.lineTo(35, 82);
      cx.lineTo(29, 85);
      cx.closePath();
      cx.stroke();

      // knob
      cx.fillStyle = '#f9e2af';
      cx.fillRect(33, 84, 2, 3);
    });

    // ---------------------------------------------------------------
    // Picture helpers: back-wall pictures slope one way.
    // ---------------------------------------------------------------

    const picBack = function (key: string, frameCol: string, matteCol: string, art: DrawCallback): void {
      self.canvasTexture(key, 24, 26, function (cx) {
        // frame
        cx.fillStyle = frameCol;
        cx.beginPath();
        cx.moveTo(1, 1);
        cx.lineTo(21, 11);
        cx.lineTo(21, 25);
        cx.lineTo(1, 15);
        cx.closePath();
        cx.fill();

        // picture area
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

        // frame outline
        cx.strokeStyle = 'rgba(17,17,27,0.5)';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(1, 1);
        cx.lineTo(21, 11);
        cx.lineTo(21, 25);
        cx.lineTo(1, 15);
        cx.closePath();
        cx.stroke();
      });
    };

    // Larger window helper for the left wall, with light rays in the glass
    const windowLeftLarge = function (key: string, frameCol: string, glassTop: string, glassBottom: string): void {
      self.canvasTexture(key, 40, 56, function (cx) {
        // outer frame
        cx.fillStyle = frameCol;
        cx.beginPath();
        cx.moveTo(38, 4);
        cx.lineTo(6, 20);
        cx.lineTo(6, 48);
        cx.lineTo(38, 32);
        cx.closePath();
        cx.fill();

        // glass
        cx.save();
        cx.beginPath();
        cx.moveTo(34, 9);
        cx.lineTo(10, 21);
        cx.lineTo(10, 44);
        cx.lineTo(34, 32);
        cx.closePath();

        const glass = cx.createLinearGradient(0, 9, 0, 44);
        glass.addColorStop(0, glassTop);
        glass.addColorStop(1, glassBottom);
        cx.fillStyle = glass;
        cx.fill();
        cx.clip();

        // incoming light rays
        cx.fillStyle = 'rgba(255,255,255,0.30)';
        cx.beginPath();
        cx.moveTo(14, 10);
        cx.lineTo(18, 10);
        cx.lineTo(28, 44);
        cx.lineTo(24, 44);
        cx.closePath();
        cx.fill();

        cx.fillStyle = 'rgba(255,255,255,0.18)';
        cx.beginPath();
        cx.moveTo(22, 8);
        cx.lineTo(25, 8);
        cx.lineTo(33, 36);
        cx.lineTo(30, 36);
        cx.closePath();
        cx.fill();

        // window crossbars
        cx.strokeStyle = frameCol;
        cx.lineWidth = 3;
        cx.beginPath();
        cx.moveTo(22, 15);
        cx.lineTo(22, 38);
        cx.moveTo(10, 32.5);
        cx.lineTo(34, 20.5);
        cx.stroke();

        cx.restore();

        // outline
        cx.strokeStyle = 'rgba(17,17,27,0.5)';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(38, 4);
        cx.lineTo(6, 20);
        cx.lineTo(6, 48);
        cx.lineTo(38, 32);
        cx.closePath();
        cx.stroke();
      });
    };

    // Actual little pictures, each with different shapes and colors

    const sunsetArt = function (cx: CanvasRenderingContext2D): void {
      const sky = cx.createLinearGradient(0, 4, 0, 22);
      sky.addColorStop(0, '#cba6f7');
      sky.addColorStop(0.5, '#f5c2e7');
      sky.addColorStop(1, '#fab387');
      cx.fillStyle = sky;
      cx.fillRect(0, 0, 24, 26);

      cx.fillStyle = '#f9e2af';
      cx.beginPath();
      cx.arc(11, 10, 3, 0, Math.PI * 2);
      cx.fill();

      cx.fillStyle = '#89dceb';
      cx.fillRect(0, 14, 24, 12);

      cx.strokeStyle = 'rgba(249,226,175,0.75)';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(7, 16);
      cx.lineTo(15, 16);
      cx.moveTo(6, 18);
      cx.lineTo(16, 18);
      cx.moveTo(8, 20);
      cx.lineTo(14, 20);
      cx.stroke();
    };

    const mountainArt = function (cx: CanvasRenderingContext2D): void {
      const sky = cx.createLinearGradient(0, 4, 0, 22);
      sky.addColorStop(0, '#89b4fa');
      sky.addColorStop(1, '#cdd6f4');
      cx.fillStyle = sky;
      cx.fillRect(0, 0, 24, 26);

      cx.fillStyle = '#f9e2af';
      cx.beginPath();
      cx.arc(17, 7, 2, 0, Math.PI * 2);
      cx.fill();

      cx.fillStyle = '#585b70';
      cx.beginPath();
      cx.moveTo(2, 22);
      cx.lineTo(10, 7);
      cx.lineTo(18, 22);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#f5e0dc';
      cx.beginPath();
      cx.moveTo(8, 11);
      cx.lineTo(10, 7);
      cx.lineTo(12, 11);
      cx.lineTo(10, 13);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#a6e3a1';
      cx.fillRect(0, 19, 24, 7);
    };

    const forestArt = function (cx: CanvasRenderingContext2D): void {
      const sky = cx.createLinearGradient(0, 4, 0, 22);
      sky.addColorStop(0, '#94e2d5');
      sky.addColorStop(1, '#cdd6f4');
      cx.fillStyle = sky;
      cx.fillRect(0, 0, 24, 26);

      cx.fillStyle = '#3b2f2b';
      cx.fillRect(0, 18, 24, 8);

      cx.fillStyle = '#7c5c49';
      cx.fillRect(10, 13, 2, 6);

      cx.fillStyle = '#40a02b';
      cx.beginPath();
      cx.moveTo(11, 4);
      cx.lineTo(16, 13);
      cx.lineTo(6, 13);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#a6e3a1';
      cx.beginPath();
      cx.moveTo(11, 7);
      cx.lineTo(15, 14);
      cx.lineTo(7, 14);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#f9e2af';
      cx.fillRect(6, 8, 1, 1);
      cx.fillRect(16, 6, 1, 1);
      cx.fillRect(14, 17, 1, 1);
    };

    const heartArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#313244';
      cx.fillRect(0, 0, 24, 26);

      cx.fillStyle = '#f5c2e7';
      cx.beginPath();
      cx.arc(9, 10, 2.4, 0, Math.PI * 2);
      cx.fill();

      cx.beginPath();
      cx.arc(13, 10, 2.4, 0, Math.PI * 2);
      cx.fill();

      cx.beginPath();
      cx.moveTo(6.8, 11);
      cx.lineTo(15.2, 11);
      cx.lineTo(11, 17);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#cba6f7';
      cx.fillRect(5, 6, 1, 1);
      cx.fillRect(17, 8, 1, 1);
      cx.fillRect(7, 18, 1, 1);
    };

    const starArt = function (cx: CanvasRenderingContext2D): void {
      cx.fillStyle = '#1e1e2e';
      cx.fillRect(0, 0, 24, 26);

      cx.fillStyle = '#f9e2af';
      cx.beginPath();
      cx.moveTo(11, 5);
      cx.lineTo(12.8, 9.5);
      cx.lineTo(17.5, 10);
      cx.lineTo(13.8, 12.8);
      cx.lineTo(15, 17.5);
      cx.lineTo(11, 14.8);
      cx.lineTo(7, 17.5);
      cx.lineTo(8.2, 12.8);
      cx.lineTo(4.5, 10);
      cx.lineTo(9.2, 9.5);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#89b4fa';
      cx.fillRect(5, 6, 1, 1);
      cx.fillRect(17, 5, 1, 1);
      cx.fillRect(18, 17, 1, 1);
    };

    // Create back-wall picture textures
    picBack('iso_pic_sunset', '#7c5c49', '#1e1e2e', sunsetArt);
    picBack('iso_pic_mountain', '#585b70', '#1e1e2e', mountainArt);
    picBack('iso_pic_forest', '#45475a', '#1e1e2e', forestArt);
    picBack('iso_pic_heart', '#b4637a', '#1e1e2e', heartArt);
    picBack('iso_pic_star', '#313244', '#1e1e2e', starArt);

    // Create larger left-wall window textures
    windowLeftLarge('iso_window_warm_large', '#5a4636', '#f9e2af', '#89dceb');
    windowLeftLarge('iso_window_cool_large', '#5a4636', '#89dceb', '#cba6f7');

    // 1x2 rotated desk
    this.boxTexture('isodesk', 1, 2, DESK_H, '#6d5844', '#4a392b', '#5a4636', function (cx) {
      cx.strokeStyle = '#7a6350';
      cx.beginPath();
      cx.moveTo(72, 4);
      cx.lineTo(8, 36);
      cx.moveTo(88, 12);
      cx.lineTo(24, 44);
      cx.stroke();
      cx.strokeStyle = '#4a392b';
      cx.beginPath();
      cx.moveTo(80, 8);
      cx.lineTo(16, 40);
      cx.stroke();
      cx.strokeStyle = '#3b2f2b';
      cx.beginPath();
      cx.moveTo(48, 48);
      cx.lineTo(80, 32);
      cx.lineTo(80, 42);
      cx.lineTo(48, 58);
      cx.closePath();
      cx.stroke();
      cx.fillStyle = '#f9e2af';
      cx.fillRect(62, 44, 3, 2);
      cx.strokeStyle = '#3b2f2b';
      cx.beginPath();
      cx.moveTo(8, 42);
      cx.lineTo(24, 50);
      cx.lineTo(24, 60);
      cx.lineTo(8, 52);
      cx.closePath();
      cx.stroke();
      cx.fillStyle = '#f9e2af';
      cx.fillRect(14, 52, 3, 2);
    });

    this.canvasTexture('iso_crt', 44, 48, function (cx) {
      // Left side (now back/side)
      cx.fillStyle = '#313244';
      cx.beginPath();
      cx.moveTo(4, 9);
      cx.lineTo(22, 18);
      cx.lineTo(22, 44);
      cx.lineTo(4, 35);
      cx.closePath();
      cx.fill();
      
      // Right side (now front with screen)
      cx.fillStyle = '#26263a';
      cx.beginPath();
      cx.moveTo(40, 9);
      cx.lineTo(22, 18);
      cx.lineTo(22, 44);
      cx.lineTo(40, 35);
      cx.closePath();
      cx.fill();
      
      // Screen (on right face)
      cx.fillStyle = '#101820';
      cx.beginPath();
      cx.moveTo(37, 14);
      cx.lineTo(25, 20);
      cx.lineTo(25, 38);
      cx.lineTo(37, 32);
      cx.closePath();
      cx.fill();
      
      // Screen glare / code lines (mirrored)
      cx.strokeStyle = '#7dcfff';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(35, 18);
      cx.lineTo(29, 21);
      cx.moveTo(35, 22);
      cx.lineTo(27, 26);
      cx.stroke();
      
      cx.strokeStyle = '#a6e3a1';
      cx.beginPath();
      cx.moveTo(35, 26);
      cx.lineTo(30, 28.5);
      cx.moveTo(35, 30);
      cx.lineTo(28, 33.5);
      cx.stroke();
      
      // Top diamond
      cx.fillStyle = '#3a3a4e';
      self.diamondPath(cx, 22, 9, 36, 18);
      cx.fill();
      cx.strokeStyle = 'rgba(17,17,27,0.6)';
      self.diamondPath(cx, 22, 9, 36, 18);
      cx.stroke();
    });

    this.canvasTexture('iso_lamp', 24, 44, function (cx) {
      self.diamondPath(cx, 12, 38, 20, 10);
      cx.fillStyle = '#45475a';
      cx.fill();
      cx.strokeStyle = '#6c7086';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(12, 38);
      cx.lineTo(12, 16);
      cx.stroke();
      cx.fillStyle = '#fab387';
      cx.beginPath();
      cx.moveTo(4, 16);
      cx.lineTo(20, 16);
      cx.lineTo(12, 4);
      cx.closePath();
      cx.fill();
      cx.fillStyle = '#ffd86a';
      cx.beginPath();
      cx.arc(12, 16, 4, 0, Math.PI * 2);
      cx.fill();
    });

    // Documents/: tall storage box with lid seam + slanted labels
    this.boxTexture('iso_docbox', 1, 1, 54, '#585b70', '#3a3c4e', '#45475a', function (cx) {
      // lid seam
      cx.strokeStyle = '#313244';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(0, 22);
      cx.lineTo(32, 38);
      cx.lineTo(64, 22);
      cx.stroke();

      // left-face label (slanted with the isometric face)
      cx.fillStyle = '#f9e2af';
      cx.beginPath();
      cx.moveTo(8, 44);
      cx.lineTo(22, 51);
      cx.lineTo(22, 60);
      cx.lineTo(8, 53);
      cx.closePath();
      cx.fill();

      // left label lines
      cx.fillStyle = '#3a3c4e';
      cx.beginPath();
      cx.moveTo(10, 47);
      cx.lineTo(20, 52);
      cx.lineTo(20, 53.5);
      cx.lineTo(10, 48.5);
      cx.closePath();
      cx.fill();

      cx.beginPath();
      cx.moveTo(10, 50);
      cx.lineTo(17, 53.5);
      cx.lineTo(17, 55);
      cx.lineTo(10, 51.5);
      cx.closePath();
      cx.fill();

      // right-face label (slanted with the isometric face)
      cx.fillStyle = '#f9e2af';
      cx.beginPath();
      cx.moveTo(42, 51);
      cx.lineTo(56, 44);
      cx.lineTo(56, 53);
      cx.lineTo(42, 60);
      cx.closePath();
      cx.fill();

      // right label lines
      cx.fillStyle = '#3a3c4e';
      cx.beginPath();
      cx.moveTo(44, 52);
      cx.lineTo(54, 47);
      cx.lineTo(54, 48.5);
      cx.lineTo(44, 53.5);
      cx.closePath();
      cx.fill();

      cx.beginPath();
      cx.moveTo(44, 55);
      cx.lineTo(51, 51.5);
      cx.lineTo(51, 53);
      cx.lineTo(44, 56.5);
      cx.closePath();
      cx.fill();
    });

    this.canvasTexture('iso_trash', 40, 34, function (cx) {
      cx.fillStyle = '#45475a';
      cx.beginPath();
      cx.moveTo(0, 10);
      cx.lineTo(20, 20);
      cx.lineTo(20, 34);
      cx.lineTo(0, 24);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#585b70';
      cx.beginPath();
      cx.moveTo(40, 10);
      cx.lineTo(20, 20);
      cx.lineTo(20, 34);
      cx.lineTo(40, 24);
      cx.closePath();
      cx.fill();

      // top rim
      cx.fillStyle = '#6c7086';
      self.diamondPath(cx, 20, 10, 40, 20);
      cx.fill();

      // opening
      cx.fillStyle = '#313244';
      self.diamondPath(cx, 20, 10, 28, 14);
      cx.fill();

      // download arrow painted onto the right face, slanted with the box
      cx.fillStyle = '#89b4fa';

      // shaft
      cx.beginPath();
      cx.moveTo(29, 17);
      cx.lineTo(32, 15.5);
      cx.lineTo(32, 23);
      cx.lineTo(29, 24.5);
      cx.closePath();
      cx.fill();

      // arrow head
      cx.beginPath();
      cx.moveTo(26.5, 24);
      cx.lineTo(34.5, 20);
      cx.lineTo(30.5, 29);
      cx.closePath();
      cx.fill();

      // little tray line under the arrow
      cx.strokeStyle = '#89b4fa';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(26, 30);
      cx.lineTo(34, 26);
      cx.stroke();

      // outline
      cx.strokeStyle = 'rgba(17,17,27,0.5)';
      self.diamondPath(cx, 20, 10, 40, 20);
      cx.stroke();
    });

    // Chair next to the desk, facing toward the terminal screen
    this.canvasTexture('iso_chair', 64, 70, function (cx) {
      // soft floor shadow
      cx.fillStyle = 'rgba(17,17,27,0.22)';
      self.diamondPath(cx, 32, 52, 42, 21);
      cx.fill();

      // backrest, placed on the back-left edge so the chair faces right/front
      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(12, 38);
      cx.lineTo(32, 28);
      cx.lineTo(32, 10);
      cx.lineTo(12, 20);
      cx.closePath();
      cx.fill();

      // backrest slats
      cx.strokeStyle = 'rgba(59,47,43,0.65)';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(16, 33);
      cx.lineTo(16, 17);
      cx.moveTo(22, 30);
      cx.lineTo(22, 14);
      cx.moveTo(28, 27);
      cx.lineTo(28, 11);
      cx.stroke();

      // backrest top highlight
      cx.strokeStyle = '#7a6350';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(12, 20);
      cx.lineTo(32, 10);
      cx.stroke();

      // legs
      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(12, 38);
      cx.lineTo(12, 52);
      cx.moveTo(52, 38);
      cx.lineTo(52, 52);
      cx.moveTo(32, 48);
      cx.lineTo(32, 62);
      cx.stroke();

      // seat
      self.diamondPath(cx, 32, 38, 40, 20);
      cx.fillStyle = '#6d5844';
      cx.fill();
      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 1;
      cx.stroke();

      // cushion
      self.diamondPath(cx, 32, 38, 26, 13);
      cx.fillStyle = '#fab387';
      cx.fill();

      // cushion outline
      cx.strokeStyle = 'rgba(59,47,43,0.45)';
      cx.lineWidth = 1;
      self.diamondPath(cx, 32, 38, 26, 13);
      cx.stroke();
    });

    this.canvasTexture('glow_radial', 128, 128, function (cx) {
      const gr = cx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.45)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = gr;
      cx.fillRect(0, 0, 128, 128);
    });

    // ---------------------------------------------------------------
    // Faye the fairy, restyled: pink space buns, tan skin, white top
    // and skirt, glitchy blue/pink butterfly wings and a sparkling
    // wand. No legs, she floats.
    // ---------------------------------------------------------------
    this.canvasTexture('fairy_wings', 60, 40, function (cx) {
      const upperPath = function (X: (v: number) => number): void {
        cx.moveTo(X(31), 18);
        cx.lineTo(X(40), 6);
        cx.lineTo(X(50), 3);
        cx.lineTo(X(48), 12);
        cx.lineTo(X(55), 15);
        cx.lineTo(X(47), 22);
        cx.lineTo(X(31), 24);
        cx.closePath();
      };
      const lowerPath = function (X: (v: number) => number): void {
        cx.moveTo(X(31), 24);
        cx.lineTo(X(48), 24);
        cx.lineTo(X(44), 32);
        cx.lineTo(X(36), 37);
        cx.lineTo(X(31), 30);
        cx.closePath();
      };

      const drawWing = function (dir: number): void {
        const X = function (v: number): number {
          return dir === 1 ? v : 60 - v;
        };

        // pink outline
        cx.lineWidth = 2;
        cx.strokeStyle = '#f562a5';
        cx.beginPath();
        upperPath(X);
        cx.stroke();
        cx.beginPath();
        lowerPath(X);
        cx.stroke();

        // dark wing fill
        cx.fillStyle = '#313244';
        cx.beginPath();
        upperPath(X);
        cx.fill();
        cx.beginPath();
        lowerPath(X);
        cx.fill();

        // cyan scanline stripes + blue blocks, clipped to the wing
        cx.save();
        cx.beginPath();
        upperPath(X);
        lowerPath(X);
        cx.clip();

        cx.strokeStyle = '#22c8e6';
        cx.lineWidth = 1;
        for (let y = 5; y !== 38; y += 3) {
          cx.beginPath();
          cx.moveTo(dir === 1 ? 30 : 0, y);
          cx.lineTo(dir === 1 ? 60 : 30, y);
          cx.stroke();
        }

        cx.fillStyle = '#1e66f5';
        cx.fillRect(dir === 1 ? 40 : 14, 9, 6, 2);
        cx.fillRect(dir === 1 ? 44 : 10, 17, 5, 2);
        cx.fillRect(dir === 1 ? 38 : 17, 27, 5, 2);

        cx.restore();

        // bright tip pixels
        cx.fillStyle = '#89dceb';
        cx.fillRect(X(50) - 1, 2, 2, 2);
        cx.fillRect(X(55) - 1, 14, 2, 2);
        cx.fillRect(X(36) - 1, 36, 2, 2);
      };

      drawWing(1);
      drawWing(-1);

      // floating pink pixel particles around the wings
      cx.fillStyle = '#f562a5';
      cx.fillRect(1, 7, 2, 2);
      cx.fillRect(5, 19, 2, 2);
      cx.fillRect(9, 30, 2, 2);
      cx.fillRect(57, 7, 2, 2);
      cx.fillRect(53, 19, 2, 2);
      cx.fillRect(49, 30, 2, 2);
    });

    this.canvasTexture('fairy', 32, 40, function (cx) {
      const PINK = '#f562a5';
      const PINK_D = '#d84f9b';
      const SKIN = '#e0955f';
      const WHITE = '#f5e0dc';

      // wand stick (drawn first so the hand overlaps it)
      cx.strokeStyle = '#c58f5a';
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(24, 25);
      cx.lineTo(28, 15);
      cx.stroke();

      // wand sparkle star
      cx.fillStyle = PINK;
      cx.beginPath();
      cx.moveTo(28, 10);
      cx.lineTo(29.5, 13.5);
      cx.lineTo(33, 15);
      cx.lineTo(29.5, 16.5);
      cx.lineTo(28, 20);
      cx.lineTo(26.5, 16.5);
      cx.lineTo(23, 15);
      cx.lineTo(26.5, 13.5);
      cx.closePath();
      cx.fill();
      cx.fillStyle = '#ffffff';
      cx.fillRect(27, 14, 2, 2);

      // space buns
      cx.fillStyle = PINK;
      cx.beginPath();
      cx.arc(9, 7, 4, 0, Math.PI * 2);
      cx.fill();
      cx.beginPath();
      cx.arc(23, 7, 4, 0, Math.PI * 2);
      cx.fill();

      // bun swirls
      cx.strokeStyle = PINK_D;
      cx.lineWidth = 1;
      cx.beginPath();
      cx.arc(9, 7, 2, 0, Math.PI * 1.5);
      cx.stroke();
      cx.beginPath();
      cx.arc(23, 7, 2, 0, Math.PI * 1.5);
      cx.stroke();

      // head
      cx.fillStyle = SKIN;
      cx.beginPath();
      cx.arc(16, 13, 6, 0, Math.PI * 2);
      cx.fill();

      // hair top + bangs
      cx.fillStyle = PINK;
      cx.beginPath();
      cx.arc(16, 11, 6.5, Math.PI, 0);
      cx.fill();
      cx.fillRect(10, 10, 12, 3);

      // side strands
      cx.fillRect(9, 11, 2, 7);
      cx.fillRect(21, 11, 2, 7);

      // big warm brown eyes with highlights
      cx.fillStyle = '#5b3a24';
      cx.beginPath();
      cx.arc(13, 14, 2, 0, Math.PI * 2);
      cx.fill();
      cx.beginPath();
      cx.arc(19, 14, 2, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = '#ffffff';
      cx.fillRect(12, 13, 1, 1);
      cx.fillRect(18, 13, 1, 1);

      // blush
      cx.fillStyle = '#f38ba8';
      cx.fillRect(10, 17, 2, 1);
      cx.fillRect(20, 17, 2, 1);

      // open happy mouth
      cx.fillStyle = '#8c2f3f';
      cx.beginPath();
      cx.arc(16, 17, 2, 0, Math.PI);
      cx.fill();
      cx.fillStyle = '#f38ba8';
      cx.fillRect(15, 18, 2, 1);

      // arms: left on hip, right holding the wand
      cx.strokeStyle = SKIN;
      cx.lineWidth = 2;
      cx.beginPath();
      cx.moveTo(12, 21);
      cx.lineTo(9, 24);
      cx.lineTo(12, 26);
      cx.stroke();
      cx.beginPath();
      cx.moveTo(20, 21);
      cx.lineTo(24, 24);
      cx.stroke();

      // pink wristbands
      cx.fillStyle = PINK;
      cx.fillRect(8, 23, 3, 2);
      cx.fillRect(22, 23, 3, 2);

      // white tank top
      cx.fillStyle = WHITE;
      cx.beginPath();
      cx.moveTo(12, 20);
      cx.lineTo(20, 20);
      cx.lineTo(21, 27);
      cx.lineTo(11, 27);
      cx.closePath();
      cx.fill();

      // top shading
      cx.strokeStyle = 'rgba(17,17,27,0.15)';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(13, 22);
      cx.lineTo(19, 22);
      cx.stroke();

      // pink waist ribbon + dangling strings
      cx.fillStyle = PINK;
      cx.fillRect(14, 26, 4, 2);
      cx.fillRect(14, 28, 1, 4);
      cx.fillRect(17, 28, 1, 4);

      // white flared skirt, no legs below: she floats
      cx.fillStyle = WHITE;
      cx.beginPath();
      cx.moveTo(11, 27);
      cx.lineTo(21, 27);
      cx.lineTo(24, 34);
      cx.lineTo(8, 34);
      cx.closePath();
      cx.fill();

      // skirt fold shading
      cx.strokeStyle = 'rgba(17,17,27,0.15)';
      cx.beginPath();
      cx.moveTo(14, 28);
      cx.lineTo(13, 33);
      cx.moveTo(18, 28);
      cx.lineTo(19, 33);
      cx.stroke();

      // soft float sparkles under the skirt
      cx.fillStyle = 'rgba(245,98,165,0.6)';
      cx.fillRect(12, 36, 1, 1);
      cx.fillRect(16, 37, 1, 1);
      cx.fillRect(20, 36, 1, 1);
    });

    const HAIR = '#7c5c49';
    const SKIN = '#ffd9b3';
    const HOOD = '#89b4fa';
    const PANT = '#313244';
    const SHOE = '#f5e0dc';
    const EYE = '#1e1e2e';
    const legs = function (cx: CanvasRenderingContext2D, f: number): void {
      if (f === 0) {
        P(cx, 9, 22, 2, 7, PANT);
        P(cx, 13, 22, 2, 7, PANT);
        P(cx, 8, 29, 3, 2, SHOE);
        P(cx, 13, 29, 3, 2, SHOE);
      } else {
        P(cx, 9, 22, 2, 5, PANT);
        P(cx, 8, 27, 3, 2, SHOE);
        P(cx, 13, 22, 2, 7, PANT);
        P(cx, 13, 29, 3, 2, SHOE);
      }
    };
    const playerFrame = function (key: string, dir: 'd' | 'u' | 's', f: number): void {
      if (self.textures.exists(key)) return;
      const ct = self.textures.createCanvas(key, 24, 32);
      if (!ct) return;
      const cx = ct.context;
      if (dir === 'd') {
        P(cx, 6, 2, 12, 3, HAIR);
        P(cx, 5, 4, 2, 9, HAIR);
        P(cx, 17, 4, 2, 9, HAIR);
        P(cx, 8, 5, 8, 6, SKIN);
        P(cx, 8, 5, 8, 2, HAIR);
        P(cx, 9, 8, 2, 2, EYE);
        P(cx, 13, 8, 2, 2, EYE);
        P(cx, 7, 11, 10, 7, HOOD);
        P(cx, 5, 11, 2, 6, HOOD);
        P(cx, 17, 11, 2, 6, HOOD);
        P(cx, 7, 18, 10, 4, PANT);
        legs(cx, f);
      } else if (dir === 'u') {
        P(cx, 5, 2, 14, 12, HAIR);
        P(cx, 7, 12, 10, 6, HOOD);
        P(cx, 7, 18, 10, 4, PANT);
        legs(cx, f);
      } else {
        P(cx, 6, 2, 9, 11, HAIR);
        P(cx, 6, 2, 10, 3, HAIR);
        P(cx, 12, 5, 6, 6, SKIN);
        P(cx, 12, 5, 6, 2, HAIR);
        P(cx, 15, 8, 2, 2, EYE);
        P(cx, 8, 11, 8, 7, HOOD);
        P(cx, 10, 12, 3, 6, HOOD);
        P(cx, 8, 18, 8, 4, PANT);
        if (f === 0) {
          P(cx, 9, 22, 3, 7, PANT);
          P(cx, 13, 22, 3, 7, PANT);
          P(cx, 9, 29, 4, 2, SHOE);
          P(cx, 13, 29, 4, 2, SHOE);
        } else {
          P(cx, 9, 22, 3, 7, PANT);
          P(cx, 9, 29, 4, 2, SHOE);
          P(cx, 14, 22, 3, 5, PANT);
          P(cx, 14, 27, 4, 2, SHOE);
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
    // Calculate the true center of the box footprint in grid coordinates
    const cx = bx + (fw - 1) / 2;
    const cy = by + (fh - 1) / 2;
    const p = this.isoToScreen(cx, cy);
    
    // chh is the height of the top diamond face in the canvas
    const chh = (fw + fh) * (TILE_H / 2);
    const canvasHeight = chh + height;
    
    // Offset sprite Y upwards by the wall's height so the base sits on the floor
    const sprite = this.add.sprite(p.x, p.y - height, key);
    
    // Set origin so the base diamond perfectly aligns with the floor diamond
    // originY = (chh / 2) / canvasHeight ensures the bottom of the side faces 
    // aligns precisely with the floor tile's diamond footprint
    sprite.setOrigin(0.5, (chh / 2) / canvasHeight);
    
    // Depth calculated from the center coordinates ensures correct 2.5D sorting
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
    // Clear solids array to prevent collision data from accumulating on scene restart
    this.solids = [];

    // floor + rug
    for (let gx = 0; gx !== GRID_W; gx++) {
      for (let gy = 0; gy !== GRID_H; gy++) {
        const tileKey = (gx + gy) % 2 === 0 ? 'isofloora' : 'isofloorb';
        this.addIsoSprite(tileKey, gx, gy, 0, 0.5);
        if (this.between(gx, 2, 4) && this.between(gy, 2, 4)) {
          this.addIsoSprite('isorug', gx, gy, 1, 0.5);
        }
      }
    }

    // back wall (tall, slim, warm), with the CLOSED root door at (7,0)
    // Wall visuals no longer block the whole tile, so the player can stand right beside them.
    for (let gx = 0; gx !== GRID_W; gx++) {
      if (gx === 7) {
        this.doorSprite = this.addBoxSprite('isodoorwall', 7, 0, 1, WALL_THICKNESS, 0, WALL_H);
        // Keep the door tile solid so you cannot walk through the door yet
        this.solids.push({ x: 7, y: 0 });
      } else {
        this.addBoxSprite('isowall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      }
    }

    // left wall (tall, slim, warm)
    // Drawn as individual segments from gy 0 so the top corner is sealed and depth sorting stays correct.
    // No solids are added here, allowing the player to walk right beside the left wall.
    for (let gy = 0; gy !== GRID_H; gy++) {
      this.addBoxSprite('isowall_left', 0, gy, WALL_THICKNESS, 1, -2, WALL_H);
    }

    // Gallery wall on the back wall: different shapes, colors, and actual little pictures
    const pic1 = this.addIsoSprite('iso_pic_sunset', 1, 0, 0, 1);
    pic1.x += 16;
    pic1.y -= 74;

    const pic2 = this.addIsoSprite('iso_pic_mountain', 2, 0, 0, 1);
    pic2.x += 16;
    pic2.y -= 82;

    const pic3 = this.addIsoSprite('iso_pic_forest', 3, 0, 0, 1);
    pic3.x += 16;
    pic3.y -= 70;

    const pic4 = this.addIsoSprite('iso_pic_heart', 4, 0, 0, 1);
    pic4.x += 16;
    pic4.y -= 84;

    const pic5 = this.addIsoSprite('iso_pic_star', 5, 0, 0, 1);
    pic5.x += 16;
    pic5.y -= 72;

    // Windows on the left wall, moved to opposite sides of Documents and Downloads,
    // and lowered slightly.
    const window1 = this.addIsoSprite('iso_window_warm_large', 0, 2, 0, 48 / 56);
    window1.x -= 16;
    window1.y -= 66;

    const window2 = this.addIsoSprite('iso_window_cool_large', 0, 5, 0, 48 / 56);
    window2.x -= 16;
    window2.y -= 66;

    // desk is a 1x2 rotated box on the right side
    // Reduced depth offset so the player standing in front of the desk is drawn in front of it
    this.addBoxSprite('isodesk', 6, 2, 1, 2, 6, DESK_H);
    this.solids.push({ x: 6, y: 2 });
    this.solids.push({ x: 6, y: 3 });

    // terminal sitting ON TOP of the table
    const crtPt = this.isoToScreen(6, 2.5);
    this.crtWorld = { x: crtPt.x - 6, y: crtPt.y - DESK_H - 14 };
    this.add
      .sprite(crtPt.x, crtPt.y - DESK_H, 'iso_crt')
      .setOrigin(0.5, 44 / 48)
      .setDepth(this.computeDepth(6, 2.5, 9));

    // downloads bin placed on the floor next to the documents box
    const binPt = this.isoToScreen(0, 4);
    this.add
      .sprite(binPt.x, binPt.y, 'iso_trash')
      .setOrigin(0.5, 1)
      .setDepth(this.computeDepth(0, 4, 0));
    this.solids.push({ x: 0, y: 4 });

    // floor lamp parked in the back-right corner
    const lampPt = this.isoToScreen(8, 0);
    this.lampWorld = { x: lampPt.x, y: lampPt.y - 24 };
    this.add
      .sprite(lampPt.x, lampPt.y, 'iso_lamp')
      .setOrigin(0.5, 40 / 44)
      .setDepth(this.computeDepth(8, 0, 1));
    this.solids.push({ x: 8, y: 0 });

    // Documents/: ONE tall box set into the left wall
    const docsPt = this.isoToScreen(0, 3);
    this.add
      .sprite(docsPt.x, docsPt.y, 'iso_docbox')
      .setOrigin(0.5, 70 / 86)
      .setDepth(this.computeDepth(0, 3, 0));
    this.solids.push({ x: 0, y: 3 });

    // chair on the opposite side of the desk, facing the terminal
    const chairPt = this.isoToScreen(7, 2);
    this.add
      .sprite(chairPt.x, chairPt.y, 'iso_chair')
      .setOrigin(0.5, 52 / 70)
      .setFlipX(true)
      .setDepth(this.computeDepth(7, 2, 6));
    this.solids.push({ x: 7, y: 2 });

    // interactable points (player discovers them by walking up)
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
    pool(ORIGIN_X, ORIGIN_Y + 120, C_MAUVE, 3.0, 0.08);

    // extra soft light from the larger left-wall windows
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

    // gentle light coming in from the larger windows
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

    this.dlgBox = this.add
      .rectangle(400, 548, 768, 88, C_BASE0, 0.95)
      .setStrokeStyle(2, C_PINK)
      .setDepth(610)
      .setVisible(false);
    this.dlgName = this.add
      .text(36, 512, ' Fae ', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#1e1e2e',
        backgroundColor: '#f5c2e7',
        padding: { x: 4, y: 3 },
      })
      .setDepth(611)
      .setVisible(false);
    this.dlgText = this.add
      .text(36, 534, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#cdd6f4',
        wordWrap: { width: 700 },
      })
      .setDepth(611)
      .setVisible(false);
    this.dlgArrow = this.add
      .text(752, 582, '▼', { fontFamily: 'monospace', fontSize: '16px', color: '#f5c2e7' })
      .setOrigin(0.5)
      .setDepth(611)
      .setVisible(false);
    this.tweens.add({ targets: this.dlgArrow, alpha: 0.1, duration: 400, yoyo: true, repeat: -1 });
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
    this.dlgActive = true;
    this.dlgFull = line;
    this.dlgShown = 0;
    this.dlgAcc = 0;
    this.dlgDone = false;
    this.dlgText.setText('');
    this.dlgArrow.setVisible(false);
    this.dlgBox.setVisible(true);
    this.dlgName.setVisible(true);
    this.dlgText.setVisible(true);
    this.promptText.setVisible(false);
  }

  private stepDialogue(delta: number): void {
    if (!this.dlgActive || this.dlgDone) return;
    this.dlgAcc += delta;
    const want = Math.floor(this.dlgAcc / 18);
    const cap = this.dlgFull.length;
    this.dlgShown = Math.min(cap, Math.max(this.dlgShown, want));
    if (this.dlgShown === cap) {
      this.dlgDone = true;
      this.dlgArrow.setVisible(true);
    }
    this.dlgText.setText(this.dlgFull.substring(0, this.dlgShown));
  }

  private advanceDialogue(): void {
    if (!this.dlgDone) {
      this.dlgShown = this.dlgFull.length;
      this.dlgDone = true;
      this.dlgText.setText(this.dlgFull);
      this.dlgArrow.setVisible(true);
      return;
    }
    this.dlgActive = false;
    this.dlgBox.setVisible(false);
    this.dlgName.setVisible(false);
    this.dlgText.setVisible(false);
    this.dlgArrow.setVisible(false);
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
    } else {
      this.exploreText.setText('explored ' + n + '/4');
    }
  }

  private lineFor(target: InteractableDef): string {
    if (target.id === 'door') {
      if (!this.doorUnlocked) {
        return 'Explore the room first! Check your Documents, Downloads, Pictures, and Terminal.';
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

    if (this.dlgActive) {
      this.stepDialogue(delta);
      if (
        Phaser.Input.Keyboard.JustDown(this.keyE) ||
        Phaser.Input.Keyboard.JustDown(this.keySpace) ||
        Phaser.Input.Keyboard.JustDown(this.keyEnter)
      ) {
        this.advanceDialogue();
      }
      return;
    }

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
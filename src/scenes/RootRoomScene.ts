import Phaser from 'phaser';

// ------------------------------------------------------------------
//  RootRoomScene — the "/" (Root) directory, Backrooms edition.
//  A long sickly-yellow hallway hub with linear progression. Faye is
//  only a voice in your head here. Find the active terminal, then
//  exit to /etc for Chapter 2.
//  NOTE: comments use double slashes only.
// ------------------------------------------------------------------

const W = 800;
const H = 600;
const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 120;
const WALL_THICKNESS = 0.2;
const GRID_W = 9;
const GRID_H = 26;
const ORIGIN_X = 800;
const ORIGIN_Y = 200;
const LIGHT_W = 1600;
const LIGHT_H = 1600;

// Sickly yellow Backrooms carpet
const C_CARPET_A = '#d1c878';
const C_CARPET_B = '#c4bc6b';
const C_WALL = '#d4cf7a';
const C_WALL_TOP = '#b8b26a';
const C_BASE_A = '#6e6852';
const C_BASE_B = '#5f5947';
const C_BLUE = 0x89b4fa;
const C_PEACH = 0xfab387;
const C_YELLOW = 0xf9e2af;
const C_BASE0 = 0x1e1e2e;

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

interface DirDef {
  id: string;
  label: string;
  gx: number;
  gy: number;
  desc: string;
}

type TargetCallback = { (target: string): void };
type DrawCallback = { (cx: CanvasRenderingContext2D): void };

export class RootRoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;

  private playerGrid = { x: 4, y: 23 };
  private moving = false;
  private moveProxy = { t: 0 };
  private solids: SolidTile[] = [];

  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;
  private crtWorld = { x: 0, y: 0 };

  private onInteract?: TargetCallback;

  private interactables: InteractableDef[] = [];
  private nearTarget: InteractableDef | null = null;
  private promptText!: Phaser.GameObjects.Text;
  private exploreText!: Phaser.GameObjects.Text;
  private lockUntil = 0;
  private doorSprite!: Phaser.GameObjects.Sprite;

  private dlgBox!: Phaser.GameObjects.Rectangle;
  private dlgName!: Phaser.GameObjects.Text;
  private dlgText!: Phaser.GameObjects.Text;
  private dlgArrow!: Phaser.GameObjects.Text;
  private dlgActive = false;
  private dlgFull = '';
  private dlgShown = 0;
  private dlgAcc = 0;
  private dlgDone = false;

  private dirs: DirDef[] = [
    { id: 'bin', label: '/bin', gx: 1, gy: 1, desc: 'Essential binaries. The tools this world needs to boot.' },
    { id: 'etc', label: '/etc', gx: 2, gy: 1, desc: 'Configuration files. Every rule this system lives by.' },
    { id: 'var', label: '/var', gx: 3, gy: 1, desc: 'Variable data. Logs and memories that keep growing.' },
    { id: 'usr', label: '/usr', gx: 4, gy: 1, desc: 'User land. Most of the world\'s software lives in there.' },
    { id: 'tmp', label: '/tmp', gx: 5, gy: 1, desc: 'Temporary storage. Nothing here is meant to last.' },
    { id: 'dev', label: '/dev', gx: 6, gy: 1, desc: 'Devices. The raw hardware of this place, humming away.' },
    { id: 'proc', label: '/proc', gx: 7, gy: 1, desc: 'Process info. A window into the running mind of the kernel.' },
  ];
  
  // Starts with /bin as the active lesson
  private activeDirId = 'bin';

  constructor() {
    super('RootRoom');
  }

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

  create(): void {
    const self = this;
    this.onInteract = this.game.registry.get('onInteract') as TargetCallback | undefined;

    this.makeTextures();
    this.buildRoom();
    this.buildActors();
    this.buildLighting();
    this.buildUI();
    this.buildInput();

    // Large bounds to accommodate the long hallway camera panning
    this.cameras.main.setBounds(-1000, -1000, 3000, 3000);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.cameras.main.fadeIn(600);
    this.time.addEvent({
      delay: 900,
      callback: function () {
        self.openDialogue(
          "You made it to /. It's chaotic here. Find the active terminal to begin your lessons."
        );
      },
    });
  }

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

  // Solid-color yellow wall with a simple baseboard
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

      cx.fillStyle = C_WALL;
      cx.beginPath();
      cx.moveTo(dx, dy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = C_WALL;
      cx.beginPath();
      cx.moveTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = C_WALL_TOP;
      cx.beginPath();
      cx.moveTo(ax, 0);
      cx.lineTo(bx, byy);
      cx.lineTo(cxp, cyp);
      cx.lineTo(dx, dy);
      cx.closePath();
      cx.fill();

      const baseH = 12;
      cx.fillStyle = C_BASE_A;
      cx.beginPath();
      cx.moveTo(dx, dy + height - baseH);
      cx.lineTo(cxp, cyp + height - baseH);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(dx, dy + height);
      cx.closePath();
      cx.fill();

      cx.fillStyle = C_BASE_B;
      cx.beginPath();
      cx.moveTo(bx, byy + height - baseH);
      cx.lineTo(cxp, cyp + height - baseH);
      cx.lineTo(cxp, cyp + height);
      cx.lineTo(bx, byy + height);
      cx.closePath();
      cx.fill();

      if (detail) detail(cx);

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

  private dirBox(key: string, label: string): void {
    this.boxTexture(key, 1, 1, 40, '#b9a94f', '#8f8440', '#a89b4a', function (cx) {
      cx.save();
      // Transform to map to the right isometric face (turned 90 degrees)
      cx.transform(1, -0.5, 0, 1, 32, 32);
      cx.fillStyle = 'rgba(17,17,27,0.85)';
      cx.fillRect(4, 8, 24, 12);
      cx.fillStyle = '#f9e2af';
      cx.font = 'bold 9px monospace';
      cx.fillText(label, 6, 17);
      cx.restore();
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

    const carpetTex = function (key: string, base: string): void {
      self.canvasTexture(key, TILE_W, TILE_H, function (cx) {
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.fillStyle = base;
        cx.fill();
        cx.save();
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.clip();
        cx.strokeStyle = 'rgba(160,150,60,0.5)';
        cx.lineWidth = 1;
        cx.beginPath();
        cx.moveTo(16, 8);
        cx.lineTo(48, 24);
        cx.moveTo(16, 24);
        cx.lineTo(48, 8);
        cx.stroke();
        cx.fillStyle = 'rgba(180,170,80,0.5)';
        cx.fillRect(24, 12, 2, 1);
        cx.fillRect(40, 18, 2, 1);
        cx.fillRect(30, 20, 2, 1);
        cx.restore();
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.strokeStyle = 'rgba(17,17,27,0.5)';
        cx.stroke();
      });
    };
    carpetTex('isofloora', C_CARPET_A);
    carpetTex('isofloorb', C_CARPET_B);

    this.wallTexture('isowall_back', 1, WALL_THICKNESS, WALL_H);
    this.wallTexture('isowall_side', WALL_THICKNESS, 1, WALL_H);

    // Door on the back wall
    this.wallTexture('isodoorwall_back', 1, WALL_THICKNESS, WALL_H, function (cx) {
      cx.fillStyle = '#5a4636';
      cx.beginPath();
      cx.moveTo(10, 26);
      cx.lineTo(28, 35);
      cx.lineTo(28, 116);
      cx.lineTo(10, 107);
      cx.closePath();
      cx.fill();
      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 1;
      cx.stroke();
      
      cx.beginPath();
      cx.moveTo(13, 40);
      cx.lineTo(25, 46);
      cx.lineTo(25, 75);
      cx.lineTo(13, 69);
      cx.closePath();
      cx.stroke();
      
      cx.fillStyle = '#f9e2af';
      cx.fillRect(23, 70, 2, 3);
    });

    // Generate directory boxes
    this.dirBox('iso_dir_bin', '/bin');
    this.dirBox('iso_dir_etc', '/etc');
    this.dirBox('iso_dir_var', '/var');
    this.dirBox('iso_dir_usr', '/usr');
    this.dirBox('iso_dir_tmp', '/tmp');
    this.dirBox('iso_dir_dev', '/dev');
    this.dirBox('iso_dir_proc', '/proc');

    this.canvasTexture('iso_crt', 44, 48, function (cx) {
      cx.fillStyle = '#313244';
      cx.beginPath();
      cx.moveTo(40, 9);
      cx.lineTo(22, 18);
      cx.lineTo(22, 44);
      cx.lineTo(40, 35);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#26263a';
      cx.beginPath();
      cx.moveTo(4, 9);
      cx.lineTo(22, 18);
      cx.lineTo(22, 44);
      cx.lineTo(4, 35);
      cx.closePath();
      cx.fill();

      cx.fillStyle = '#101820';
      cx.beginPath();
      cx.moveTo(7, 14);
      cx.lineTo(19, 20);
      cx.lineTo(19, 38);
      cx.lineTo(7, 32);
      cx.closePath();
      cx.fill();

      cx.strokeStyle = '#7dcfff';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(9, 18);
      cx.lineTo(15, 21);
      cx.moveTo(9, 22);
      cx.lineTo(17, 26);
      cx.stroke();

      cx.strokeStyle = '#a6e3a1';
      cx.beginPath();
      cx.moveTo(9, 26);
      cx.lineTo(14, 28.5);
      cx.moveTo(9, 30);
      cx.lineTo(16, 33.5);
      cx.stroke();

      cx.fillStyle = '#3a3a4e';
      self.diamondPath(cx, 22, 9, 36, 18);
      cx.fill();
      cx.strokeStyle = 'rgba(17,17,27,0.6)';
      self.diamondPath(cx, 22, 9, 36, 18);
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

  private buildRoom(): void {
    this.solids = [];

    // carpet floor
    for (let gx = 0; gx < GRID_W; gx++) {
      for (let gy = 0; gy < GRID_H; gy++) {
        const tileKey = (gx + gy) % 2 === 0 ? 'isofloora' : 'isofloorb';
        const p = this.isoToScreen(gx, gy);
        this.add.sprite(p.x, p.y, tileKey).setOrigin(0.5, 0.5).setDepth(this.computeDepth(gx, gy, 0));
      }
    }

    // Left wall (gx = 0)
    for (let gy = 0; gy < GRID_H; gy++) {
      this.addBoxSprite('isowall_side', 0, gy, WALL_THICKNESS, 1, -2, WALL_H);
      this.solids.push({ x: 0, y: gy });
    }

    // Right wall (gx = 8)
    for (let gy = 0; gy < GRID_H; gy++) {
      this.addBoxSprite('isowall_side', 8, gy, WALL_THICKNESS, 1, -2, WALL_H);
      this.solids.push({ x: 8, y: gy });
    }

    // Back wall (gy = 0) with exit door
    for (let gx = 0; gx < GRID_W; gx++) {
      if (gx === 4) {
        this.doorSprite = this.addBoxSprite('isodoorwall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      } else {
        this.addBoxSprite('isowall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      }
      this.solids.push({ x: gx, y: 0 });
    }

    // Front wall (gy = 25) behind the player spawn
    for (let gx = 0; gx < GRID_W; gx++) {
      this.addBoxSprite('isowall_back', gx, 25, 1, WALL_THICKNESS, 0, WALL_H);
      this.solids.push({ x: gx, y: 25 });
    }

    // Directory boxes lining the back wall
    for (const dir of this.dirs) {
      this.addBoxSprite('iso_dir_' + dir.id, dir.gx, dir.gy, 1, 1, 0, 40);
      this.solids.push({ x: dir.gx, y: dir.gy });
    }

    // Place the active CRT on top of the active directory box
    const activeDir = this.dirs.find(d => d.id === this.activeDirId);
    if (activeDir) {
      const crtPt = this.isoToScreen(activeDir.gx, activeDir.gy);
      // Offset Y by the box height (40) and some extra for the CRT origin
      this.crtWorld = { x: crtPt.x - 6, y: crtPt.y - 40 - 14 };
      this.add
        .sprite(crtPt.x, crtPt.y - 40, 'iso_crt')
        .setOrigin(0.5, 44 / 48)
        .setAlpha(0.95)
        .setDepth(this.computeDepth(activeDir.gx, activeDir.gy, 42));
    }

    // Build interactables
    this.interactables = [];
    for (const dir of this.dirs) {
      this.interactables.push({
        id: dir.id,
        gx: dir.gx + 0.5,
        gy: dir.gy + 0.5,
        radius: 1.8,
        prompt: '[E] Inspect ' + dir.label,
        line: '' // Handled dynamically in lineFor
      });
    }

    // Exit door interactable
    this.interactables.push({
      id: 'exit',
      gx: 4.5,
      gy: 0.5,
      radius: 1.5,
      prompt: '[E] Exit to /etc',
      line: "Faye (Voice): The exit to the next zone is locked until we finish the lessons."
    });
  }

  private buildActors(): void {
    const p = this.isoToScreen(this.playerGrid.x, this.playerGrid.y);
    this.player = this.physics.add.sprite(p.x, p.y, 'pf_d0');
    this.player.setOrigin(0.5, 0.8);
    this.player.setDepth(this.computeDepth(this.playerGrid.x, this.playerGrid.y, 10));
  }

  private buildLighting(): void {
    const self = this;
    this.lightTex = this.textures.createCanvas('lightmap_root', LIGHT_W, LIGHT_H)!;
    this.lightCtx = this.lightTex.context;
    this.add.image(LIGHT_W / 2, LIGHT_H / 2, 'lightmap_root').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(500);

    const pool = function (x: number, y: number, tint: number, scale: number, alpha: number): void {
      self.add
        .sprite(x, y, 'glow_radial')
        .setTint(tint)
        .setScale(scale)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.SCREEN)
        .setDepth(501);
    };

    // Eerie fluorescent ceiling pools down the hallway
    for (let gy = 2; gy < 24; gy += 4) {
      pool(this.isoToScreen(4.5, gy).x, this.isoToScreen(4.5, gy).y, C_YELLOW, 2.5, 0.12);
    }

    // Active CRT blue/green glow
    if (this.crtWorld.x !== 0) {
      pool(this.crtWorld.x, this.crtWorld.y, C_BLUE, 1.8, 0.35);
    }
    
    // Exit door glow
    const doorPt = this.isoToScreen(4.5, 0);
    pool(doorPt.x, doorPt.y - 40, C_PEACH, 1.2, 0.16);
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
    cx.fillStyle = 'rgb(58,54,18)';
    cx.fillRect(0, 0, LIGHT_W, LIGHT_H);

    for (let gy = 2; gy < 24; gy += 4) {
      this.punch(this.isoToScreen(4.5, gy).x, this.isoToScreen(4.5, gy).y, 160, 0.5);
    }

    if (this.crtWorld.x !== 0) {
      this.punch(this.crtWorld.x, this.crtWorld.y, 130, 0.8);
    }
    
    const doorPt = this.isoToScreen(4.5, 0);
    this.punch(doorPt.x, doorPt.y - 40, 120, 0.5);
    this.punch(this.player.x, this.player.y - 8, 110, 0.32);

    this.lightTex.refresh();
  }

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
      .setScrollFactor(0)
      .setDepth(600)
      .setVisible(false);
    this.tweens.add({ targets: this.promptText, y: '-=3', duration: 600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add
      .text(12, 10, 'WASD / arrows move · E interact', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setScrollFactor(0)
      .setDepth(600)
      .setAlpha(0.8);

    this.exploreText = this.add
      .text(W - 12, 10, 'lessons 0/7', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(600)
      .setAlpha(0.9);

    this.dlgBox = this.add
      .rectangle(400, 548, 768, 88, C_BASE0, 0.95)
      .setStrokeStyle(2, 0xcba6f7)
      .setScrollFactor(0)
      .setDepth(610)
      .setVisible(false);
    this.dlgName = this.add
      .text(36, 512, ' Faye (Voice) ', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#1e1e2e',
        backgroundColor: '#cba6f7',
        padding: { x: 4, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(611)
      .setVisible(false);
    this.dlgText = this.add
      .text(36, 534, '', {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#cdd6f4',
        wordWrap: { width: 700 },
      })
      .setScrollFactor(0)
      .setDepth(611)
      .setVisible(false);
    this.dlgArrow = this.add
      .text(752, 582, '▼', { fontFamily: 'monospace', fontSize: '16px', color: '#cba6f7' })
      .setOrigin(0.5)
      .setScrollFactor(0)
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
  }

  private lineFor(target: InteractableDef): string {
    if (target.id === 'exit') {
      return target.line;
    }
    
    const dir = this.dirs.find(d => d.id === target.id);
    if (!dir) return '';

    if (target.id === this.activeDirId) {
      return "Faye (Voice): Let's dive into " + dir.label + ". " + dir.desc;
    } else {
      const activeDir = this.dirs.find(d => d.id === this.activeDirId);
      const activeLabel = activeDir ? activeDir.label : 'the current lesson';
      return "Faye (Voice): That's " + dir.label + ". " + dir.desc + " It's locked right now. We need to focus on " + activeLabel + " first.";
    }
  }

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

  update(time: number, delta: number): void {
    this.redrawLights();

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
        
        // Trigger React bridge if interacting with the active terminal
        if (target.id === this.activeDirId) {
          this.onInteract?.('root_terminal');
        }
      }
    } else {
      this.promptText.setVisible(false);
    }
  }
}
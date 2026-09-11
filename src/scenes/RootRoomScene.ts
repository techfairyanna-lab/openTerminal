import Phaser from 'phaser';

// ------------------------------------------------------------------
//  RootRoomScene — MINIMAL GREY "BLANK CANVAS" DEMO STATE (Sector 0: /)
//  ====================================================================
//  A completely empty, visually grey/blank room featuring a single giant
//  static Terminal prop in the center displaying "awaiting design... _".
//  Stripped of all NPC dialogues, interactive terminal logic, and extra UI.
// ------------------------------------------------------------------

const W = 800;
const H = 600;
const TILE_W = 64;
const TILE_H = 32;
const WALL_H = 44;
const WALL_THICKNESS = 0.2;
const GRID_W = 9;
const GRID_H = 9;
const ORIGIN_X = 400;
const ORIGIN_Y = 170;

// Minimal Neutral Grey Palette
const C_FLOOR_A = '#383942';     // Flat neutral grey tile A
const C_FLOOR_B = '#303138';     // Flat neutral grey tile B
const C_GRID_LINE = '#25262c';   // Minimal tile divider
const C_WALL = '#282930';        // Minimal grey perimeter wall
const C_WALL_TOP = '#3d3e48';    // Wall top rim
const C_WALL_BASE = '#1b1c20';   // Wall bottom trim
const C_DARK = '#111118';

interface SolidTile {
  x: number;
  y: number;
}

export class RootRoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  // Player starts at bottom-center of the grey room, facing the giant terminal
  private playerGrid = { x: 4, y: 7 };
  private moving = false;
  private moveProxy = { t: 0 };
  private solids: SolidTile[] = [];

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

  create(): void {
    this.makeTextures();
    this.buildCanvasRoom();
    this.buildGiantTerminal();
    this.buildPlayer();
    this.buildInput();

    // Camera setup - smooth follow centered on player in the minimal grey room
    this.cameras.main.setBackgroundColor('#141418');
    this.cameras.main.setBounds(-200, -100, 1200, 800);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.fadeIn(500);
  }

  // ------------------------------------------------------------------
  //  PROCEDURAL TEXTURE GENERATION
  // ------------------------------------------------------------------

  private canvasTexture(
    key: string,
    w: number,
    h: number,
    fn: (ctx: CanvasRenderingContext2D) => void
  ): void {
    if (this.textures.exists(key)) return;
    const ct = this.textures.createCanvas(key, w, h);
    if (!ct) return;
    fn(ct.context);
    ct.refresh();
  }

  private diamondPath(cx: CanvasRenderingContext2D, ox: number, oy: number, w: number, h: number): void {
    cx.beginPath();
    cx.moveTo(ox, oy - h / 2);
    cx.lineTo(ox + w / 2, oy);
    cx.lineTo(ox, oy + h / 2);
    cx.lineTo(ox - w / 2, oy);
    cx.closePath();
  }

  private wallTexture(key: string, fw: number, fh: number, height: number): void {
    const cw = (fw + fh) * (TILE_W / 2);
    const chh = (fw + fh) * (TILE_H / 2);
    this.canvasTexture(key, cw, chh + height, (cx) => {
      const ox = (fh * (TILE_W / 2));
      const oy = 0;
      const ax = ox;
      const ay = oy;
      const bx = ox + (fw * (TILE_W / 2));
      const byy = oy + (fw * (TILE_H / 2));
      const cxp = ox + (fw - fh) * (TILE_W / 2);
      const cyp = oy + (fw + fh) * (TILE_H / 2);
      const dx = ox - (fh * (TILE_W / 2));
      const dy = oy + (fh * (TILE_H / 2));

      // Wall Top
      cx.fillStyle = C_WALL_TOP;
      cx.beginPath();
      cx.moveTo(ax, ay); cx.lineTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(dx, dy);
      cx.closePath(); cx.fill();

      // Wall Left Face
      cx.fillStyle = C_WALL;
      cx.beginPath();
      cx.moveTo(dx, dy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(dx, dy + height);
      cx.closePath(); cx.fill();

      // Wall Right Face
      cx.fillStyle = '#202127';
      cx.beginPath();
      cx.moveTo(bx, byy); cx.lineTo(cxp, cyp); cx.lineTo(cxp, cyp + height); cx.lineTo(bx, byy + height);
      cx.closePath(); cx.fill();

      // Wall Base Rim
      const baseH = 5;
      cx.fillStyle = C_WALL_BASE;
      cx.beginPath();
      cx.moveTo(dx, dy + height - baseH); cx.lineTo(cxp, cyp + height - baseH); cx.lineTo(cxp, cyp + height); cx.lineTo(dx, dy + height);
      cx.closePath(); cx.fill();

      cx.beginPath();
      cx.moveTo(bx, byy + height - baseH); cx.lineTo(cxp, cyp + height - baseH); cx.lineTo(cxp, cyp + height); cx.lineTo(bx, byy + height);
      cx.closePath(); cx.fill();
    });
  }

  private makeTextures(): void {
    const self = this;

    // 1. Isometric Flat Grey Floor Tiles
    const makeFloorTile = (key: string, baseColor: string) => {
      self.canvasTexture(key, TILE_W, TILE_H, (cx) => {
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.fillStyle = baseColor;
        cx.fill();

        // Minimal grey grid divider border
        cx.strokeStyle = C_GRID_LINE;
        cx.lineWidth = 1;
        self.diamondPath(cx, 32, 16, TILE_W, TILE_H);
        cx.stroke();
      });
    };
    makeFloorTile('grey_floora', C_FLOOR_A);
    makeFloorTile('grey_floorb', C_FLOOR_B);

    // 2. Perimeter Minimal Grey Walls
    this.wallTexture('grey_wall_back', 1, WALL_THICKNESS, WALL_H);
    this.wallTexture('grey_wall_side', WALL_THICKNESS, 1, WALL_H);

    // 3. Giant Terminal Prop (Visual-only centerpiece)
    const termW = 280;
    const termH = 220;
    this.canvasTexture('giant_terminal_prop', termW, termH, (cx) => {
      // Pedestal Base (Heavy Industrial Steel Stand)
      cx.fillStyle = '#17181e';
      cx.beginPath();
      cx.moveTo(85, 175);
      cx.lineTo(195, 175);
      cx.lineTo(225, 212);
      cx.lineTo(55, 212);
      cx.closePath();
      cx.fill();

      cx.strokeStyle = '#2b2d37';
      cx.lineWidth = 2;
      cx.stroke();

      // Stand column support
      cx.fillStyle = '#22232b';
      cx.fillRect(116, 148, 48, 30);
      cx.strokeStyle = '#343644';
      cx.lineWidth = 1.5;
      cx.strokeRect(116, 148, 48, 30);

      // Main Outer Terminal Enclosure
      cx.fillStyle = '#1e1f27';
      cx.beginPath();
      cx.roundRect(16, 12, 248, 142, 8);
      cx.fill();
      cx.strokeStyle = '#363847';
      cx.lineWidth = 3;
      cx.stroke();

      // Top ventilation cooling slots
      cx.fillStyle = '#101116';
      for (let vx = 65; vx <= 215; vx += 14) {
        cx.fillRect(vx, 18, 8, 4);
      }

      // Recessed Inner Screen Bezel
      cx.fillStyle = '#0d0e13';
      cx.beginPath();
      cx.roundRect(28, 28, 224, 114, 6);
      cx.fill();

      // Giant CRT Screen (Blank deep black)
      cx.fillStyle = '#050608';
      cx.beginPath();
      cx.roundRect(36, 36, 208, 98, 4);
      cx.fill();

      // Subtle CRT scanlines
      cx.fillStyle = 'rgba(255, 255, 255, 0.035)';
      for (let sy = 38; sy < 132; sy += 3) {
        cx.fillRect(36, sy, 208, 1.5);
      }

      // Glass corner sheen
      cx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      cx.beginPath();
      cx.moveTo(38, 38);
      cx.lineTo(110, 38);
      cx.lineTo(38, 110);
      cx.closePath();
      cx.fill();

      // Power / Status LED dot
      cx.fillStyle = '#22c55e';
      cx.beginPath();
      cx.arc(234, 134, 3, 0, Math.PI * 2);
      cx.fill();

      // Screen Text: Static single line "awaiting design... _"
      cx.fillStyle = '#4ade80';
      cx.font = 'bold 15px "Courier New", monospace';
      cx.fillText('> awaiting design... _', 50, 85);
    });

    // 4. Player Pixel Art
    const HAIR = '#7c5c49';
    const SKIN = '#ffd9b3';
    const HOOD = '#89b4fa';
    const PANT = '#313244';
    const SHOE = '#f5e0dc';
    const EYE = '#1e1e2e';

    const playerFrame = (key: string, dir: 'd' | 'u' | 's', f: number) => {
      if (self.textures.exists(key)) return;
      const ct = self.textures.createCanvas(key, 24, 32);
      if (!ct) return;
      const cx = ct.context;

      const drawBlock = (x: number, y: number, w: number, h: number, color: string) => {
        cx.fillStyle = C_DARK; cx.fillRect(x - 1, y - 1, w + 2, h + 2);
        cx.fillStyle = color; cx.fillRect(x, y, w, h);
      };

      const legs = (frame: number) => {
        if (frame === 0) {
          drawBlock(9, 22, 2, 7, PANT); drawBlock(13, 22, 2, 7, PANT);
          drawBlock(8, 29, 3, 2, SHOE); drawBlock(13, 29, 3, 2, SHOE);
        } else {
          drawBlock(9, 22, 2, 5, PANT); drawBlock(8, 27, 3, 2, SHOE);
          drawBlock(13, 22, 2, 7, PANT); drawBlock(13, 29, 3, 2, SHOE);
        }
      };

      if (dir === 'd') {
        drawBlock(6, 2, 12, 3, HAIR); drawBlock(5, 4, 2, 9, HAIR); drawBlock(17, 4, 2, 9, HAIR);
        drawBlock(8, 5, 8, 6, SKIN); drawBlock(8, 5, 8, 2, HAIR);
        drawBlock(9, 8, 2, 2, EYE); drawBlock(13, 8, 2, 2, EYE);
        drawBlock(7, 11, 10, 7, HOOD); drawBlock(5, 11, 2, 6, HOOD); drawBlock(17, 11, 2, 6, HOOD);
        drawBlock(7, 18, 10, 4, PANT); legs(f);
      } else if (dir === 'u') {
        drawBlock(5, 2, 14, 12, HAIR);
        drawBlock(7, 12, 10, 6, HOOD); drawBlock(7, 18, 10, 4, PANT); legs(f);
      } else {
        drawBlock(6, 2, 9, 11, HAIR); drawBlock(6, 2, 10, 3, HAIR);
        drawBlock(12, 5, 6, 6, SKIN); drawBlock(12, 5, 6, 2, HAIR); drawBlock(15, 8, 2, 2, EYE);
        drawBlock(8, 11, 8, 7, HOOD); drawBlock(10, 12, 3, 6, HOOD); drawBlock(8, 18, 8, 4, PANT);
        if (f === 0) {
          drawBlock(9, 22, 3, 7, PANT); drawBlock(13, 22, 3, 7, PANT);
          drawBlock(9, 29, 4, 2, SHOE); drawBlock(13, 29, 4, 2, SHOE);
        } else {
          drawBlock(9, 22, 3, 7, PANT); drawBlock(9, 29, 4, 2, SHOE);
          drawBlock(14, 22, 3, 5, PANT); drawBlock(14, 27, 4, 2, SHOE);
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

  // ------------------------------------------------------------------
  //  BUILD CANVAS ROOM (Grey floor, grey walls, giant central terminal)
  // ------------------------------------------------------------------

  private buildCanvasRoom(): void {
    this.solids = [];

    // 1. Minimal Grey Grid Floor (9x9)
    for (let gx = 0; gx < GRID_W; gx++) {
      for (let gy = 0; gy < GRID_H; gy++) {
        const tileKey = (gx + gy) % 2 === 0 ? 'grey_floora' : 'grey_floorb';
        const p = this.isoToScreen(gx, gy);
        this.add.sprite(p.x, p.y, tileKey).setOrigin(0.5, 0.5).setDepth(this.computeDepth(gx, gy, 0));
      }
    }

    // 2. Minimal Grey Perimeter Boundary Walls (Top and Left edges)
    for (let gy = 0; gy < GRID_H; gy++) {
      this.addBoxSprite('grey_wall_side', 0, gy, WALL_THICKNESS, 1, -2, WALL_H);
      this.solids.push({ x: 0, y: gy });
    }

    for (let gx = 0; gx < GRID_W; gx++) {
      this.addBoxSprite('grey_wall_back', gx, 0, 1, WALL_THICKNESS, 0, WALL_H);
      this.solids.push({ x: gx, y: 0 });
    }

    // Outer perimeter collision bounds
    for (let gy = 0; gy < GRID_H; gy++) {
      this.solids.push({ x: GRID_W - 1, y: gy });
    }
    for (let gx = 0; gx < GRID_W; gx++) {
      this.solids.push({ x: gx, y: GRID_H - 1 });
    }
  }

  private buildGiantTerminal(): void {
    const centerGx = 4;
    const centerGy = 4;
    const p = this.isoToScreen(centerGx, centerGy);

    // Place the Giant Terminal Prop prominently in the exact center of the room
    const terminal = this.add.sprite(p.x, p.y + 6, 'giant_terminal_prop');
    terminal.setOrigin(0.5, 0.88);
    terminal.setDepth(this.computeDepth(centerGx, centerGy, 15));

    // Solid collision: prevent player from walking through the giant terminal
    this.solids.push({ x: centerGx, y: centerGy });
    this.solids.push({ x: centerGx, y: centerGy - 1 });
  }

  private buildPlayer(): void {
    const p = this.isoToScreen(this.playerGrid.x, this.playerGrid.y);
    this.player = this.physics.add.sprite(p.x, p.y - 8, 'pf_u0');
    this.player.setOrigin(0.5, 0.85);
    this.player.setDepth(this.computeDepth(this.playerGrid.x, this.playerGrid.y, 10));
    this.player.stop();
  }

  private buildInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  // ------------------------------------------------------------------
  //  MOVEMENT SYSTEM
  // ------------------------------------------------------------------

  private isFree(gx: number, gy: number): boolean {
    const outX = Math.min(gx, -1) === gx || Math.max(gx, GRID_W) === gx;
    const outY = Math.min(gy, -1) === gy || Math.max(gy, GRID_H) === gy;
    if (outX || outY) return false;
    return !this.solids.some((s) => s.x === gx && s.y === gy);
  }

  private startMove(dx: number, dy: number, anim: string, flip: boolean): void {
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

  override update(): void {
    if (!this.moving) {
      if (this.cursors.up.isDown || this.keyW.isDown) this.startMove(0, -1, 'walk-up', false);
      else if (this.cursors.down.isDown || this.keyS.isDown) this.startMove(0, 1, 'walk-down', false);
      else if (this.cursors.left.isDown || this.keyA.isDown) this.startMove(-1, 0, 'walk-side', true);
      else if (this.cursors.right.isDown || this.keyD.isDown) this.startMove(1, 0, 'walk-side', false);
      else this.player.stop();
    }
  }
}
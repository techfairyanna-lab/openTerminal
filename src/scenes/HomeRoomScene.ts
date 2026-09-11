import Phaser from 'phaser';

// ------------------------------------------------------------------
//  HomeRoomScene — the "/home" directory.                             
//  A cozy, safe, dark-mode bedroom/office. No scares, just warm       
//  lamplight, CRT glow and a helpful tech fairy named Faye.           
// ------------------------------------------------------------------

interface InteractableDef {
  id: string;
  x: number;
  y: number;
  radius: number;
  prompt: string;
  line: string;
}

interface LightPool {
  sprite: Phaser.GameObjects.Sprite;
  followFairy?: boolean;
  baseX: number;
  baseY: number;
}

const W = 800;
const H = 600;

// Catppuccin-mocha inspired palette
const C_BASE0 = 0x1e1e2e;
const C_BASE1 = 0x313244;
const C_SURFACE = 0x45475a;
const C_OVERLAY = 0x6c7086;
const C_TEXT = 0xcdd6f4;
const C_BLUE = 0x89b4fa;
const C_GREEN = 0xa6e3a1;
const C_PINK = 0xf5c2e7;
const C_MAUVE = 0xcba6f7;
const C_YELLOW = 0xf9e2af;
const C_PEACH = 0xfab387;

export class HomeRoomScene extends Phaser.Scene {
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

  // actors
  private fairy!: Phaser.GameObjects.Sprite;
  private fairyWings!: Phaser.GameObjects.Sprite;
  private fairyGlow!: Phaser.GameObjects.Sprite;
  private fairyBaseX = 580;
  private fairyBaseY = 518;

  // lighting
  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;
  private lightPools: LightPool[] = [];

  // world
  private solids: Phaser.GameObjects.Rectangle[] = [];
  private interactables: InteractableDef[] = [];
  private nearTarget: InteractableDef | null = null;
  private lockUntil = 0;
  private facing: 'down' | 'up' | 'side' = 'down';
  private stepAcc = 0;

  // react bridge
  private onInteract?: (target: string) => void;

  // UI
  private promptText!: Phaser.GameObjects.Text;
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
    super('HomeRoom');
  }

  // ================================================================
  create(): void {
    this.onInteract = this.game.registry.get('onInteract') as
      | ((target: string) => void)
      | undefined;

    this.makeTextures();
    this.buildRoom();
    this.buildActors();
    this.buildLighting();
    this.buildUI();
    this.buildInput();

    this.cameras.main.fadeIn(600);

    // Faye greets the player
    this.time.addEvent({
      delay: 900,
      callback: () =>
        this.openDialogue(
          'Welcome to /home! Go to the computer and press [E] to open the terminal, then head to the root directory.'
        ),
    });
  }

  // ============================ TEXTURES ==========================

  private canvasTexture(
    key: string,
    w: number,
    h: number,
    draw: (ctx: CanvasRenderingContext2D) => void
  ): void {
    if (this.textures.exists(key)) return;
    const ct = this.textures.createCanvas(key, w, h);
    if (!ct) return;
    draw(ct.context);
    ct.refresh();
  }

  private graphicsTexture(
    key: string,
    w: number,
    h: number,
    draw: (g: Phaser.GameObjects.Graphics) => void
  ): void {
    if (this.textures.exists(key)) return;
    const g = this.add.graphics();
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private makeTextures(): void {
    const P = (
      cx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      c: string
    ): void => {
      cx.fillStyle = c;
      cx.fillRect(x, y, w, h);
    };

    // ---- wall: dark blue/purple panels ----
    this.graphicsTexture('wall_blue', 32, 32, (g) => {
      g.fillStyle(C_BASE0, 1);
      g.fillRect(0, 0, 32, 32);
      g.fillStyle(0x232336, 1);
      g.fillRect(0, 0, 2, 32);
      g.fillRect(16, 0, 2, 32);
      g.fillStyle(0x26263a, 1);
      g.fillRect(8, 12, 2, 2);
      g.fillRect(24, 22, 2, 2);
    });

    // ---- floor: dark cozy wood ----
    this.canvasTexture('floor_wood', 32, 32, (cx) => {
      P(cx, 0, 0, 32, 32, '#3b2f2b');
      P(cx, 0, 7, 32, 1, '#2a211f');
      P(cx, 0, 15, 32, 1, '#2a211f');
      P(cx, 0, 23, 32, 1, '#2a211f');
      P(cx, 0, 31, 32, 1, '#2a211f');
      P(cx, 10, 0, 1, 7, '#2a211f');
      P(cx, 22, 8, 1, 7, '#2a211f');
      P(cx, 6, 16, 1, 7, '#2a211f');
      P(cx, 18, 24, 1, 7, '#2a211f');
      P(cx, 4, 3, 3, 1, '#4a3b36');
      P(cx, 24, 11, 3, 1, '#4a3b36');
      P(cx, 12, 19, 3, 1, '#4a3b36');
      P(cx, 26, 27, 3, 1, '#4a3b36');
    });

    // ---- rug ----
    this.canvasTexture('rug', 180, 120, (cx) => {
      P(cx, 0, 0, 180, 120, '#2b2640');
      cx.strokeStyle = '#45407a';
      cx.lineWidth = 6;
      cx.strokeRect(5, 5, 170, 110);
      cx.strokeStyle = '#585090';
      cx.lineWidth = 2;
      cx.strokeRect(14, 14, 152, 92);
      cx.fillStyle = '#3a3363';
      for (let y = 26; y < 100; y += 16) {
        for (let x = 26; x < 160; x += 16) {
          cx.fillRect(x, y, 8, 8);
        }
      }
    });

    // ---- desk ----
    this.canvasTexture('desk', 120, 56, (cx) => {
      P(cx, 0, 0, 120, 56, '#5a4636');
      P(cx, 0, 0, 120, 3, '#6d5844');
      P(cx, 0, 14, 120, 2, '#4a392b');
      P(cx, 0, 28, 120, 2, '#4a392b');
      P(cx, 0, 42, 120, 2, '#4a392b');
      P(cx, 18, 6, 8, 1, '#7a6350');
      P(cx, 70, 20, 10, 1, '#7a6350');
      P(cx, 34, 34, 9, 1, '#7a6350');
      P(cx, 88, 46, 8, 1, '#7a6350');
    });

    // ---- CRT monitor w/ soft blue-green screen ----
    this.canvasTexture('crt_monitor', 44, 38, (cx) => {
      P(cx, 0, 0, 44, 32, '#313244');
      P(cx, 3, 3, 38, 24, '#101820');
      P(cx, 5, 5, 34, 20, '#16222e');
      // tiny terminal lines
      P(cx, 7, 8, 14, 2, '#7dcfff');
      P(cx, 7, 12, 22, 2, '#a6e3a1');
      P(cx, 7, 16, 18, 2, '#7dcfff');
      P(cx, 7, 20, 10, 2, '#a6e3a1');
      // scanlines
      cx.fillStyle = 'rgba(0,0,0,0.25)';
      for (let y = 4; y < 24; y += 2) {
        cx.fillRect(0, y, 44, 1);
      }
    });

    // ---- desk lamp ----
    this.canvasTexture('desk_lamp', 28, 36, (cx) => {
      P(cx, 8, 32, 16, 4, '#45475a');
      cx.strokeStyle = '#6c7086';
      cx.lineWidth = 3;
      cx.beginPath();
      cx.moveTo(15, 32);
      cx.lineTo(13, 16);
      cx.lineTo(19, 8);
      cx.stroke();
      // shade
      cx.fillStyle = '#fab387';
      cx.beginPath();
      cx.moveTo(12, 4);
      cx.lineTo(26, 4);
      cx.lineTo(30, 12);
      cx.lineTo(8, 12);
      cx.closePath();
      cx.fill();
      // bulb
      cx.fillStyle = '#ffd86a';
      cx.beginPath();
      cx.arc(19, 12, 4, 0, Math.PI * 2);
      cx.fill();
    });

    // ---- filing cabinet ----
    this.canvasTexture('cabinet', 44, 60, (cx) => {
      P(cx, 0, 0, 44, 60, '#45475a');
      P(cx, 3, 3, 38, 16, '#585b70');
      P(cx, 3, 22, 38, 16, '#585b70');
      P(cx, 3, 41, 38, 16, '#585b70');
      P(cx, 16, 9, 12, 3, '#bac2de');
      P(cx, 16, 28, 12, 3, '#bac2de');
      P(cx, 16, 47, 12, 3, '#bac2de');
      P(cx, 30, 4, 8, 6, '#f5e0dc');
    });

    // ---- trash can / downloads chute ----
    this.canvasTexture('trash', 26, 28, (cx) => {
      cx.fillStyle = '#585b70';
      cx.beginPath();
      cx.moveTo(2, 6);
      cx.lineTo(24, 6);
      cx.lineTo(21, 28);
      cx.lineTo(5, 28);
      cx.closePath();
      cx.fill();
      P(cx, 0, 4, 26, 4, '#6c7086');
      // crumpled paper
      P(cx, 6, 1, 5, 4, '#f5e0dc');
      P(cx, 14, 0, 6, 5, '#e6e0f0');
      // down-arrow = downloads!
      cx.fillStyle = '#a6e3a1';
      cx.fillRect(12, 12, 3, 8);
      cx.beginPath();
      cx.moveTo(8, 19);
      cx.lineTo(18, 19);
      cx.lineTo(13, 25);
      cx.closePath();
      cx.fill();
    });

    // ---- framed photos ----
    this.canvasTexture('photo_a', 26, 30, (cx) => {
      P(cx, 0, 0, 26, 30, '#7f849c');
      P(cx, 3, 3, 20, 24, '#89dceb');
      P(cx, 3, 17, 20, 10, '#74c7ec');
      cx.fillStyle = '#5a9fd4';
      cx.beginPath();
      cx.moveTo(6, 27);
      cx.lineTo(12, 14);
      cx.lineTo(18, 27);
      cx.closePath();
      cx.fill();
      P(cx, 17, 6, 4, 4, '#f9e2af');
    });
    this.canvasTexture('photo_b', 26, 30, (cx) => {
      P(cx, 0, 0, 26, 30, '#b48ead');
      P(cx, 3, 3, 20, 24, '#2b2640');
      // little pixel cat
      P(cx, 8, 14, 10, 7, '#f5e0dc');
      P(cx, 8, 10, 8, 5, '#f5e0dc');
      P(cx, 8, 8, 2, 3, '#f5e0dc');
      P(cx, 14, 8, 2, 3, '#f5e0dc');
      P(cx, 10, 12, 1, 1, '#1e1e2e');
      P(cx, 13, 12, 1, 1, '#1e1e2e');
      P(cx, 18, 16, 3, 2, '#f5e0dc');
    });

    // ---- notes.txt paper ----
    this.canvasTexture('paper', 14, 16, (cx) => {
      P(cx, 0, 0, 14, 16, '#f5e0dc');
      P(cx, 2, 3, 10, 1, '#9399b2');
      P(cx, 2, 6, 10, 1, '#9399b2');
      P(cx, 2, 9, 8, 1, '#9399b2');
      P(cx, 2, 12, 10, 1, '#9399b2');
    });

    // ---- .bashrc sticky note ----
    this.canvasTexture('sticky', 14, 14, (cx) => {
      P(cx, 0, 0, 14, 14, '#a6e3a1');
      P(cx, 10, 10, 4, 4, '#7fbf7a');
      P(cx, 2, 3, 10, 1, '#3a6b3a');
      P(cx, 2, 6, 8, 1, '#3a6b3a');
      P(cx, 2, 9, 10, 1, '#3a6b3a');
    });

    // ---- wooden door (exit to /) ----
    this.canvasTexture('door_wood', 28, 64, (cx) => {
      P(cx, 0, 0, 28, 64, '#5a4636');
      P(cx, 4, 5, 20, 24, '#4a392b');
      P(cx, 4, 35, 20, 24, '#4a392b');
      P(cx, 3, 30, 4, 4, '#f9e2af');
      cx.strokeStyle = '#3b2f2b';
      cx.lineWidth = 2;
      cx.strokeRect(1, 1, 26, 62);
    });

    // ---- doormat ----
    this.canvasTexture('doormat', 24, 40, (cx) => {
      P(cx, 0, 0, 24, 40, '#45407a');
      cx.strokeStyle = '#585090';
      cx.lineWidth = 2;
      cx.strokeRect(3, 3, 18, 34);
    });

    // ---- soft radial glow ----
   this.canvasTexture('glow_radial', 128, 128, function (cx) {
      const gr = cx.createRadialGradient(64, 64, 4, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.5, 'rgba(255,255,255,0.45)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = gr;
      cx.fillRect(0, 0, 128, 128);
    });
    // ---- Faye the tech fairy ----
    this.canvasTexture('fairy_wings', 24, 20, (cx) => {
      cx.fillStyle = 'rgba(245,194,231,0.55)';
      cx.beginPath();
      cx.ellipse(7, 9, 5, 8, -0.4, 0, Math.PI * 2);
      cx.fill();
      cx.beginPath();
      cx.ellipse(17, 9, 5, 8, 0.4, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = 'rgba(203,166,247,0.5)';
      cx.beginPath();
      cx.ellipse(8, 12, 3, 5, -0.5, 0, Math.PI * 2);
      cx.fill();
      cx.beginPath();
      cx.ellipse(16, 12, 3, 5, 0.5, 0, Math.PI * 2);
      cx.fill();
    });
    this.canvasTexture('fairy', 20, 24, (cx) => {
      // dress
      cx.fillStyle = '#f5c2e7';
      cx.beginPath();
      cx.moveTo(10, 9);
      cx.lineTo(4, 20);
      cx.lineTo(16, 20);
      cx.closePath();
      cx.fill();
      P(cx, 8, 18, 2, 4, '#ffe3d6');
      P(cx, 12, 18, 2, 4, '#ffe3d6');
      // head
      cx.fillStyle = '#ffe3d6';
      cx.beginPath();
      cx.arc(10, 6, 4, 0, Math.PI * 2);
      cx.fill();
      // hair
      cx.fillStyle = '#cba6f7';
      cx.beginPath();
      cx.arc(10, 4, 4, Math.PI, 0);
      cx.fill();
      P(cx, 5, 4, 2, 8, '#cba6f7');
      P(cx, 13, 4, 2, 8, '#cba6f7');
      // eyes
      P(cx, 8, 6, 1, 2, '#1e1e2e');
      P(cx, 11, 6, 1, 2, '#1e1e2e');
      // tiny wand
      cx.strokeStyle = '#f9e2af';
      cx.lineWidth = 1;
      cx.beginPath();
      cx.moveTo(16, 12);
      cx.lineTo(19, 9);
      cx.stroke();
      P(cx, 18, 7, 2, 2, '#f9e2af');
    });

    // ---- player (cozy hoodie) ----
    const HAIR = '#7c5c49';
    const SKIN = '#ffd9b3';
    const HOOD = '#89b4fa';
    const PANT = '#313244';
    const SHOE = '#f5e0dc';
    const EYE = '#1e1e2e';
    const legs = (cx: CanvasRenderingContext2D, f: number): void => {
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
    const playerFrame = (key: string, dir: 'd' | 'u' | 's', f: number): void => {
      if (this.textures.exists(key)) return;
      const ct = this.textures.createCanvas(key, 24, 32);
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
        P(cx, 5, 17, 2, 2, SKIN);
        P(cx, 17, 17, 2, 2, SKIN);
        P(cx, 7, 18, 10, 4, PANT);
        if (f === 1) {
          P(cx, 5, 11, 2, 7, HOOD);
          P(cx, 5, 18, 2, 2, SKIN);
          P(cx, 17, 11, 2, 5, HOOD);
          P(cx, 17, 16, 2, 2, SKIN);
        }
        legs(cx, f);
      } else if (dir === 'u') {
        P(cx, 5, 2, 14, 12, HAIR);
        P(cx, 7, 12, 10, 6, HOOD);
        P(cx, 5, 12, 2, 6, HOOD);
        P(cx, 17, 12, 2, 6, HOOD);
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
        P(cx, 10, 18, 3, 2, SKIN);
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
      this.anims.create({
        key: 'walk-down',
        frames: [{ key: 'pf_d0' }, { key: 'pf_d1' }],
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: 'walk-up',
        frames: [{ key: 'pf_u0' }, { key: 'pf_u1' }],
        frameRate: 6,
        repeat: -1,
      });
      this.anims.create({
        key: 'walk-side',
        frames: [{ key: 'pf_s0' }, { key: 'pf_s1' }],
        frameRate: 6,
        repeat: -1,
      });
    }
  }

  // ============================= ROOM =============================

  private addSolid(x: number, y: number, w: number, h: number): void {
    const rect = this.add.rectangle(x, y, w, h, C_BASE0, 0);
    this.physics.add.existing(rect, true);
    this.solids.push(rect);
  }

  private addLabel(
    str: string,
    x: number,
    y: number,
    color: string = '#cdd6f4',
    depth: number = 490,
    alpha: number = 0.9
  ): Phaser.GameObjects.Text {
    return this.add
      .text(x, y, str, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color,
        backgroundColor: 'rgba(17,17,27,0.75)',
        padding: { x: 3, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(depth)
      .setAlpha(alpha);
  }

  private buildRoom(): void {
    // floor + rug
    this.add.tileSprite(W / 2, H / 2, W, H, 'floor_wood').setDepth(0);
    this.add.image(340, 440, 'rug').setDepth(1);

    // walls
    this.add.tileSprite(400, 32, 800, 64, 'wall_blue').setDepth(6);
    this.add.tileSprite(16, 300, 32, 600, 'wall_blue').setDepth(6);
    this.add.tileSprite(784, 300, 32, 600, 'wall_blue').setDepth(6);
    this.add.tileSprite(400, 584, 800, 32, 'wall_blue').setDepth(6);
    // baseboards
    this.add.rectangle(400, 62, 800, 4, C_BASE1).setDepth(7);
    this.add.rectangle(30, 300, 4, 600, C_BASE1).setDepth(7);
    this.add.rectangle(770, 300, 4, 600, C_BASE1).setDepth(7);
    this.add.rectangle(400, 570, 800, 4, C_BASE1).setDepth(7);

    // door on right wall (exit to /)
    this.add.image(784, 300, 'door_wood').setDepth(8);
    this.add.image(760, 300, 'doormat').setDepth(2);
    this.addLabel('/', 784, 258, '#f9e2af', 9);

    // filing cabinet vs back wall
    this.add.image(250, 96, 'cabinet').setDepth(96);
    this.addLabel('Documents/', 250, 132);

    // framed photos on back wall
    this.add.image(410, 40, 'photo_a').setDepth(9);
    this.add.image(444, 44, 'photo_b').setDepth(9);
    this.addLabel('Pictures/', 428, 66);

    // desk cluster
    this.add.image(585, 412, 'sticky').setDepth(400).setAlpha(0.8);
    this.addLabel('.bashrc', 585, 428, '#a6e3a1', 502, 0.8);
    this.add.image(560, 390, 'desk').setDepth(420);
    this.add.image(545, 362, 'crt_monitor').setDepth(362);
    this.add.image(602, 358, 'desk_lamp').setDepth(358);
    this.add.image(516, 396, 'paper').setDepth(421).setAngle(-4);
    this.addLabel('notes.txt', 516, 380, '#e6e0f0', 422);

    // trash can next to desk
    this.add.image(655, 452, 'trash').setDepth(452);
    this.addLabel('Downloads/', 655, 472);

    // physics solids
    this.addSolid(400, 32, 800, 64);
    this.addSolid(16, 300, 32, 600);
    this.addSolid(784, 300, 32, 600);
    this.addSolid(400, 584, 800, 32);
    this.addSolid(560, 390, 120, 56);
    this.addSolid(250, 100, 44, 52);
    this.addSolid(655, 452, 26, 24);

    // interactables
    this.interactables = [
      {
        id: 'computer',
        x: 545,
        y: 372,
        radius: 62,
        prompt: '[E] Log in to terminal',
        line: 'Logging you in! The terminal is your window to the whole system.',
      },
      {
        id: 'cabinet',
        x: 250,
        y: 104,
        radius: 58,
        prompt: '[E] Open Documents/',
        line: "That's Documents/. Everything you've ever saved is filed neatly in there.",
      },
      {
        id: 'trash',
        x: 655,
        y: 452,
        radius: 54,
        prompt: '[E] Check Downloads/',
        line: 'Downloads/! Fresh stuff from the internet lands in that bin. Careful what you run.',
      },
      {
        id: 'pictures',
        x: 428,
        y: 80,
        radius: 54,
        prompt: '[E] Browse Pictures/',
        line: 'Pictures/! Memories, rendered in glorious 24-bit color.',
      },
      {
        id: 'notes',
        x: 516,
        y: 396,
        radius: 48,
        prompt: '[E] Read notes.txt',
        line: "notes.txt — your quick thoughts. Don't worry, I never peek. Much.",
      },
      {
        id: 'bashrc',
        x: 585,
        y: 414,
        radius: 48,
        prompt: '[E] cat .bashrc',
        line: 'Ooh, you found a hidden file! .bashrc configures your shell every time you wake up.',
      },
      {
        id: 'door',
        x: 768,
        y: 300,
        radius: 58,
        prompt: '[E] Exit to /',
        line: 'That door leads to / — the root directory. The whole filesystem is out there!',
      },
    ];
  }

  private buildActors(): void {
    this.player = this.physics.add.sprite(220, 430, 'pf_d0');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(12, 10);
    this.player.body!.offset.set(6, 21);
    this.solids.forEach((s) => this.physics.add.collider(this.player, s));

    // Faye hovers near the desk
    this.fairyWings = this.add
      .sprite(this.fairyBaseX, this.fairyBaseY, 'fairy_wings')
      .setDepth(this.fairyBaseY - 2);
    this.fairy = this.add
      .sprite(this.fairyBaseX, this.fairyBaseY, 'fairy')
      .setDepth(this.fairyBaseY - 1);
    this.tweens.add({
      targets: this.fairy,
      y: this.fairyBaseY - 6,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.fairy,
      x: this.fairyBaseX + 20,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.tweens.add({
      targets: this.fairyWings,
      alpha: 0.55,
      duration: 320,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  // =========================== LIGHTING ===========================

  private buildLighting(): void {
    const existing = this.textures.exists('lightmap');
    this.lightTex = existing
      ? (this.textures.get('lightmap') as Phaser.Textures.CanvasTexture)
      : this.textures.createCanvas('lightmap', W, H)!;
    this.lightCtx = this.lightTex.context;

    // darkness overlay — multiply blend
    this.add.image(W / 2, H / 2, 'lightmap').setBlendMode(Phaser.BlendModes.MULTIPLY).setDepth(500);

    // warm + cool light pools — screen blend
    const makePool = (
      x: number,
      y: number,
      tint: number,
      scale: number,
      alpha: number,
      followFairy = false
    ): void => {
      const sprite = this.add
        .sprite(x, y, 'glow_radial')
        .setTint(tint)
        .setScale(scale)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.SCREEN)
        .setDepth(501);
      this.lightPools.push({ sprite, followFairy, baseX: x, baseY: y });
    };
    makePool(602, 360, C_YELLOW, 2.6, 0.3); // desk lamp warm
    makePool(545, 362, C_BLUE, 2.0, 0.26); // CRT cool
    makePool(this.fairyBaseX, this.fairyBaseY, C_PINK, 1.1, 0.3, true); // Faye
    makePool(585, 412, C_GREEN, 0.55, 0.22); // .bashrc hidden glow
    this.tweens.add({
      targets: this.lightPools[3].sprite,
      alpha: 0.34,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    makePool(784, 300, C_PEACH, 0.8, 0.12); // draft under the door
  }

  private punch(x: number, y: number, r: number, strength: number): void {
    const cx = this.lightCtx;
    cx.save();
    cx.globalCompositeOperation = 'lighter';
    const gr = cx.createRadialGradient(x, y, r * 0.1, x, y, r);
    gr.addColorStop(0, `rgba(255,255,255,${strength})`);
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
    // cozy dim ambient, slightly cool
    cx.fillStyle = 'rgb(118,118,150)';
    cx.fillRect(0, 0, W, H);
    this.punch(602, 360, 180, 0.9); // lamp
    this.punch(545, 362, 140, 0.75); // crt
    this.punch(this.player.x, this.player.y, 110, 0.32); // personal space
    this.punch(this.fairy.x, this.fairy.y, 90, 0.5); // fairy
    this.punch(585, 412, 55, 0.3); // bashrc
    this.punch(784, 300, 70, 0.2); // door
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
    this.tweens.add({
      targets: this.promptText,
      y: '-=3',
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.add
      .text(12, 10, 'WASD / arrows move · E interact', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setDepth(600)
      .setAlpha(0.8);

    // RPG dialogue box
    this.dlgBox = this.add
      .rectangle(400, 548, 768, 88, C_BASE0, 0.95)
      .setStrokeStyle(2, C_PINK)
      .setDepth(610)
      .setVisible(false);
    this.dlgName = this.add
      .text(36, 512, ' Faye ', {
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
      .text(752, 582, '▼', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#f5c2e7',
      })
      .setOrigin(0.5)
      .setDepth(611)
      .setVisible(false);
    this.tweens.add({
      targets: this.dlgArrow,
      alpha: 0.1,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
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
    while (this.dlgAcc > 18 && this.dlgShown < this.dlgFull.length) {
      this.dlgAcc -= 18;
      this.dlgShown++;
    }
    if (this.dlgShown >= this.dlgFull.length) {
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

  // ============================ UPDATE ============================

  update(time: number, delta: number): void {
    this.redrawLights();

    // fairy wings + glow follow the fairy
    this.fairyWings.setPosition(this.fairy.x, this.fairy.y);
    this.fairy.setDepth(this.fairy.y - 1);
    this.fairyWings.setDepth(this.fairy.y - 2);
    for (const pool of this.lightPools) {
      if (pool.followFairy) pool.sprite.setPosition(this.fairy.x, this.fairy.y);
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    // dialogue mode: freeze + advance
    if (this.dlgActive) {
      body.setVelocity(0, 0);
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

    // movement: WASD + arrows, top-down
    const speed = 170;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.keyD.isDown) vx = speed;
    if (this.cursors.up.isDown || this.keyW.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.keyS.isDown) vy = speed;
    body.setVelocity(vx, vy);

    const moving = vx !== 0 || vy !== 0;
    if (moving) {
      this.stepAcc += delta;
      if (this.stepAcc > 320) this.stepAcc = 0;
      if (Math.abs(vx) > Math.abs(vy)) {
        this.facing = 'side';
        this.player.setFlipX(vx < 0);
        this.player.play('walk-side', true);
      } else if (vy > 0) {
        this.facing = 'down';
        this.player.play('walk-down', true);
      } else {
        this.facing = 'up';
        this.player.play('walk-up', true);
      }
    } else {
      this.player.stop();
      this.player.setTexture(
        this.facing === 'side' ? 'pf_s0' : this.facing === 'up' ? 'pf_u0' : 'pf_d0'
      );
    }
    this.player.setDepth(this.player.y);

    // nearest interactable
    this.nearTarget = null;
    let best = Infinity;
    for (const def of this.interactables) {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, def.x, def.y);
      if (d < def.radius && d < best) {
        best = d;
        this.nearTarget = def;
      }
    }

    if (this.nearTarget) {
      this.promptText.setText(this.nearTarget.prompt);
      this.promptText.setPosition(this.player.x, this.player.y - 44);
      this.promptText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE) && this.time.now > this.lockUntil) {
        const target = this.nearTarget;
        this.openDialogue(target.line);
        if (target.id === 'computer') {
          this.onInteract?.('computer');
        }
      }
    } else {
      this.promptText.setVisible(false);
    }
  }
}
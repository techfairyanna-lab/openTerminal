import Phaser from 'phaser';

// ------------------------------------------------------------------
//  DocumentsScene — the "/home/Documents" directory.
//  A claustrophobic, dark blue archive room with very tall walls
//  and a floor completely buried in scattered paper files.
//  Follows the technical standard for destination-out lighting.
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
  followPlayer?: boolean;
  baseX: number;
  baseY: number;
}

const W = 800;
const H = 600;

const C_BASE0 = 0x1e1e2e;
const C_BLUE = 0x89b4fa;
const C_TEAL = 0x94e2d5;

export class DocumentsScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;

  private lightTex!: Phaser.Textures.CanvasTexture;
  private lightCtx!: CanvasRenderingContext2D;
  private lightPools: LightPool[] = [];

  private solids: Phaser.GameObjects.Rectangle[] = [];
  private interactables: InteractableDef[] = [];
  private nearTarget: InteractableDef | null = null;
  private lockUntil = 0;

  private promptText!: Phaser.GameObjects.Text;
  private dlgBox!: Phaser.GameObjects.Rectangle;
  private dlgText!: Phaser.GameObjects.Text;
  private dlgArrow!: Phaser.GameObjects.Text;
  private dlgActive = false;
  private dlgFull = '';
  private dlgShown = 0;
  private dlgAcc = 0;
  private dlgDone = false;

  constructor() {
    super('Documents');
  }

  create(): void {
    this.makeTextures();
    this.buildRoom();
    this.buildActors();
    this.buildLighting();
    this.buildUI();
    this.buildInput();

    this.cameras.main.fadeIn(600);
    this.time.addEvent({
      delay: 800,
      callback: () => this.openDialogue('The Documents archive. It\'s a mess in here. Find the glowing files.'),
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

  private makeTextures(): void {
    this.canvasTexture('floor_dark', 32, 32, (cx) => {
      cx.fillStyle = '#11111b';
      cx.fillRect(0, 0, 32, 32);
      cx.strokeStyle = '#1e1e2e';
      cx.lineWidth = 1;
      cx.strokeRect(0, 0, 32, 32);
    });

    this.canvasTexture('paper', 16, 20, (cx) => {
      cx.fillStyle = '#cdd6f4';
      cx.fillRect(0, 0, 16, 20);
      cx.fillStyle = '#585b70';
      cx.fillRect(2, 3, 12, 1);
      cx.fillRect(2, 6, 10, 1);
      cx.fillRect(2, 9, 12, 1);
      cx.fillRect(2, 12, 8, 1);
      // shadow
      cx.fillStyle = 'rgba(0,0,0,0.4)';
      cx.fillRect(1, 20, 16, 2);
      cx.fillRect(16, 1, 2, 20);
    });

    this.canvasTexture('paper_glow', 16, 20, (cx) => {
      cx.fillStyle = '#89dceb';
      cx.fillRect(0, 0, 16, 20);
      cx.fillStyle = '#ffffff';
      cx.fillRect(2, 3, 12, 1);
      cx.fillRect(2, 6, 10, 1);
      cx.fillRect(2, 9, 12, 1);
      // bright core
      cx.fillStyle = 'rgba(255,255,255,0.6)';
      cx.fillRect(4, 4, 8, 12);
    });

    this.canvasTexture('cabinet', 48, 64, (cx) => {
      cx.fillStyle = '#313244';
      cx.fillRect(0, 0, 48, 64);
      cx.fillStyle = '#45475a';
      cx.fillRect(4, 4, 40, 16);
      cx.fillRect(4, 24, 40, 16);
      cx.fillRect(4, 44, 40, 16);
      // handles
      cx.fillStyle = '#bac2de';
      cx.fillRect(20, 10, 8, 4);
      cx.fillRect(20, 30, 8, 4);
      cx.fillRect(20, 50, 8, 4);
      // outline
      cx.strokeStyle = '#11111b';
      cx.lineWidth = 2;
      cx.strokeRect(0, 0, 48, 64);
    });

    this.canvasTexture('glow_radial', 128, 128, (cx) => {
      const gr = cx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,255,255,1)');
      gr.addColorStop(0.3, 'rgba(255,255,255,0.6)');
      gr.addColorStop(0.7, 'rgba(255,255,255,0.2)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      cx.fillStyle = gr;
      cx.fillRect(0, 0, 128, 128);
    });
    
    this.canvasTexture('player_docs', 24, 32, (cx) => {
      cx.fillStyle = '#1e1e2e';
      cx.fillRect(4, 8, 16, 20);
      cx.fillStyle = '#89b4fa';
      cx.fillRect(6, 4, 12, 8);
      cx.fillStyle = '#cdd6f4';
      cx.fillRect(8, 6, 8, 4);
    });
  }

  // ============================= ROOM =============================

  private addSolid(x: number, y: number, w: number, h: number): void {
    const rect = this.add.rectangle(x, y, w, h, 0x000000, 0);
    this.physics.add.existing(rect, true);
    this.solids.push(rect);
  }

  private buildRoom(): void {
    // Floor
    this.add.tileSprite(400, 300, 400, 400, 'floor_dark').setDepth(0);
    
    // Scatter normal papers everywhere
    for (let i = 0; i < 120; i++) {
      const x = Phaser.Math.Between(210, 590);
      const y = Phaser.Math.Between(110, 490);
      const angle = Phaser.Math.Between(-60, 60);
      this.add.image(x, y, 'paper').setAngle(angle).setDepth(5);
    }

    // Cabinets
    this.add.image(250, 150, 'cabinet').setDepth(10);
    this.add.image(550, 150, 'cabinet').setDepth(10);
    this.add.image(250, 450, 'cabinet').setDepth(10);
    
    // Glowing papers (Light sources)
    this.add.image(350, 250, 'paper_glow').setAngle(15).setDepth(12);
    this.add.image(480, 380, 'paper_glow').setAngle(-20).setDepth(12);

    // Tall Walls (drawn with graphics for perfect 3D ledge effect)
    const g = this.add.graphics().setDepth(20);
    
    // Top Wall
    g.fillStyle(0x313244, 1);
    g.fillRect(136, 36, 528, 64);
    g.fillStyle(0x11111b, 1); // Deep inner shadow
    g.fillRect(200, 88, 400, 12); 
    
    // Bottom Wall
    g.fillStyle(0x313244, 1);
    g.fillRect(136, 500, 528, 64);
    g.fillStyle(0x11111b, 1); 
    g.fillRect(200, 500, 400, 12);

    // Left Wall
    g.fillStyle(0x313244, 1);
    g.fillRect(136, 100, 64, 400);
    g.fillStyle(0x11111b, 1); 
    g.fillRect(188, 100, 12, 400);

    // Right Wall
    g.fillStyle(0x313244, 1);
    g.fillRect(600, 100, 64, 400);
    g.fillStyle(0x11111b, 1); 
    g.fillRect(600, 100, 12, 400);

    // Outer void (pure black)
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0, W, 36);
    g.fillRect(0, 564, W, 36);
    g.fillRect(0, 0, 136, H);
    g.fillRect(664, 0, 136, H);

    // Solids for walls
    this.addSolid(400, 68, 528, 64); // Top
    this.addSolid(400, 532, 528, 64); // Bottom
    this.addSolid(168, 300, 64, 400); // Left
    this.addSolid(632, 300, 64, 400); // Right
    
    // Solids for cabinets
    this.addSolid(250, 150, 48, 64);
    this.addSolid(550, 150, 48, 64);
    this.addSolid(250, 450, 48, 64);

    // Interactables
    this.interactables = [
      { id: 'glow1', x: 350, y: 250, radius: 40, prompt: '[E] Read glowing file', line: 'A forgotten memory. It glows with residual data.' },
      { id: 'glow2', x: 480, y: 380, radius: 40, prompt: '[E] Read glowing file', line: 'An encrypted receipt. The ink is still warm.' },
      { id: 'exit', x: 400, y: 480, radius: 50, prompt: '[E] Exit to /home', line: 'Returning to the safety of /home.' },
    ];
    
    // Exit door marker on bottom wall
    this.add.rectangle(400, 500, 60, 12, 0x89b4fa).setDepth(15);
  }

  private buildActors(): void {
    this.player = this.physics.add.sprite(400, 400, 'player_docs');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(16, 16);
    this.player.body!.offset.set(4, 12);
    this.player.setDepth(50);
    this.solids.forEach((s) => this.physics.add.collider(this.player, s));
  }

  // =========================== LIGHTING ===========================

  private buildLighting(): void {
    this.lightTex = this.textures.createCanvas('lightmap_docs', W, H)!;
    this.lightCtx = this.lightTex.context;
    this.add.image(W / 2, H / 2, 'lightmap_docs').setDepth(500);

    const makePool = (x: number, y: number, tint: number, scale: number, alpha: number, followPlayer = false) => {
      const sprite = this.add.sprite(x, y, 'glow_radial')
        .setTint(tint)
        .setScale(scale)
        .setAlpha(alpha)
        .setBlendMode(Phaser.BlendModes.SCREEN)
        .setDepth(501);
      this.lightPools.push({ sprite, followPlayer, baseX: x, baseY: y });
    };

    makePool(350, 250, C_TEAL, 2.5, 0.6); // Glowing paper 1
    makePool(480, 380, C_BLUE, 2.5, 0.6); // Glowing paper 2
    makePool(400, 300, 0xffffff, 4.0, 0.15); // Dim ambient ceiling light
    makePool(0, 0, C_TEAL, 2.0, 0.8, true); // Player flashlight
  }

  private punch(x: number, y: number, r: number, strength: number): void {
    const cx = this.lightCtx;
    const gr = cx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(255,255,255,${strength})`);
    gr.addColorStop(0.6, `rgba(255,255,255,${strength * 0.4})`);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    cx.fillStyle = gr;
    cx.beginPath();
    cx.arc(x, y, r, 0, Math.PI * 2);
    cx.fill();
  }

  private redrawLights(): void {
    const cx = this.lightCtx;
    
    cx.clearRect(0, 0, W, H);
    
    // Deep dark blue ambient
    cx.fillStyle = 'rgba(5, 10, 25, 0.96)';
    cx.fillRect(0, 0, W, H);
    
    cx.globalCompositeOperation = 'destination-out';
    
    this.punch(350, 250, 160, 1.0);
    this.punch(480, 380, 160, 1.0);
    this.punch(400, 300, 250, 0.4);
    this.punch(this.player.x, this.player.y, 140, 0.9);
    
    cx.globalCompositeOperation = 'source-over';
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

    this.add
      .text(12, 10, 'WASD / arrows move · E interact', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#6c7086',
      })
      .setDepth(600)
      .setAlpha(0.8);

    this.dlgBox = this.add
      .rectangle(400, 548, 768, 88, C_BASE0, 0.95)
      .setStrokeStyle(2, C_BLUE)
      .setDepth(610)
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
        color: '#89b4fa',
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
    this.dlgText.setVisible(false);
    this.dlgArrow.setVisible(false);
    this.lockUntil = this.time.now + 250;
  }

  // ============================ UPDATE ============================

  update(time: number, delta: number): void {
    this.redrawLights();
    
    for (const pool of this.lightPools) {
      if (pool.followPlayer) pool.sprite.setPosition(this.player.x, this.player.y);
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.dlgActive) {
      body.setVelocity(0, 0);
      this.stepDialogue(delta);
      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.advanceDialogue();
      }
      return;
    }

    const speed = 160;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.keyD.isDown) vx = speed;
    if (this.cursors.up.isDown || this.keyW.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.keyS.isDown) vy = speed;
    
    if (vx !== 0 && vy !== 0) {
       vx *= 0.707;
       vy *= 0.707;
    }
    
    body.setVelocity(vx, vy);
    this.player.setDepth(this.player.y);

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
      this.promptText.setPosition(this.player.x, this.player.y - 30);
      this.promptText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE) && this.time.now > this.lockUntil) {
        this.openDialogue(this.nearTarget.line);
        if (this.nearTarget.id === 'exit') {
           // this.scene.start('IsoHomeRoom');
        }
      }
    } else {
      this.promptText.setVisible(false);
    }
  }
}
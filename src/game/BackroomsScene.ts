import Phaser from 'phaser';
import { gameManager, ROOMS_DATA } from '../engine/GameManager';
import { soundManager } from '../audio/SoundManager';

export class BackroomsScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container;
  private playerBody!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    interact: Phaser.Input.Keyboard.Key;
  };

  private currentRoomId: string = 'root';
  private roomTitleText!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private terminalConsole!: Phaser.GameObjects.Container;
  private exitDoor!: Phaser.GameObjects.Container;
  private glitchAnomaly?: Phaser.GameObjects.Container;
  private fairySprite!: Phaser.GameObjects.Container;
  
  private isNearTerminal: boolean = false;
  private isNearDoor: boolean = false;

  constructor() {
    super('BackroomsScene');
  }

  create() {
    this.createProceduralTextures();

    // Background Room Floor & Wallpaper
    this.drawRoomLayout();

    // Spawn Terminal Console
    this.createTerminalConsole();

    // Spawn Portal Exit Door
    this.createExitDoor();

    // Spawn Fairy Light Companion in Phaser scene
    this.createFairyCompanion();

    // Spawn Player Character
    this.createPlayer();

    // Keyboard Input Setup
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        interact: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      };
    }

    // UI Overlay Text in Phaser
    this.roomTitleText = this.add.text(20, 20, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#f59e0b',
    }).setDepth(100);

    this.promptText = this.add.text(400, 530, 'Press [E] or [SPACE] to interact with Terminal Console', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '14px',
      color: '#00ffcc',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 6 },
    }).setOrigin(0.5).setDepth(100).setVisible(false);

    // Subscribe to GameManager state changes
    gameManager.subscribe(() => {
      const room = gameManager.getCurrentRoom();
      if (room.id !== this.currentRoomId) {
        this.currentRoomId = room.id;
        this.drawRoomLayout();
        this.updateDoorState();
        this.updateAnomalyState();
      }
    });

    // Initial update
    this.drawRoomLayout();
    this.updateDoorState();
    this.updateAnomalyState();
  }

  private createProceduralTextures() {
    // Player pixel art texture
    const gfx = this.make.graphics({ x: 0, y: 0 }, false);

    // CRT Screen Texture
    gfx.fillStyle(0x0a192f, 1);
    gfx.fillRect(0, 0, 48, 36);
    gfx.lineStyle(2, 0x00ffcc, 1);
    gfx.strokeRect(0, 0, 48, 36);
    gfx.generateTexture('crt_console', 48, 36);
    gfx.clear();

    // Door Frame Texture
    gfx.fillStyle(0x1e293b, 1);
    gfx.fillRect(0, 0, 40, 70);
    gfx.lineStyle(3, 0x64748b, 1);
    gfx.strokeRect(0, 0, 40, 70);
    gfx.generateTexture('door_frame', 40, 70);
    gfx.clear();

    gfx.destroy();
  }

  private drawRoomLayout() {
    const room = gameManager.getCurrentRoom();
    this.children.removeAll(false); // Clean up non-persistent

    // Room boundaries
    const width = 800;
    const height = 600;

    // Floor background
    const floor = this.add.graphics();
    floor.fillStyle(Phaser.Display.Color.HexStringToColor(room.floorColor).color, 1);
    floor.fillRect(50, 50, width - 100, height - 100);

    // Grid lines for retro tile feel
    floor.lineStyle(1, 0xffffff, 0.05);
    for (let x = 50; x <= width - 50; x += 40) {
      floor.lineBetween(x, 50, x, height - 50);
    }
    for (let y = 50; y <= height - 50; y += 40) {
      floor.lineBetween(50, y, width - 50, y);
    }

    // Liminal Wall border
    const wall = this.add.graphics();
    wall.fillStyle(Phaser.Display.Color.HexStringToColor(room.wallpaperColor).color, 1);
    wall.fillRect(0, 0, width, 50); // Top wall
    wall.fillRect(0, height - 50, width, 50); // Bottom wall
    wall.fillRect(0, 0, 50, height); // Left wall
    wall.fillRect(width - 50, 0, 50, height); // Right wall

    // Wall top border glowing strip
    wall.lineStyle(4, Phaser.Display.Color.HexStringToColor(room.color).color, 0.8);
    wall.strokeRect(50, 50, width - 100, height - 100);

    // Ceiling Fluorescent Light Strip
    const lights = this.add.graphics();
    lights.fillStyle(0xfffbeb, 0.9);
    lights.fillRect(200, 20, 400, 10);
    lights.fillStyle(Phaser.Display.Color.HexStringToColor(room.color).color, 0.3);
    lights.fillRect(190, 15, 420, 20);

    if (this.roomTitleText) {
      this.roomTitleText.setText(room.name).setColor(room.color);
      this.add.existing(this.roomTitleText);
    }
  }

  private createTerminalConsole() {
    this.terminalConsole = this.add.container(250, 150);

    const crt = this.add.sprite(0, 0, 'crt_console').setInteractive({ useHandCursor: true });
    const screenText = this.add.text(0, -2, '>_ LINUX\nTERMI-LAB', {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '8px',
      color: '#00ffcc',
      align: 'center',
    }).setOrigin(0.5);

    const desk = this.add.rectangle(0, 26, 60, 16, 0x334155);

    this.terminalConsole.add([desk, crt, screenText]);

    crt.on('pointerdown', () => {
      gameManager.setTerminalOpen(true);
      soundManager.playKeyClick();
    });
  }

  private createExitDoor() {
    this.exitDoor = this.add.container(720, 280);

    const door = this.add.sprite(0, 0, 'door_frame').setInteractive({ useHandCursor: true });
    const sign = this.add.text(0, -45, 'PORTAL', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '8px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const lockIndicator = this.add.circle(0, 0, 8, 0xef4444);

    this.exitDoor.add([door, sign, lockIndicator]);

    door.on('pointerdown', () => {
      this.attemptDoorTransition();
    });
  }

  private updateDoorState() {
    if (!this.exitDoor) return;
    const roomKeys = Object.keys(ROOMS_DATA);
    const currentIndex = roomKeys.indexOf(this.currentRoomId);
    const nextRoomId = roomKeys[currentIndex + 1];
    const isNextUnlocked = nextRoomId ? gameManager.getRooms()[nextRoomId]?.unlocked : false;

    const lockCircle = this.exitDoor.list[2] as Phaser.GameObjects.Arc;
    if (lockCircle) {
      lockCircle.setFillStyle(isNextUnlocked ? 0x10b981 : 0xef4444);
    }
  }

  private updateAnomalyState() {
    const room = gameManager.getCurrentRoom();
    if (room.anomalyActive) {
      if (!this.glitchAnomaly) {
        this.glitchAnomaly = this.add.container(550, 300);

        const core = this.add.rectangle(0, 0, 36, 36, 0xa855f7);
        const aura = this.add.circle(0, 0, 30, 0xef4444, 0.4);
        const label = this.add.text(0, -25, '⚠ GLITCH ANOMALY', {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '7px',
          color: '#ff0055',
        }).setOrigin(0.5);

        this.glitchAnomaly.add([aura, core, label]);

        // Flicker tween
        this.tweens.add({
          targets: aura,
          scale: 1.3,
          alpha: 0.1,
          duration: 400,
          yoyo: true,
          repeat: -1,
        });
      } else {
        this.glitchAnomaly.setVisible(true);
      }
    } else if (this.glitchAnomaly) {
      this.glitchAnomaly.setVisible(false);
    }
  }

  private createFairyCompanion() {
    this.fairySprite = this.add.container(100, 100);

    const body = this.add.circle(0, 0, 8, 0x38bdf8);
    const wingL = this.add.ellipse(-7, -4, 10, 5, 0xe0f2fe, 0.7);
    const wingR = this.add.ellipse(7, -4, 10, 5, 0xe0f2fe, 0.7);
    const glow = this.add.circle(0, 0, 16, 0x38bdf8, 0.35);

    this.fairySprite.add([glow, wingL, wingR, body]);

    // Bobbing float animation
    this.tweens.add({
      targets: this.fairySprite,
      y: '+=12',
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private createPlayer() {
    this.player = this.add.container(400, 350).setDepth(50);

    this.playerBody = this.add.rectangle(0, 0, 20, 28, 0x38bdf8);
    const head = this.add.circle(0, -14, 10, 0xfde047);
    const visor = this.add.rectangle(0, -14, 12, 5, 0x0f172a);

    this.player.add([this.playerBody, head, visor]);
  }

  update() {
    if (!this.player || gameManager.isTerminalOpened()) return;

    const speed = 3.5;
    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) dx -= speed;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx += speed;
    if (this.cursors.up.isDown || this.wasd.up.isDown) dy -= speed;
    if (this.cursors.down.isDown || this.wasd.down.isDown) dy += speed;

    if (dx !== 0 || dy !== 0) {
      this.player.x = Phaser.Math.Clamp(this.player.x + dx, 70, 730);
      this.player.y = Phaser.Math.Clamp(this.player.y + dy, 70, 530);

      // Play subtle footstep sound
      if (Math.random() < 0.1) {
        soundManager.playFootstep();
      }
    }

    // Fairy follows player smoothly
    this.fairySprite.x = Phaser.Math.Linear(this.fairySprite.x, this.player.x - 35, 0.08);
    this.fairySprite.y = Phaser.Math.Linear(this.fairySprite.y, this.player.y - 30, 0.08);

    // Proximity checks
    const distToConsole = Phaser.Math.Distance.Between(this.player.x, this.player.y, 250, 150);
    this.isNearTerminal = distToConsole < 70;

    const distToDoor = Phaser.Math.Distance.Between(this.player.x, this.player.y, 720, 280);
    this.isNearDoor = distToDoor < 60;

    if (this.isNearTerminal) {
      this.promptText.setText('Press [E] or Click Console to Open Terminal').setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.wasd.interact) || (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space))) {
        gameManager.setTerminalOpen(true);
        soundManager.playKeyClick();
      }
    } else if (this.isNearDoor) {
      this.promptText.setText('Press [E] or Click Door to Enter Portal').setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.wasd.interact) || (this.cursors.space && Phaser.Input.Keyboard.JustDown(this.cursors.space))) {
        this.attemptDoorTransition();
      }
    } else {
      this.promptText.setVisible(false);
    }
  }

  private attemptDoorTransition() {
    const roomKeys = Object.keys(ROOMS_DATA);
    const currentIndex = roomKeys.indexOf(this.currentRoomId);

    if (currentIndex < roomKeys.length - 1) {
      const nextRoomId = roomKeys[currentIndex + 1];
      if (gameManager.getRooms()[nextRoomId].unlocked) {
        gameManager.setCurrentRoom(nextRoomId);
        soundManager.playSuccessFanfare();
        this.player.setPosition(100, 350); // Reset position near entrance
      } else {
        gameManager.setNotification(`🔒 DOOR LOCKED! Solve the terminal puzzle in ${this.currentRoomId} first!`);
        soundManager.playGlitchBuzz();
      }
    } else {
      gameManager.setNotification('🏆 You have reached the core room /usr!');
    }
  }
}

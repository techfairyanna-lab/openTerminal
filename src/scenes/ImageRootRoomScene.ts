import Phaser from 'phaser';

// ------------------------------------------------------------------
//  ImageRootRoomScene — 2D ILLUSTRATED ROOT ROOM (Sector 0: /)
//  ============================================================
//  A completely blank canvas room for the 2D Image room design pipeline,
//  with only the user character in the room who can freely walk around.
// ------------------------------------------------------------------

const W = 800;
const H = 600;

export class ImageRootRoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('ImageRootRoom');
  }

  preload(): void {
    const TOTAL_IMAGE_WIDTH = 1064;
    const TOTAL_IMAGE_HEIGHT = 1064;
    const COLUMNS = 4;
    const ROWS = 2;

    if (!this.textures.exists('player_walk')) {
      this.load.spritesheet('player_walk', './assets/8userright.png', {
        frameWidth: TOTAL_IMAGE_WIDTH / COLUMNS,
        frameHeight: TOTAL_IMAGE_HEIGHT / ROWS,
      });
    }
  }

  create(): void {
    // Blank minimalist background
    this.cameras.main.setBackgroundColor('#18181b');
    this.cameras.main.setBounds(0, 0, W, H);
    this.physics.world.setBounds(0, 0, W, H);

    // Create player animations if not registered
    if (!this.anims.exists('walk-back')) {
      this.anims.create({
        key: 'walk-back',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: 'walk-front',
        frames: this.anims.generateFrameNumbers('player_walk', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1,
      });
      this.anims.create({
        key: 'idle',
        frames: [{ key: 'player_walk', frame: 0 }],
        frameRate: 1,
      });
    }

    // Spawn player in the center of the blank canvas
    const userScale = 0.35;
    this.player = this.physics.add.sprite(W / 2, H / 2, 'player_walk');
    this.player.setScale(userScale);
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(this.player.width * 0.4, this.player.height * 0.3);
    (this.player.body as Phaser.Physics.Arcade.Body).setOffset(
      this.player.width * 0.3,
      this.player.height * 0.65
    );

    // Controls setup
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cameras.main.fadeIn(400);
  }

  override update(): void {
    if (!this.player || !this.player.body) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = 200;
    body.setVelocity(0);

    let moving = false;

    if (this.cursors.left.isDown || this.keyA.isDown) {
      body.setVelocityX(-speed);
      this.player.play('walk-front', true);
      this.player.setFlipX(true);
      moving = true;
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      body.setVelocityX(speed);
      this.player.play('walk-front', true);
      this.player.setFlipX(false);
      moving = true;
    }

    if (this.cursors.up.isDown || this.keyW.isDown) {
      body.setVelocityY(-speed);
      this.player.play('walk-back', true);
      moving = true;
    } else if (this.cursors.down.isDown || this.keyS.isDown) {
      body.setVelocityY(speed);
      this.player.play('walk-front', true);
      moving = true;
    }

    if (!moving) {
      this.player.play('idle', true);
    }
  }
}

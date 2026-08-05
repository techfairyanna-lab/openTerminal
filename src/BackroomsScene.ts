import Phaser from 'phaser';

export class BackroomsScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private redSquare!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private onInteract?: (target: string) => void;
  private hasInteracted: boolean = false;

  constructor() {
    super('BackroomsScene');
  }

  init(data: { onInteract?: (target: string) => void }) {
    this.onInteract = data.onInteract;
    this.hasInteracted = false;
  }

  create() {
    // Green square player
    this.player = this.add.rectangle(100, 240, 32, 32, 0x00ff00);
    this.physics.add.existing(this.player);
    (this.player.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);

    // Red square target
    this.redSquare = this.add.rectangle(500, 240, 40, 40, 0xff0000);
    this.physics.add.existing(this.redSquare, true); // static body

    // Arrow keys cursor setup
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    // Overlap callback when green square player touches red square
    this.physics.add.overlap(
      this.player,
      this.redSquare,
      () => {
        if (!this.hasInteracted) {
          this.hasInteracted = true;
          if (this.onInteract) {
            this.onInteract('red_square');
          }
        }
      },
      undefined,
      this
    );
  }

  update() {
    if (!this.cursors || !this.player.body) return;

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = 200;

    body.setVelocity(0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(speed);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(speed);
    }

    // Reset interaction state if player moves away from red square
    if (this.hasInteracted) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.redSquare.x,
        this.redSquare.y
      );
      if (dist > 60) {
        this.hasInteracted = false;
      }
    }
  }
}

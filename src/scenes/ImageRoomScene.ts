import Phaser from 'phaser';

export class ImageRoomScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private faye!: Phaser.Physics.Arcade.Sprite; // NEW: Faye sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;
  
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private promptText!: Phaser.GameObjects.Text;
  private onInteract?: (target: string) => void;

  private computerZone!: Phaser.GameObjects.Zone;
  private doorZone!: Phaser.GameObjects.Zone;
  private documentsZone!: Phaser.GameObjects.Zone;
  private boxZone!: Phaser.GameObjects.Zone;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  
  private rightImg!: Phaser.GameObjects.Image;

  constructor() {
    super('ImageRoom');
  }

  preload(): void {
    this.load.image('room_left', './assets/LeftNB.png');
    this.load.image('room_right', './assets/RightNB.png');
    this.load.image('room_right_terminal', './assets/RightPartTerminal.png'); 
    this.load.image('obj_carpet', './assets/carpetNB.png');
    this.load.image('obj_box', './assets/BoxNB.png');
    
    // --- PLAYER SPRITESHEET SETTINGS ---
    const TOTAL_IMAGE_WIDTH = 1064;  
    const TOTAL_IMAGE_HEIGHT = 1064;  
    const COLUMNS = 4;               
    const ROWS = 2;                  

    this.load.spritesheet('player_walk', './assets/8userright.png', { 
      frameWidth: TOTAL_IMAGE_WIDTH / COLUMNS, 
      frameHeight: TOTAL_IMAGE_HEIGHT / ROWS 
    });

    // --- NEW: FAYE SPRITESHEET SETTINGS ---
    // Make sure Fae8.png has the same dimensions and 4x2 grid layout!
    const FAE_WIDTH = 1064;  
    const FAE_HEIGHT = 1064;  
    const FAE_COLS = 4;               
    const FAE_ROWS = 2;                  

    this.load.spritesheet('fae_walk', './assets/Fae8.png', { 
      frameWidth: FAE_WIDTH / FAE_COLS, 
      frameHeight: FAE_HEIGHT / FAE_ROWS 
    });
  }

  create(): void {
    this.onInteract = this.game.registry.get('onInteract') as ((target: string) => void) | undefined;
    this.cameras.main.setBackgroundColor('#11111b');

    // --- ROOM ALIGNMENT ---
    const RIGHT_IMG_X = 800; 
    const RIGHT_IMG_Y = 0;
    
    this.rightImg = this.add.image(RIGHT_IMG_X, RIGHT_IMG_Y, 'room_right').setOrigin(0, 0);
    const RIGHT_IMG_SCALE = 600 / this.rightImg.height; 
    this.rightImg.setScale(RIGHT_IMG_SCALE).setDepth(-100);
    
    const LEFT_IMG_X = 520;       
    const LEFT_IMG_Y = 146;       
    const LEFT_IMG_SCALE = 0.5683; 

    const leftImg = this.add.image(LEFT_IMG_X, LEFT_IMG_Y, 'room_left').setOrigin(0, 0);
    leftImg.setScale(LEFT_IMG_SCALE).setDepth(-99);

    const minX = Math.min(leftImg.x, this.rightImg.x);
    const maxX = Math.max(leftImg.x + leftImg.displayWidth, this.rightImg.x + this.rightImg.displayWidth);
    const minY = Math.min(leftImg.y, this.rightImg.y);
    const maxY = Math.max(leftImg.y + leftImg.displayHeight, this.rightImg.y + this.rightImg.displayHeight);

    const totalWidth = maxX - minX;
    const totalHeight = maxY - minY;

    this.physics.world.setBounds(minX, minY, totalWidth, totalHeight);
    this.cameras.main.setBounds(minX, minY, totalWidth, totalHeight);

    // 3. Debug Graphics
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.fillStyle(0xff0000, 0);
    this.debugGraphics.setDepth(2000);

    // 4. Create Invisible Walls & Zones
    if (!this.textures.exists('wall')) {
      const c = document.createElement('canvas');
      c.width = 1;
      c.height = 1;
      this.textures.addCanvas('wall', c);
    }
    this.walls = this.physics.add.staticGroup();
    const createWall = (x: number, y: number, w: number, h: number) => {
      this.walls.create(x, y, 'wall').setVisible(false).setSize(w, h);
      this.debugGraphics.fillRect(x - w/2, y - h/2, w, h);
    };

    const createZone = (x: number, y: number) => {
      const zone = this.add.zone(x, y, 80, 80);
      this.physics.world.enable(zone);
      (zone.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true);
      return zone;
    };

    // --- BORDER WALLS ---
    createWall(minX + totalWidth / 2, minY - 10, totalWidth, 20);
    createWall(minX + totalWidth / 2, maxY + 10, totalWidth, 20);
    createWall(minX - 10, minY + totalHeight / 2, 20, totalHeight);
    createWall(maxX + 10, minY + totalHeight / 2, 20, totalHeight);

    // --- ZONES ---
    this.computerZone = createZone(1066, 244);
    this.doorZone = createZone(614, 428);
    this.documentsZone = createZone(794, 368);
    this.boxZone = createZone(1065, 532);

    // --- ORIGINAL WALLS ---
    createWall(555, 420, 37, 221);
    createWall(673, 358, 42, 209);
    createWall(721, 335, 53, 203);
    createWall(847, 259, 45, 200);
    createWall(882, 250, 38, 201);
    createWall(922, 227, 38, 195);
    createWall(962, 217, 41, 198);
    createWall(1274, 279, 223, 398);
    createWall(1141, 405, 78, 95);

    // --- NEW ADDED WALLS ---
    createWall(615, 417, 83, 167);
    createWall(794, 350, 82, 179);
    createWall(1048, 247, 139, 183);
    createWall(580, 634, 134, 127);
    createWall(540, 544, 65, 61);
    createWall(688, 633, 38, 39);
    createWall(741, 662, 33, 43);
    createWall(793, 683, 31, 19);
    createWall(886, 672, 53, 27);
    createWall(938, 640, 47, 36);
    createWall(994, 616, 51, 36);
    createWall(1046, 584, 46, 38);
    createWall(1098, 543, 39, 41);
    createWall(1161, 507, 54, 43);
    createWall(1206, 451, 82, 98);
    createWall(1295, 282, 163, 357);
    createWall(831, 354, 53, 136);
    createWall(1068, 545, 89, 56);
    createWall(1058, 561, 95, 79);

    // --- DYNAMIC OBJECTS (Carpet & Box) ---
    //const carpet = this.add.image(minX + totalWidth / 2, minY + totalHeight / 2, 'obj_carpet');
    //carpet.setScale(0.3).setDepth(-50); 

    // Box Visual - REMOVED PHYSICS WALL! You can now walk through it.
    const boxScale = 0.12;
    const boxX = minX + 550; 
    const boxY = minY + 510; 
    const box = this.add.image(boxX, boxY, 'obj_box');
    box.setScale(boxScale); 
    box.setDepth(boxY); 

    // 5. Create the Player Animations
    if (!this.anims.exists('walk-back')) {
      this.anims.create({ key: 'walk-back', frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'walk-front', frames: this.anims.generateFrameNumbers('player_walk', { start: 4, end: 7 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'idle', frames: [{ key: 'player_walk', frame: 0 }], frameRate: 1 });
    }

    // NEW: Create Faye Animations
    if (!this.anims.exists('fae-walk-back')) {
      this.anims.create({ key: 'fae-walk-back', frames: this.anims.generateFrameNumbers('fae_walk', { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'fae-walk-front', frames: this.anims.generateFrameNumbers('fae_walk', { start: 4, end: 7 }), frameRate: 8, repeat: -1 });
      this.anims.create({ key: 'fae-idle', frames: [{ key: 'fae_walk', frame: 0 }], frameRate: 1 });
    }

    // 6. Create the Player Sprite
    const userScale = 0.35; 
    this.player = this.physics.add.sprite(minX + totalWidth / 2, minY + totalHeight / 2, 'player_walk');
    this.player.setScale(userScale);
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(this.player.width * 0.4, this.player.height * 0.3);
    (this.player.body as Phaser.Physics.Arcade.Body).setOffset(this.player.width * 0.3, this.player.height * 0.65);

    // NEW: Create Faye Sprite (Spawns slightly offset from the player)
    const faeScale = 0.35; 
    this.faye = this.physics.add.sprite(minX + totalWidth / 2 + 60, minY + totalHeight / 2 + 60, 'fae_walk');
    this.faye.setScale(faeScale);
    this.faye.setCollideWorldBounds(true);
    this.faye.body!.setSize(this.faye.width * 0.4, this.faye.height * 0.3);
    (this.faye.body as Phaser.Physics.Arcade.Body).setOffset(this.faye.width * 0.3, this.faye.height * 0.65);

    // 7. Camera follows the player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // 8. Prompt Text
    this.promptText = this.add.text(400, 500, '', { 
      fontFamily: 'monospace', fontSize: '16px', color: '#ffffff', backgroundColor: '#000000', padding: { x: 8, y: 4 } 
    }).setOrigin(0.5).setDepth(1000).setScrollFactor(0);

    // 9. Physics & Controls
    this.physics.add.collider(this.player, this.walls);
    // REMOVED: this.physics.add.collider(this.player, box); 
    
    // NEW: Add Faye to physics colliders so she doesn't walk through walls
    this.physics.add.collider(this.faye, this.walls);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keyW = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Intro dialogue
    this.time.addEvent({
      delay: 800,
      callback: () => {
        const speak = this.game.registry.get('onFayeSpeak') as (text: string) => void;
        if (speak) speak("Welcome to /home! Go to the computer and press [E] to open the terminal, then head to the root directory.");
      }
    });
  }

  public setTerminalMode(isOpen: boolean) {
    if (this.rightImg) {
      this.rightImg.setTexture(isOpen ? 'room_right_terminal' : 'room_right');
    }
    
    if (this.player) {
      this.player.setVisible(!isOpen);
    }
    
    // NEW: Hide Faye when sitting at the terminal too
    if (this.faye) {
      this.faye.setVisible(!isOpen);
    }
  }

  update(): void {
    this.player.setDepth(this.player.y);
    this.faye.setDepth(this.faye.y); // NEW: Update Faye's depth for proper overlapping

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

    // --- NEW: FAYE FOLLOW LOGIC ---
    if (this.player.visible) {
      const faeSpeed = 185; // Slightly slower than player so she trails behind naturally
      const followDistance = 80; // How close she tries to stay to the player

      const distToPlayer = Phaser.Math.Distance.Between(this.faye.x, this.faye.y, this.player.x, this.player.y);

      if (distToPlayer > followDistance) {
        // Move towards player
        this.physics.moveToObject(this.faye, this.player, faeSpeed);
        
        // Determine animation based on her current velocity
        const vx = this.faye.body.velocity.x;
        const vy = this.faye.body.velocity.y;
        
        if (Math.abs(vy) > Math.abs(vx)) {
          // Moving more vertically
          if (vy < 0) {
            this.faye.play('fae-walk-back', true);
          } else {
            this.faye.play('fae-walk-front', true);
          }
          this.faye.setFlipX(false); // Reset flip when moving up/down
        } else {
          // Moving more horizontally
          this.faye.play('fae-walk-front', true);
          this.faye.setFlipX(vx < 0); // Flip left/right
        }
      } else {
        // Stop moving and idle when close enough
        (this.faye.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        this.faye.play('fae-idle', true);
      }
    } else {
      // If player is sitting at the terminal, Fae just idles
      (this.faye.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
      this.faye.play('fae-idle', true);
    }

    // Check Proximity to Interactables
    let nearestPrompt = "";
    let nearestTarget = "";

    if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.computerZone.x, this.computerZone.y) < 80) {
      nearestPrompt = "[E] Log in to terminal";
      nearestTarget = "computer";
    } 
    else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.doorZone.x, this.doorZone.y) < 80) {
      nearestPrompt = "[E] Try the root door";
      nearestTarget = "door";
    }
    else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.documentsZone.x, this.documentsZone.y) < 80) {
      nearestPrompt = "[E] Open Documents/";
      nearestTarget = "documents";
    }
    else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boxZone.x, this.boxZone.y) < 80) {
      nearestPrompt = "[E] Open Downloads/";
      nearestTarget = "downloads"; 
    }

    if (nearestPrompt !== "") {
      this.promptText.setText(nearestPrompt);
      this.promptText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.onInteract?.(nearestTarget);
      }
    } else {
      this.promptText.setVisible(false);
    }
  }
}
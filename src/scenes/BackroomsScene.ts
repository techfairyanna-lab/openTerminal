import Phaser from 'phaser';

const W = 800, H = 600;
const PORTRAIT_URL = "./assets/fairy.png";

/* ---------------- procedural audio ---------------- */
class SoundKit {
  ctx: AudioContext | null = null; master: GainNode | null = null; muted = false; noiseBuf: AudioBuffer | null = null;
  ensure() {
    if (this.ctx) { if (this.ctx.state === "suspended") this.ctx.resume(); return; }
    const AC = window.AudioContext || (window as any).webkitAudioContext; if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
    const len = this.ctx.sampleRate; this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.hum();
  }
  hum() {
    if(!this.ctx || !this.master) return;
    const c = this.ctx, g = c.createGain(); g.gain.value = 0.045;
    const o1 = c.createOscillator(); o1.type = "sine"; o1.frequency.value = 50;
    const o2 = c.createOscillator(); o2.type = "sine"; o2.frequency.value = 100;
    const g2 = c.createGain(); g2.gain.value = 0.5;
    const o3 = c.createOscillator(); o3.type = "triangle"; o3.frequency.value = 199;
    const g3 = c.createGain(); g3.gain.value = 0.05;
    const lfo = c.createOscillator(); lfo.frequency.value = 0.09;
    const lg = c.createGain(); lg.gain.value = 0.012; lfo.connect(lg); lg.connect(g.gain);
    o1.connect(g); o2.connect(g2); g2.connect(g); o3.connect(g3); g3.connect(g); g.connect(this.master);
    o1.start(); o2.start(); o3.start(); lfo.start();
  }
  setMuted(m: boolean) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : 0.5; }
  env(dur: number, peak: number) { 
    if(!this.ctx || !this.master) return null;
    const c = this.ctx, g = c.createGain(), t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur); g.connect(this.master); return g; 
  }
  blip() { if (!this.ctx || this.muted) return; const c = this.ctx, o = c.createOscillator();
    o.type = "square"; o.frequency.value = 640 + Math.random() * 160;
    const g = this.env(0.06, 0.045); if(!g) return; o.connect(g); o.start(); o.stop(c.currentTime + 0.08); }
  step() { if (!this.ctx || this.muted || !this.noiseBuf) return; const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420;
    const g = this.env(0.09, 0.09); if(!g) return; s.connect(f); f.connect(g); s.start(); s.stop(c.currentTime + 0.1); }
  buzz() { if (!this.ctx || this.muted || !this.noiseBuf) return; const c = this.ctx, s = c.createBufferSource(); s.buffer = this.noiseBuf;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2600; f.Q.value = 2;
    const g = this.env(0.12, 0.05); if(!g) return; s.connect(f); f.connect(g); s.start(); s.stop(c.currentTime + 0.14); }
  chime() { if (!this.ctx || this.muted || !this.master) return; const c = this.ctx;
    [523, 784].forEach((fr, i) => { const o = c.createOscillator(); o.type = "sine"; o.frequency.value = fr;
      const t = c.currentTime + i * 0.12, g = c.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g); g.connect(this.master!); o.start(t); o.stop(t + 0.6); }); }
  drone(dur: number) { if (!this.ctx || this.muted || !this.master) return; const c = this.ctx, o = c.createOscillator();
    o.type = "sine"; o.frequency.setValueAtTime(38, c.currentTime);
    o.frequency.linearRampToValueAtTime(60, c.currentTime + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.linearRampToValueAtTime(0.12, c.currentTime + dur * 0.4);
    g.gain.linearRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(this.master!); o.start(); o.stop(c.currentTime + dur + 0.1); }
  whisper() { if (!this.ctx || this.muted || !this.noiseBuf || !this.master) return; const c = this.ctx, s = c.createBufferSource();
    s.buffer = this.noiseBuf; s.loop = true;
    const f = c.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 6;
    f.frequency.setValueAtTime(900, c.currentTime);
    f.frequency.exponentialRampToValueAtTime(2400, c.currentTime + 0.8);
    const g = c.createGain(); g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.linearRampToValueAtTime(0.05, c.currentTime + 0.2);
    g.gain.linearRampToValueAtTime(0.0001, c.currentTime + 1);
    s.connect(f); f.connect(g); g.connect(this.master!); s.start(); s.stop(c.currentTime + 1.1); }
}
const soundKit = new SoundKit();

/* ---------------- textures ---------------- */
function canvasTex(scn: Phaser.Scene, key: string, w: number, h: number, fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  if (scn.textures.exists(key)) return;
  const ct = scn.textures.createCanvas(key, w, h);
  if (!ct) return;
  fn(ct.context, w, h);
  ct.refresh();
}
function seededRand(seed: number) { let s = seed; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

function makeTextures(scn: Phaser.Scene) {
  if (!scn.textures.exists("wall_yellow")) {
    const g = scn.add.graphics();
    g.fillStyle(0xe6dd93, 1); g.fillRect(0, 0, 32, 32);
    g.fillStyle(0xd9cf85, 1); g.fillRect(0, 0, 4, 32); g.fillRect(16, 0, 4, 32);
    g.fillStyle(0xc9bc6c, 1); g.fillRect(8, 0, 2, 32); g.fillRect(24, 0, 2, 32);
    g.fillStyle(0xb7aa5e, 1);
    g.fillTriangle(4, 12, 8, 7, 12, 12);  g.fillTriangle(4, 28, 8, 23, 12, 28);
    g.fillTriangle(20, 8, 24, 3, 28, 8);  g.fillTriangle(20, 24, 24, 19, 28, 24);
    g.generateTexture("wall_yellow", 32, 32); g.destroy();
  }
  canvasTex(scn, "floor_carpet", 32, 32, (cx) => {
    const rnd = seededRand(77);
    cx.fillStyle = "#a89e83"; cx.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 150; i++) {
      cx.fillStyle = rnd() < 0.5 ? "rgba(120,110,88,0.5)" : "rgba(196,188,158,0.5)";
      cx.fillRect((rnd() * 32) | 0, (rnd() * 32) | 0, 1, 1);
    }
    cx.fillStyle = "rgba(90,82,64,0.35)"; cx.fillRect(0, 16, 32, 1);
  });
  canvasTex(scn, "desk", 96, 40, (cx) => {
    cx.fillStyle = "#4a2f1b"; cx.fillRect(0, 0, 96, 40);
    cx.fillStyle = "#6a4a30"; cx.fillRect(0, 0, 96, 3);
    cx.fillStyle = "#38220f";
    for (let y = 10; y < 40; y += 10) cx.fillRect(0, y, 96, 2);
    const rnd = seededRand(31);
    cx.fillStyle = "rgba(122,84,52,0.6)";
    for (let i = 0; i < 26; i++) cx.fillRect((rnd() * 90) | 0, 4 + ((rnd() * 34) | 0), 4 + ((rnd() * 8) | 0), 1);
  });
  canvasTex(scn, "crt_monitor", 40, 34, (cx) => {
    cx.fillStyle = "#d8d2c0"; cx.fillRect(0, 0, 40, 30);
    cx.fillStyle = "#b8b2a0"; cx.fillRect(0, 26, 40, 4);
    cx.fillStyle = "#0a0f0a"; cx.fillRect(4, 3, 32, 22);
    cx.fillStyle = "#141c14"; cx.fillRect(6, 5, 12, 4);
    cx.fillStyle = "#c8c2b0"; cx.fillRect(12, 30, 16, 4);
    cx.fillStyle = "#8a8474"; cx.fillRect(30, 27, 4, 2);
  });
  canvasTex(scn, "exit_sign", 64, 28, (cx) => {
    cx.fillStyle = "#b32020"; cx.fillRect(0, 0, 64, 28);
    cx.strokeStyle = "#f2f2ea"; cx.lineWidth = 2; cx.strokeRect(2, 2, 60, 24);
    cx.fillStyle = "#f2f2ea";
    cx.font = "bold 14px monospace"; cx.textAlign = "center"; cx.textBaseline = "middle";
    cx.fillText("EXIT", 32, 15);
    cx.beginPath(); cx.moveTo(7, 14); cx.lineTo(13, 9); cx.lineTo(13, 19); cx.closePath(); cx.fill();
    cx.beginPath(); cx.moveTo(57, 14); cx.lineTo(51, 9); cx.lineTo(51, 19); cx.closePath(); cx.fill();
  });
  canvasTex(scn, "wall_clock", 24, 24, (cx) => {
    cx.fillStyle = "#cfcfc0"; cx.beginPath(); cx.arc(12, 12, 10, 0, 7); cx.fill();
    cx.strokeStyle = "#2a2a2a"; cx.lineWidth = 2; cx.beginPath(); cx.arc(12, 12, 10, 0, 7); cx.stroke();
    cx.strokeStyle = "#1a1a1a"; cx.lineWidth = 2;
    cx.beginPath(); cx.moveTo(12, 12); cx.lineTo(12, 5); cx.stroke();
    cx.beginPath(); cx.moveTo(12, 12); cx.lineTo(17, 13); cx.stroke();
  });
  canvasTex(scn, "note_paper", 28, 36, (cx) => {
    cx.fillStyle = "#f2f2ea"; cx.fillRect(0, 0, 28, 36);
    cx.fillStyle = "#9a9a92"; cx.fillRect(8, 0, 12, 5);
    cx.fillStyle = "#5a5a52"; cx.font = "7px monospace"; cx.textAlign = "center";
    cx.fillText("WHERE", 14, 17); cx.fillText("AM I?", 14, 26);
  });
  canvasTex(scn, "sticky", 12, 12, (cx) => {
    cx.fillStyle = "#e8d878"; cx.fillRect(0, 0, 12, 12);
    cx.fillStyle = "#c9b958";
    cx.beginPath(); cx.moveTo(12, 12); cx.lineTo(7, 12); cx.lineTo(12, 7); cx.closePath(); cx.fill();
  });
  canvasTex(scn, "outlet", 12, 16, (cx) => {
    cx.fillStyle = "#e8e8e0"; cx.fillRect(0, 0, 12, 16);
    cx.fillStyle = "#3a3a3a"; cx.fillRect(4, 4, 2, 3); cx.fillRect(7, 4, 2, 3);
    cx.fillRect(4, 9, 2, 3); cx.fillRect(7, 9, 2, 3);
  });
  canvasTex(scn, "shadow_fig", 40, 96, (cx) => {
    cx.fillStyle = "#060606";
    cx.beginPath(); cx.arc(20, 12, 9, 0, 7); cx.fill();
    cx.fillRect(12, 18, 16, 40);
    cx.fillRect(14, 55, 5, 41); cx.fillRect(22, 55, 5, 41);
    cx.fillRect(7, 20, 5, 48);  cx.fillRect(28, 20, 5, 48);
    cx.fillStyle = "#c8c8b8"; cx.fillRect(16, 10, 2, 2); cx.fillRect(23, 10, 2, 2);
  });
  canvasTex(scn, "glow_radial", 128, 128, (cx) => {
    const gr = cx.createRadialGradient(64, 64, 6, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
  });
  canvasTex(scn, "vignette", 200, 150, (cx) => {
    const gr = cx.createRadialGradient(100, 75, 30, 100, 75, 110);
    gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.62)");
    cx.fillStyle = gr; cx.fillRect(0, 0, 200, 150);
  });
  canvasTex(scn, "grain", 96, 96, (cx) => {
    const rnd = seededRand(Date.now() & 0xffff);
    for (let y = 0; y < 96; y++) for (let x = 0; x < 96; x++) {
      const v = (rnd() * 255) | 0; cx.fillStyle = "rgba(" + v + "," + v + "," + v + "," + (rnd() * 0.5).toFixed(2) + ")";
      cx.fillRect(x, y, 1, 1);
    }
  });
  canvasTex(scn, "scanline", 4, 4, (cx) => { cx.fillStyle = "rgba(0,0,0,0.5)"; cx.fillRect(0, 3, 4, 1); });

  const HAIR = "#15151a", SKIN = "#e6b98c", SHIRT = "#e8e6da", SKIRT = "#34343e", SHOE = "#8a2a2a", EYE = "#20202a";
  const P = (cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) => { cx.fillStyle = c; cx.fillRect(x, y, w, h); };
  const legs = (cx: CanvasRenderingContext2D, f: number) => {
    if (f === 0) { P(cx, 9, 22, 2, 7, SKIN); P(cx, 13, 22, 2, 7, SKIN); P(cx, 8, 29, 3, 2, SHOE); P(cx, 13, 29, 3, 2, SHOE); }
    else { P(cx, 9, 22, 2, 5, SKIN); P(cx, 8, 27, 3, 2, SHOE); P(cx, 13, 22, 2, 7, SKIN); P(cx, 13, 29, 3, 2, SHOE); }
  };
  function frame(key: string, dir: string, f: number) {
    if (scn.textures.exists(key)) return;
    const ct = scn.textures.createCanvas(key, 24, 32); if (!ct) return;
    const cx = ct.context;
    if (dir === "d") {
      P(cx, 6, 2, 12, 3, HAIR); P(cx, 5, 4, 2, 9, HAIR); P(cx, 17, 4, 2, 9, HAIR);
      P(cx, 8, 5, 8, 6, SKIN); P(cx, 8, 5, 8, 2, HAIR);
      P(cx, 9, 8, 2, 2, EYE); P(cx, 13, 8, 2, 2, EYE);
      P(cx, 7, 11, 10, 7, SHIRT); P(cx, 5, 11, 2, 6, SHIRT); P(cx, 17, 11, 2, 6, SHIRT);
      P(cx, 5, 17, 2, 2, SKIN); P(cx, 17, 17, 2, 2, SKIN); P(cx, 7, 18, 10, 4, SKIRT);
      if (f === 1) { P(cx, 5, 11, 2, 7, SHIRT); P(cx, 5, 18, 2, 2, SKIN); P(cx, 17, 11, 2, 5, SHIRT); P(cx, 17, 16, 2, 2, SKIN); }
      legs(cx, f);
    } else if (dir === "u") {
      P(cx, 5, 2, 14, 12, HAIR); P(cx, 5, 4, 2, 12, HAIR); P(cx, 17, 4, 2, 12, HAIR);
      P(cx, 7, 12, 10, 6, SHIRT); P(cx, 5, 12, 2, 6, SHIRT); P(cx, 17, 12, 2, 6, SHIRT);
      P(cx, 5, 18, 2, 2, SKIN); P(cx, 17, 18, 2, 2, SKIN); P(cx, 7, 18, 10, 4, SKIRT);
      legs(cx, f);
    } else {
      P(cx, 6, 2, 9, 11, HAIR); P(cx, 6, 2, 10, 3, HAIR);
      P(cx, 12, 5, 6, 6, SKIN); P(cx, 12, 5, 6, 2, HAIR); P(cx, 15, 8, 2, 2, EYE);
      P(cx, 8, 11, 8, 7, SHIRT); P(cx, 10, 12, 3, 6, SHIRT); P(cx, 10, 18, 3, 2, SKIN);
      P(cx, 8, 18, 8, 4, SKIRT);
      if (f === 0) { P(cx, 9, 22, 3, 7, SKIN); P(cx, 13, 22, 3, 7, SKIN); P(cx, 9, 29, 4, 2, SHOE); P(cx, 13, 29, 4, 2, SHOE); }
      else { P(cx, 9, 22, 3, 7, SKIN); P(cx, 9, 29, 4, 2, SHOE); P(cx, 14, 22, 3, 5, SKIN); P(cx, 14, 27, 4, 2, SHOE); }
    }
    ct.refresh();
  }
  frame("pf_d0", "d", 0); frame("pf_d1", "d", 1);
  frame("pf_u0", "u", 0); frame("pf_u1", "u", 1);
  frame("pf_s0", "s", 0); frame("pf_s1", "s", 1);

  canvasTex(scn, "faye_proc", 48, 48, (cx) => {
    cx.fillStyle = "#0a120c"; cx.fillRect(0, 0, 48, 48);
    cx.fillStyle = "#0d0d10";
    cx.fillRect(10, 6, 28, 10); cx.fillRect(8, 10, 6, 18); cx.fillRect(34, 10, 6, 18);
    cx.fillRect(12, 4, 4, 6); cx.fillRect(28, 4, 6, 6);
    cx.fillStyle = "#d9d9cf"; cx.fillRect(14, 10, 20, 16);
    cx.fillStyle = "#1a1a22"; cx.fillRect(18, 16, 4, 3); cx.fillRect(28, 16, 4, 3);
    cx.fillStyle = "#9a9a90"; cx.fillRect(18, 19, 4, 1); cx.fillRect(28, 19, 4, 1);
    cx.fillStyle = "#f2f2ee"; cx.fillRect(14, 22, 20, 12); cx.fillRect(10, 24, 4, 2); cx.fillRect(34, 24, 4, 2);
    cx.fillStyle = "#c9c9c2"; cx.fillRect(22, 24, 4, 6);
    cx.fillStyle = "#20262a"; cx.fillRect(8, 34, 32, 12);
  });
}

export class TitleScene extends Phaser.Scene {
  started = false;
  titleTxt!: Phaser.GameObjects.Text;
  pressTxt!: Phaser.GameObjects.Text;

  constructor() { super("Title"); }
  create() {
    makeTextures(this);
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000).setDepth(0);
    this.add.image(400, 110, "exit_sign").setDepth(2);
    this.add.image(400, 110, "glow_radial").setBlendMode(Phaser.BlendModes.ADD).setTint(0xff2020).setScale(1.8, 1).setAlpha(0.3).setDepth(1);
    this.titleTxt = this.add.text(400, 250, "WHERE AM I?", { fontFamily: '"Press Start 2P"', fontSize: "26px", color: "#e3dd9a" }).setOrigin(0.5).setDepth(2);
    this.add.text(400, 300, "a liminal escape // build 0.1", { fontFamily: "VT323", fontSize: "22px", color: "#8f8f7f" }).setOrigin(0.5).setDepth(2);
    this.pressTxt = this.add.text(400, 410, "PRESS ANY KEY", { fontFamily: '"Press Start 2P"', fontSize: "10px", color: "#ffffff" }).setOrigin(0.5).setDepth(2);
    this.add.text(400, 560, "WASD / arrows move · E interact · M mute · ESC pause", { fontFamily: "VT323", fontSize: "18px", color: "#66665c" }).setOrigin(0.5).setDepth(2);
    this.add.tileSprite(W / 2, H / 2, W, H, "grain").setAlpha(0.06).setDepth(3);
    this.add.image(W / 2, H / 2, "vignette").setDisplaySize(W, H).setDepth(3);
    this.tweens.add({ targets: this.pressTxt, alpha: 0, duration: 500, yoyo: true, repeat: -1 });
    this.time.addEvent({ delay: 110, loop: true, callback: () => {
      this.titleTxt.setAlpha(Math.random() < 0.12 ? 0.35 + Math.random() * 0.3 : 0.85 + Math.random() * 0.15);
    }});
    this.input.keyboard.once("keydown", () => this.begin());
    this.input.once("pointerdown", () => this.begin());
  }
  begin() {
    if (this.started) return; this.started = true;
    soundKit.ensure();
    this.cameras.main.fade(600);
    this.cameras.main.once("camerafadecomplete", () => this.scene.start("HomeRoom"));
  }
}

export class HomeRoomScene extends Phaser.Scene {
  onInteract?: (target: string) => void;
  logged = false; exitUnlocked = false; shadowDone = false; endShown = false; paused = false; inputLocked = false;
  baseDark = 0.68; darkAlpha = 0.9; flickTicks = 0; stepAcc = 0; facing = "down"; nearTarget: any = null; cooldown = 0;
  player!: Phaser.Physics.Arcade.Sprite; crtOn!: Phaser.GameObjects.Rectangle; crtText!: Phaser.GameObjects.Text; crtGlow!: Phaser.GameObjects.Image;
  shadowSprite!: Phaser.GameObjects.Image; exitGlow!: Phaser.GameObjects.Image; promptText!: Phaser.GameObjects.Text; toastText!: Phaser.GameObjects.Text;
  objText!: Phaser.GameObjects.Text; barTop!: Phaser.GameObjects.Rectangle; barBot!: Phaser.GameObjects.Rectangle; grainTile!: Phaser.GameObjects.TileSprite;
  lightTex!: Phaser.Textures.CanvasTexture; lightCtx!: CanvasRenderingContext2D;
  dlg: any = { active: false, lines: [], idx: 0, shown: 0, acc: 0, done: false, onClose: null };
  endBg!: Phaser.GameObjects.Rectangle; endT1!: Phaser.GameObjects.Text; endT2!: Phaser.GameObjects.Text; endT3!: Phaser.GameObjects.Text;
  pauseBg!: Phaser.GameObjects.Rectangle; pauseT!: Phaser.GameObjects.Text; pauseH!: Phaser.GameObjects.Text;
  solidStore: Phaser.GameObjects.Rectangle[] = [];
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keyW!: Phaser.Input.Keyboard.Key; keyA!: Phaser.Input.Keyboard.Key; keyS!: Phaser.Input.Keyboard.Key; keyD!: Phaser.Input.Keyboard.Key;
  keyE!: Phaser.Input.Keyboard.Key; keySpace!: Phaser.Input.Keyboard.Key; keyEnter!: Phaser.Input.Keyboard.Key; keyEsc!: Phaser.Input.Keyboard.Key; keyM!: Phaser.Input.Keyboard.Key; keyR!: Phaser.Input.Keyboard.Key;
  lightPools: any[] = [];

  constructor() { super("HomeRoom"); }

  preload() { this.load.image("faye_portrait", PORTRAIT_URL); }

  create() {
    this.onInteract = this.game.registry.get("onInteract");
    makeTextures(this);

    this.add.tileSprite(W / 2, H / 2, W, H, "floor_carpet").setDepth(0);
    this.lightPools = [
      { x: 200, y: 170, r: 110, sx: 1.5, sy: 0.9, a: 0.5 }, { x: 600, y: 170, r: 110, sx: 1.5, sy: 0.9, a: 0.5 },
      { x: 400, y: 330, r: 130, sx: 1.4, sy: 1.0, a: 0.45 }, { x: 200, y: 480, r: 110, sx: 1.5, sy: 0.9, a: 0.45 },
      { x: 620, y: 480, r: 110, sx: 1.5, sy: 0.9, a: 0.45 }
    ];
    this.lightPools.forEach(lp => {
      this.add.image(lp.x, lp.y, "glow_radial").setBlendMode(Phaser.BlendModes.ADD).setTint(0xf4e9b0).setAlpha(0.10).setScale(lp.sx * 1.6, lp.sy * 1.4).setDepth(1);
    });

    this.add.tileSprite(180, 24, 360, 48, "wall_yellow").setDepth(8);
    this.add.tileSprite(620, 24, 360, 48, "wall_yellow").setDepth(8);
    this.add.tileSprite(16, 300, 32, 600, "wall_yellow").setDepth(8);
    this.add.tileSprite(784, 300, 32, 600, "wall_yellow").setDepth(8);
    this.add.tileSprite(400, 584, 800, 32, "wall_yellow").setDepth(8);
    const rail = (x: number, y: number, w: number, h: number) => this.add.rectangle(x, y, w, h, 0xb4651e).setDepth(8);
    rail(180, 46, 360, 3); rail(620, 46, 360, 3); rail(31, 300, 3, 600); rail(769, 300, 3, 600); rail(400, 570, 800, 3);
    this.add.rectangle(400, 52, 800, 6, 0x000000, 0.25).setDepth(2);
    this.add.rectangle(35, 300, 6, 600, 0x000000, 0.2).setDepth(2);
    this.add.rectangle(765, 300, 6, 600, 0x000000, 0.2).setDepth(2);

    this.add.rectangle(400, 24, 80, 48, 0x000000).setDepth(1);
    this.add.rectangle(400, 24, 84, 52, 0x2a2416).setDepth(0);
    this.add.rectangle(400, 24, 80, 48, 0x000000).setDepth(1);
    this.shadowSprite = this.add.image(400, 46, "shadow_fig").setOrigin(0.5, 1).setScale(0.5).setAlpha(0).setDepth(2);
    this.add.image(400, 26, "exit_sign").setDepth(9);
    this.exitGlow = this.add.image(400, 26, "glow_radial").setBlendMode(Phaser.BlendModes.ADD).setTint(0xff3030).setScale(1.4, 0.7).setAlpha(0.4).setDepth(9);
    this.time.addEvent({ delay: 1300, loop: true, callback: () => {
      if (Math.random() < 0.3) this.tweens.add({ targets: this.exitGlow, alpha: 0.12, duration: 90, yoyo: true });
    }});

    this.add.image(300, 36, "outlet").setDepth(8);
    this.add.image(520, 30, "wall_clock").setDepth(8);
    this.add.image(782, 262, "note_paper").setAngle(2).setDepth(8);
    this.add.rectangle(16, 430, 32, 84, 0x101008).setDepth(7);
    this.add.rectangle(16, 386, 32, 4, 0x5a4f35).setDepth(7);
    this.add.rectangle(16, 474, 32, 4, 0x5a4f35).setDepth(7);

    this.add.image(600, 404, "desk").setDepth(404);
    this.add.image(600, 367, "crt_monitor").setDepth(367);
    this.add.image(612, 356, "sticky").setDepth(368);
    this.crtOn = this.add.rectangle(600, 364, 32, 22, 0x123512).setDepth(366).setVisible(false);
    this.crtText = this.add.text(600, 364, "", { fontFamily: "VT323", fontSize: "10px", color: "#7cfc7c", align: "left" }).setOrigin(0.5).setDepth(369).setVisible(false);
    this.crtGlow = this.add.image(600, 362, "glow_radial").setBlendMode(Phaser.BlendModes.ADD).setTint(0x66ff66).setScale(0.9, 0.7).setAlpha(0).setDepth(369);
    const pg = this.add.graphics().setDepth(520);
    pg.fillStyle(0x7a4a2a, 1); pg.fillRect(694, 516, 16, 12);
    pg.fillStyle(0x2e5a2e, 1); pg.fillRect(692, 500, 20, 16); pg.fillRect(696, 492, 12, 10);

    const solidRects = [
      [180, 24, 360, 48], [620, 24, 360, 48], [16, 300, 32, 600], [784, 300, 32, 600], [400, 584, 800, 32],
      [400, 20, 80, 24], [600, 402, 96, 44], [700, 516, 24, 20]
    ];
    solidRects.forEach(r => {
      const rect = this.add.rectangle(r[0], r[1], r[2], r[3], 0xff00ff, 0);
      this.physics.add.existing(rect, true);
      this.solidStore.push(rect);
    });

    this.player = this.physics.add.sprite(140, 470, "pf_d0");
    this.player.setCollideWorldBounds(true);
    this.player.setSize(12, 10); (this.player.body as Phaser.Physics.Arcade.Body).offset.set(6, 21);
    this.solidStore.forEach(r => this.physics.add.collider(this.player, r));

    if (!this.anims.exists("walk-down")) {
      this.anims.create({ key: "walk-down", frames: [{ key: "pf_d0" }, { key: "pf_d1" }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: "walk-up", frames: [{ key: "pf_u0" }, { key: "pf_u1" }], frameRate: 6, repeat: -1 });
      this.anims.create({ key: "walk-side", frames: [{ key: "pf_s0" }, { key: "pf_s1" }], frameRate: 6, repeat: -1 });
    }

    this.lightTex = this.textures.createCanvas("lightmap", W, H)!;
    this.lightCtx = this.lightTex.context;
    this.add.image(W / 2, H / 2, "lightmap").setDepth(50);

    this.add.image(W / 2, H / 2, "vignette").setDisplaySize(W, H).setDepth(51);
    this.add.tileSprite(W / 2, H / 2, W, H, "scanline").setAlpha(0.14).setDepth(52);
    this.grainTile = this.add.tileSprite(W / 2, H / 2, W, H, "grain").setAlpha(0.05).setDepth(53);

    this.barTop = this.add.rectangle(400, 35, 800, 90, 0x000000).setDepth(60);
    this.barBot = this.add.rectangle(400, 565, 800, 90, 0x000000).setDepth(60);
    this.tweens.add({ targets: this.barTop, y: -45, delay: 2000, duration: 600, ease: "Power2" });
    this.tweens.add({ targets: this.barBot, y: 645, delay: 2000, duration: 600, ease: "Power2", onComplete: () => { this.barTop.destroy(); this.barBot.destroy(); } });

    this.objText = this.add.text(12, 10, "", { fontFamily: '"Press Start 2P"', fontSize: "8px", color: "#d8d090", backgroundColor: "#000000aa", padding: { x: 6, y: 5 } }).setDepth(70);
    this.setObjective("log in to the terminal");
    this.add.text(W - 12, H - 26, "WASD move · E interact · M mute · ESC pause", { fontFamily: "VT323", fontSize: "16px", color: "#8a8a7a" }).setOrigin(1, 0.5).setAlpha(0.7).setDepth(70);
    this.add.text(12, H - 26, "v0.1 liminal build", { fontFamily: "VT323", fontSize: "16px", color: "#55554c" }).setOrigin(0, 0.5).setAlpha(0.7).setDepth(70);
    this.promptText = this.add.text(400, 300, "", { fontFamily: '"Press Start 2P"', fontSize: "8px", color: "#ffffff", backgroundColor: "#000000cc", padding: { x: 5, y: 4 } }).setOrigin(0.5).setDepth(70).setVisible(false);
    this.tweens.add({ targets: this.promptText, y: "-=3", duration: 500, yoyo: true, repeat: -1 });
    this.toastText = this.add.text(400, 70, "", { fontFamily: '"Press Start 2P"', fontSize: "8px", color: "#ffffff", backgroundColor: "#000000cc", padding: { x: 6, y: 5 } }).setOrigin(0.5).setDepth(71).setVisible(false);



    this.endBg = this.add.rectangle(400, 300, W, H, 0x000000).setDepth(95).setVisible(false);
    this.endT1 = this.add.text(400, 240, "LEVEL 0 // EXIT REACHED", { fontFamily: '"Press Start 2P"', fontSize: "16px", color: "#e3dd9a" }).setOrigin(0.5).setDepth(96).setVisible(false);
    this.endT2 = this.add.text(400, 290, "you stepped through. demo complete.", { fontFamily: "VT323", fontSize: "22px", color: "#9a9a8a" }).setOrigin(0.5).setDepth(96).setVisible(false);
    this.endT3 = this.add.text(400, 360, "[R] WAKE UP", { fontFamily: '"Press Start 2P"', fontSize: "10px", color: "#ffffff" }).setOrigin(0.5).setDepth(96).setVisible(false);
    this.tweens.add({ targets: this.endT3, alpha: 0, duration: 450, yoyo: true, repeat: -1 });

    this.pauseBg = this.add.rectangle(400, 300, W, H, 0x000000, 0.72).setDepth(90).setVisible(false);
    this.pauseT = this.add.text(400, 280, "PAUSED", { fontFamily: '"Press Start 2P"', fontSize: "20px", color: "#e3dd9a" }).setOrigin(0.5).setDepth(91).setVisible(false);
    this.pauseH = this.add.text(400, 330, "ESC resume · M mute", { fontFamily: "VT323", fontSize: "20px", color: "#9a9a8a" }).setOrigin(0.5).setDepth(91).setVisible(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.time.addEvent({ delay: 1900, loop: true, callback: () => {
      if (Math.random() < 0.3) { this.flickTicks = 4 + ((Math.random() * 5) | 0); soundKit.buzz(); }
    }});

    this.cameras.main.fadeIn(1000);
    this.time.addEvent({ delay: 2600, callback: () => {
      this.startDialogue([
        { name: "FAYE", text: "oh good, you're awake. that last script sucked us straight into the server." },
        { name: "FAYE", text: "this sector... all yellow corridors and humming lights. the backrooms of the system." },
        { name: "FAYE", text: "walk to the old terminal and press [E] to log in. i'll guide you from there." }
      ]);
    }});
  }

  setObjective(s: string) { this.objText.setText("OBJ // " + s); }
  toast(s: string) { this.toastText.setText(s).setVisible(true).setAlpha(1); this.tweens.add({ targets: this.toastText, alpha: 0, delay: 1400, duration: 400, onComplete: () => this.toastText.setVisible(false) }); }

  startDialogue(lines: any[], onClose?: () => void) {
    if (this.dlg.active) return;
    this.dlg.active = true; this.dlg.lines = lines; this.dlg.idx = 0; this.dlg.onClose = onClose || null;
    this.promptText.setVisible(false);
    this.setupLine();
  }
  setupLine() {
    const line = this.dlg.lines[this.dlg.idx];
    if (line) {
      const speak = this.game.registry.get('onFayeSpeak') as ((text: string) => void) | undefined;
      if (speak) speak(line.text);
    }
  }
  typeStep(_delta: number) {
    // In-canvas typing omitted; React primary dialogue displays text
  }
  advanceDialogue() {
    const d = this.dlg;
    d.idx++;
    if (d.idx < d.lines.length) this.setupLine();
    else {
      d.active = false;
      this.cooldown = this.time.now + 250;
      if (d.onClose) { const cb = d.onClose; d.onClose = null; cb(); }
    }
  }

  completeLogin() {
    this.logged = true; this.exitUnlocked = true; this.baseDark = 0.6;
    this.crtOn.setVisible(true); this.crtText.setVisible(true);
    this.tweens.add({ targets: this.crtGlow, alpha: 0.35, duration: 300 });
    const lines = ["> FAYE LINK: OK", "> EXIT DOOR:", ">> UNLOCKED", "> beware the hum"];
    lines.forEach((ln, i) => this.time.addEvent({ delay: 500 * (i + 1), callback: () => {
      this.crtText.setText(this.crtText.text + ln + "\n"); soundKit.blip();
    }}));
    soundKit.chime();
    this.setObjective("escape through the EXIT door");
    this.time.addEvent({ delay: 11000, callback: () => this.triggerShadow() });
  }
  triggerShadow() {
    if (this.shadowDone || this.endShown) return; this.shadowDone = true;
    this.flickTicks = 12; soundKit.whisper();
    this.cameras.main.shake(260, 0.006);
    this.tweens.add({ targets: this.shadowSprite, alpha: 1, duration: 180, onComplete: () => {
      this.tweens.add({ targets: this.shadowSprite, alpha: 0, delay: 900, duration: 220 });
    }});
    this.time.addEvent({ delay: 2600, callback: () => {
      this.startDialogue([{ name: "FAYE", text: "that thing wasn't in the build. keep moving. KEEP MOVING." }]);
    }});
  }
  startExit() {
    this.inputLocked = true; this.promptText.setVisible(false);
    soundKit.drone(2.2);
    this.cameras.main.fadeOut(1600);
    this.cameras.main.once("camerafadeoutcomplete", () => {
      this.endShown = true;
      [this.endBg, this.endT1, this.endT2, this.endT3].forEach(o => o.setVisible(true));
    });
  }

  punch(cx: CanvasRenderingContext2D, x: number, y: number, r: number, sx: number, sy: number, a: number) {
    cx.save(); cx.translate(x, y); cx.scale(sx, sy);
    const gr = cx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
    gr.addColorStop(0, "rgba(0,0,0," + a + ")"); gr.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = gr; cx.beginPath(); cx.arc(0, 0, r, 0, Math.PI * 2); cx.fill(); cx.restore();
  }
  redrawLights() {
    const cx = this.lightCtx;
    cx.globalCompositeOperation = "source-over";
    cx.clearRect(0, 0, W, H);
    cx.fillStyle = "rgba(2,4,8," + this.darkAlpha.toFixed(3) + ")";
    cx.fillRect(0, 0, W, H);
    cx.globalCompositeOperation = "destination-out";
    this.lightPools.forEach(lp => this.punch(cx, lp.x, lp.y, lp.r, lp.sx, lp.sy, lp.a));
    this.punch(cx, this.player.x, this.player.y - 6, 80, 1, 0.8, 0.55);
    if (this.logged) this.punch(cx, 600, 362, 70, 1, 0.8, 0.5);
    this.punch(cx, 400, 40, 60, 1.6, 0.8, 0.5);
    this.punch(cx, 400, 60, 50, 1.2, 0.7, 0.15);
    this.lightTex.refresh();
  }

  computeNear() {
    const p = this.player;
    if (Phaser.Math.Distance.Between(p.x, p.y, 600, 396) < 62) return { id: "computer", label: this.logged ? "[E] terminal" : "[E] log in to terminal" };
    if (Phaser.Math.Distance.Between(p.x, p.y, 756, 262) < 46) return { id: "note", label: "[E] read the note" };
    if (p.y < 118 && Math.abs(p.x - 400) < 52) return { id: "door", label: this.exitUnlocked ? "[E] escape through the EXIT" : "[E] try the door" };
    if (Math.abs(p.x - 64) < 46 && Math.abs(p.y - 430) < 50) return { id: "side", label: "[E] peek down the side hall" };
    return null;
  }
  doInteract(id: string) {
    if (id === "computer") {
      if (!this.logged) {
        this.onInteract && this.onInteract("computer");
        this.startDialogue([
          { name: "FAYE", text: "handshake accepted... you're in. i can see you from the terminal. creepy, right?" },
          { name: "FAYE", text: "i popped the lock on the EXIT door up top. go. and... don't look at what's standing in the doorway." }
        ], () => this.completeLogin());
      } else {
        this.startDialogue([{ name: "FAYE", text: "the terminal's dry. whatever let us in already logged out. go." }]);
      }
    } else if (id === "note") {
      this.startDialogue([{ name: "? ? ?", text: "a crumpled note taped to the wallpaper. 'WHERE AM I?' ...the handwriting is yours." }]);
    } else if (id === "door") {
      if (!this.exitUnlocked) this.startDialogue([{ name: "? ? ?", text: "sealed. behind the paint, something hums at 60 hertz." }]);
      else this.startExit();
    } else if (id === "side") {
      this.startDialogue([{ name: "? ? ?", text: "the side hall loops back into itself. non-euclidean. don't." }]);
    }
  }

  togglePause() {
    this.paused = !this.paused;
    [this.pauseBg, this.pauseT, this.pauseH].forEach(o => o.setVisible(this.paused));
    if (this.paused) this.player.setVelocity(0, 0);
  }

  update(time: number, delta: number) {
    if (this.flickTicks > 0) { this.darkAlpha = this.baseDark + (Math.random() * 0.3 - 0.1); this.flickTicks--; }
    else { this.darkAlpha += (this.baseDark - this.darkAlpha) * 0.08; }
    this.redrawLights();
    this.grainTile.setTilePosition(Math.random() * 96, Math.random() * 96);

    if (this.endShown) { if (Phaser.Input.Keyboard.JustDown(this.keyR)) this.scene.restart(); return; }
    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) { this.togglePause(); }
    if (Phaser.Input.Keyboard.JustDown(this.keyM)) { soundKit.setMuted(!soundKit.muted); this.toast(soundKit.muted ? "MUTED" : "SOUND ON"); }
    if (this.paused) return;
    if (this.inputLocked) return;

    if (this.dlg.active) {
      this.typeStep(delta);
      if (Phaser.Input.Keyboard.JustDown(this.keyE) || Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.keyEnter)) this.advanceDialogue();
      this.player.setVelocity(0, 0);
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body, speed = 160;
    let vx = 0, vy = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.keyD.isDown) vx = speed;
    if (this.cursors.up.isDown || this.keyW.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.keyS.isDown) vy = speed;
    body.setVelocity(vx, vy);

    const moving = (vx !== 0 || vy !== 0);
    if (moving) {
      this.stepAcc += delta;
      if (this.stepAcc > 300) { this.stepAcc = 0; soundKit.step(); }
      if (Math.abs(vx) > Math.abs(vy)) { this.facing = "side"; this.player.setFlipX(vx < 0); this.player.play("walk-side", true); }
      else if (vy > 0) { this.facing = "down"; this.player.play("walk-down", true); }
      else { this.facing = "up"; this.player.play("walk-up", true); }
    } else {
      this.player.stop();
      this.player.setTexture(this.facing === "side" ? "pf_s0" : (this.facing === "up" ? "pf_u0" : "pf_d0"));
    }
    this.player.setDepth(this.player.y);

    this.nearTarget = this.computeNear();
    if (this.nearTarget && time > this.cooldown) {
      this.promptText.setText(this.nearTarget.label);
      this.promptText.setPosition(this.player.x, Math.max(70, this.player.y - 44));
      this.promptText.setVisible(true);
      if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.doInteract(this.nearTarget.id);
    } else { this.promptText.setVisible(false); }
  }
}
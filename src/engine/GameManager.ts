// Game State Manager connecting Phaser 3 World with React & Linux Terminal Simulator

export interface RoomConfig {
  id: string;
  name: string;
  path: string;
  level: number;
  unlocked: boolean;
  color: string;
  wallpaperColor: string;
  floorColor: string;
  objective: string;
  fairyHint: string;
  commandHint: string;
  requiredCommandPattern: RegExp;
  anomalyActive: boolean;
}

export const ROOMS_DATA: Record<string, RoomConfig> = {
  root: {
    id: "root",
    name: "Level 0: Yellow Monotony (/root)",
    path: "/root",
    level: 0,
    unlocked: true,
    color: "#f59e0b", // Amber / Liminal Yellow
    wallpaperColor: "#423819",
    floorColor: "#2b2512",
    objective: "Check where you are with 'pwd' and read 'key.txt' with 'cat key.txt' to unlock the exit door!",
    fairyHint: "🧚🏼‍♀️ Hello lost user! You're stuck in Level 0 (/root). Run 'pwd' to check your path, then inspect the key file with 'cat key.txt'!",
    commandHint: "cat key.txt",
    requiredCommandPattern: /cat\s+key\.txt|ls/i,
    anomalyActive: false,
  },
  home: {
    id: "home",
    name: "Level 1: Cubicle Maze (/home)",
    path: "/home",
    level: 1,
    unlocked: false,
    color: "#3b82f6", // Blue / Workspaces
    wallpaperColor: "#1e293b",
    floorColor: "#0f172a",
    objective: "Create your personal directory with 'mkdir player_room' and assign permissions with 'chmod 755 player_room'!",
    fairyHint: "🧚🏼‍♀️ We reached /home! To claim your space and unlock the next security door, create a room with 'mkdir player_room' and run 'chmod 755 player_room'!",
    commandHint: "mkdir player_room && chmod 755 player_room",
    requiredCommandPattern: /(mkdir\s+player_room|chmod\s+(755|u\+x)\s+player_room)/i,
    anomalyActive: false,
  },
  etc: {
    id: "etc",
    name: "Level 2: Pipe Dreams (/etc)",
    path: "/etc",
    level: 2,
    unlocked: false,
    color: "#10b981", // Green / Configs
    wallpaperColor: "#064e3b",
    floorColor: "#022c22",
    objective: "Filter the passwd file using 'grep user passwd' or view system hosts with 'cat hosts' to unlock security grid!",
    fairyHint: "🧚🏼‍♀️ Look at all these server pipes! We need system credentials. Search the password file using 'grep user passwd' or 'cat hosts'!",
    commandHint: "grep user passwd",
    requiredCommandPattern: /(grep\s+.*passwd|cat\s+hosts|cat\s+passwd)/i,
    anomalyActive: false,
  },
  var: {
    id: "var",
    name: "Level 3: Poolrooms (/var)",
    path: "/var",
    level: 3,
    unlocked: false,
    color: "#06b6d4", // Cyan / Logs & Water
    wallpaperColor: "#164e63",
    floorColor: "#083344",
    objective: "Inspect system log file with 'tail -n 5 sys.log' or check storage with 'df -h' to drain the waters!",
    fairyHint: "🧚🏼‍♀️ It's flooding in /var/log! Check the latest log entries with 'tail -n 5 sys.log' or check disk space with 'df -h' to drain the water!",
    commandHint: "tail -n 5 sys.log",
    requiredCommandPattern: /(tail|head|cat\s+sys\.log|df)/i,
    anomalyActive: false,
  },
  tmp: {
    id: "tmp",
    name: "Level 4: Glitch Void (/tmp)",
    path: "/tmp",
    level: 4,
    unlocked: false,
    color: "#a855f7", // Purple / Glitch Anomaly
    wallpaperColor: "#581c87",
    floorColor: "#3b0764",
    objective: "Banish the corrupted temporary anomaly by removing it with 'rm anomaly.tmp'!",
    fairyHint: "🧚🏼‍♀️ Warning! A corrupted glitch anomaly is distorting space in /tmp! Purge it immediately with 'rm anomaly.tmp'!",
    commandHint: "rm anomaly.tmp",
    requiredCommandPattern: /rm\s+(anomaly\.tmp|-rf\s+anomaly\.tmp)/i,
    anomalyActive: true,
  },
  usr: {
    id: "usr",
    name: "Level 5: Central Engine Room (/usr)",
    path: "/usr",
    level: 5,
    unlocked: false,
    color: "#ef4444", // Red / Core Boss
    wallpaperColor: "#7f1d1d",
    floorColor: "#450a0a",
    objective: "Inspect running processes with 'ps aux' and terminate the Boss Anomaly process 9999 with 'kill -9 9999'!",
    fairyHint: "🧚🏼‍♀️ THIS IS IT! The Master Glitch Anomaly is running process ID 9999 in /usr! Check processes with 'ps aux' and destroy it with 'kill -9 9999'!",
    commandHint: "ps aux then kill -9 9999",
    requiredCommandPattern: /(kill\s+(-9\s+)?9999|ps\s+aux)/i,
    anomalyActive: true,
  },
};

type Listener = () => void;

class GameManager {
  private rooms: Record<string, RoomConfig> = { ...ROOMS_DATA };
  private currentRoomId: string = "root";
  private isTerminalOpen: boolean = false;
  private listeners: Set<Listener> = new Set();
  private gameWon: boolean = false;
  private solvedObjectives: Set<string> = new Set();
  private notificationMessage: string | null = null;

  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getRooms(): Record<string, RoomConfig> {
    return this.rooms;
  }

  public getCurrentRoom(): RoomConfig {
    return this.rooms[this.currentRoomId];
  }

  public setCurrentRoom(roomId: string) {
    if (this.rooms[roomId] && this.rooms[roomId].unlocked) {
      this.currentRoomId = roomId;
      this.notify();
    }
  }

  public isTerminalOpened(): boolean {
    return this.isTerminalOpen;
  }

  public setTerminalOpen(open: boolean) {
    this.isTerminalOpen = open;
    this.notify();
  }

  public isGameWon(): boolean {
    return this.gameWon;
  }

  public getNotification(): string | null {
    return this.notificationMessage;
  }

  public setNotification(msg: string | null) {
    this.notificationMessage = msg;
    this.notify();
    if (msg) {
      setTimeout(() => {
        if (this.notificationMessage === msg) {
          this.notificationMessage = null;
          this.notify();
        }
      }, 4000);
    }
  }

  // Handle command submission from terminal to check puzzle solutions
  public evaluateCommand(command: string): { success: boolean; message: string } {
    const current = this.getCurrentRoom();
    const cleanCmd = command.trim();

    if (current.requiredCommandPattern.test(cleanCmd)) {
      this.solvedObjectives.add(current.id);

      // Unlock next room in sequence
      const roomKeys = Object.keys(this.rooms);
      const currentIndex = roomKeys.indexOf(current.id);

      if (currentIndex < roomKeys.length - 1) {
        const nextRoomId = roomKeys[currentIndex + 1];
        this.rooms[nextRoomId].unlocked = true;

        if (current.id === "tmp") {
          this.rooms.tmp.anomalyActive = false;
        }

        this.setNotification(`✨ ACCESS GRANTED! Unlocked portal to ${this.rooms[nextRoomId].name}`);
        this.notify();
        return {
          success: true,
          message: `[SECURITY OVERRIDE SUCCESS] Door to ${this.rooms[nextRoomId].path} has been unlocked!`,
        };
      } else if (current.id === "usr" && /kill/i.test(cleanCmd)) {
        this.rooms.usr.anomalyActive = false;
        this.gameWon = true;
        this.setNotification("🎉 VICTORY! Boss Glitch Banished! You escaped the Backrooms!");
        this.notify();
        return {
          success: true,
          message: `[CRITICAL ANOMALY PURGED] Process 9999 terminated! Backrooms stability restored! YOU WIN!`,
        };
      }
    }

    return { success: false, message: "" };
  }

  public resetGame() {
    this.rooms = JSON.parse(JSON.stringify(ROOMS_DATA));
    this.currentRoomId = "root";
    this.isTerminalOpen = false;
    this.gameWon = false;
    this.solvedObjectives.clear();
    this.notificationMessage = null;
    this.notify();
  }
}

export const gameManager = new GameManager();

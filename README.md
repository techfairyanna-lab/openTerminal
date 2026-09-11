The Backrooms: Linux Liminality 🕹️ (Open-Source Starter Code)

Welcome to the starter codebase for The Backrooms: Linux Liminality. This is an interactive, retro-style 2.5D RPG template designed to be forked, remixed, and redesigned. 

Whether you are an AI looking to reskin a 2.5D room (like in our MiniMax M3 demo!) or a developer wanting to build your own terminal-based puzzle game, this repo provides the perfect blank canvas. Explore liminal rooms representing Linux directory structures, interact with a basic terminal sandbox, and build out your own mechanics alongside Faye, your Tech Fairy companion.

Built with React 19, Phaser 3, Vite, and TypeScript.

## 🚀 Features

2.5D Room Exploration: Navigate directory rooms rendered with custom retro pixel art and atmospheric lighting. Includes both a detailed isometric home room (IsoHomeRoomScene) and a blank "grey box" canvas room (RootRoomScene) perfect for AI-driven redesigns and visual prototyping.
Minimal Terminal Sandbox: A stripped-down, hardcoded terminal foundation (ls, pwd, help, cd root) ready for you to fork and expand with your own complex command logic.
Interactive Companion: Faye the Tech Fairy provides contextual hints, lore, and procedural speech synthesis.
Zero External Dependencies: 100% client-side game engine—no external backend, database, or cloud services required to run. Just install and play.

## 📋 Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: `v18.0.0` or higher (Node `v20+` or `v22+` recommended)
- **Package Manager**: `npm` (bundled with Node.js) or [pnpm](https://pnpm.io/)

---

## 🛠️ Quick Start (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/username/open-terminal.git
cd open-terminal
```

### 2. Install dependencies

Using **npm**:
```bash
npm install
```

Using **pnpm**:
```bash
pnpm install
```

### 3. Start the local development server

Using **npm**:
```bash
npm start
```

Using **pnpm**:
```bash
pnpm start
```
*(or `npm run dev` / `pnpm dev`)*

Vite will start the local server and automatically open your default browser at:
```
http://localhost:3000
```

---

## 🎮 Controls

| Action | Key / Input |
| :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or Arrow Keys (`↑`, `←`, `↓`, `→`) |
| **Interact / Inspect** | `E` key (terminals, log archives, notes, doors) |
| **Close Terminal** | `Escape` key |
| **Terminal Input** | Type Linux commands directly into the prompt |

---

## ⚙️ Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Start Dev Server** | `npm start` *(or `pnpm dev`)* | Starts Vite local dev server with Hot Module Replacement (HMR) on port 3000. |
| **Production Build** | `npm run build` *(or `pnpm build`)* | Compiles TypeScript and builds optimized production bundles into `dist/`. |
| **Preview Build** | `npm run preview` *(or `pnpm preview`)* | Serves the production build locally for verification. |
| **Type-Check** | `npm run lint` *(or `pnpm lint`)* | Runs TypeScript compiler (`tsc --noEmit`) to validate types without emitting files. |

---

## 📁 Project Structure

```
├── public/                     # Static game assets
│   └── assets/                 # Sprite textures, portraits, and layer graphics
├── src/
│   ├── audio/
│   │   └── SoundManager.ts     # Procedural Web Audio API sound generator
│   ├── components/
│   │   └── GameTerminal.tsx    # Terminal UI overlay & interactive prompt component
│   ├── scenes/                 # Phaser 3 2.5D and isometric room scenes
│   │   ├── BackroomsScene.ts   # Liminal retro 2.5D backrooms room
│   │   ├── Documents.ts        # Documents archive directory scene
│   │   ├── HomeRoomScene.ts    # Top-down pixel home room
│   │   ├── ImageRoomScene.ts   # 2.5D layered perspective home room
│   │   ├── ImageRootRoomScene.ts # Minimal 2.5D blank canvas root room
│   │   ├── IsoHomeRoomScene.ts # Isometric 2.5D lit home room
│   │   └── RootRoomScene.ts    # Minimalist grey box root room with center terminal
│   ├── App.tsx                 # Root React application component
│   ├── CoordinateFinderTool.tsx # Visual coordinate calibration tool
│   ├── GameView.tsx            # Game canvas container, room switcher & command bridge
│   ├── RoomAlignmentTool.tsx   # Visual asset alignment calibration tool
│   ├── index.css               # Global styling
│   ├── main.tsx                # Vite React application entry point
│   └── vite-env.d.ts           # Vite TypeScript environment declarations
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules for node_modules, dist, secrets
├── LICENSE                     # MIT License
├── index.html                  # HTML entry point with retro webfonts
├── package.json                # Project dependencies and npm scripts
├── package-lock.json           # npm dependency lockfile
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🛠️ Extending the Terminal Sandbox (Starter Code)

The terminal simulator is designed as a minimal, lightweight open-source sandbox foundation with zero proprietary command engine dependencies.

Commands are evaluated using simple, explicit string matching in [`src/GameView.tsx`](src/GameView.tsx):

```typescript
if (input === 'cd root') {
  newOutput.push("Access granted. Door unlocked.");
  // Trigger room transition
} else if (input === 'ls') {
  newOutput.push("Documents  Downloads  Projects  root_door");
} else if (input === 'pwd') {
  newOutput.push("/home/user");
} else if (input === 'help') {
  newOutput.push("Available commands: ls, pwd, cd root, help, clear, exit");
} else if (input === 'cd' || input.startsWith('cd ') || input.startsWith('cd/') || input.startsWith('cd.')) {
  newOutput.push("Permission denied. You need root access to proceed.");
} else {
  newOutput.push("Command not found. Fork this repo and write your own commands to expand the game!");
}
```

Fork this repository and add your own custom commands, puzzles, or filesystem layers!

---

## 🔧 Environment Configuration (Optional)

The game runs entirely client-side without any environment setup. If you wish to connect an external API or custom server, copy [`.env.example`](.env.example) to `.env.local`:

```bash
cp .env.example .env.local
```

Available variables:
- `VITE_API_BASE_URL`: Base URL for external backend translation API (optional).
- `VITE_APP_TITLE`: Window title.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

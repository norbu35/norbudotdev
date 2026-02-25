# Architecture

> System component map, data flow, and scene structure for the norbu.dev puzzle game.

---

## High-Level Structure

```
norbu.dev/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing / lore (Axiom introduction)
│   ├── layout.tsx              # Root layout with wallpaper, font, global state
│   ├── terminal/               # Echo terminal room
│   │   └── page.tsx
│   ├── grid/                   # The-Grid puzzle hub (map of all puzzle nodes)
│   │   └── page.tsx
│   └── [puzzleId]/             # Individual puzzle scenes
│       └── page.tsx
│
├── components/
│   ├── wallpaper/              # Background wallpaper (r3f / CSS)
│   ├── terminal/               # Interactive terminal component
│   ├── lore/                   # Narrative text blocks
│   ├── pixi/                   # Pixi.js canvas wrapper + puzzle scenes
│   └── ui/                     # Shared UI (buttons, panels, tags)
│
├── lib/
│   ├── store.ts                # Zustand game state
│   ├── puzzles/                # Puzzle definitions (JS metadata)
│   └── wasm.ts                 # Wasm module loader + typed FFI wrappers
│
├── puzzle-engine/              # Rust crate (compiled → pkg/ via wasm-pack)
│   ├── src/
│   │   ├── lib.rs
│   │   ├── cipher.rs           # Encryption/decryption puzzle logic
│   │   ├── grid.rs             # Grid state, pathfinding, node traversal
│   │   ├── spectre.rs          # Anomaly simulation / divergence engine
│   │   └── solver.rs           # Constraint solver for lock puzzles
│   └── pkg/                    # wasm-pack output (imported by lib/wasm.ts)
│
├── shaders/                    # GLSL shader files
│   ├── crt.glsl                # CRT scanline + barrel distortion
│   ├── bloom.glsl              # Neon bloom pass
│   └── glitch.glsl             # Spectre anomaly glitch effect
│
├── public/
│   ├── fonts/                  # VT323, any pixel fonts
│   └── audio/                  # Ambient, SFX
│
└── docs/                       # This directory
```

---

## Scene Graph

```
Landing (/)
│
├── Terminal Room (/terminal)
│   └── Echo interface — player types commands, Wasm processes responses
│
└── The Grid (/grid)
    ├── Puzzle: TRANSIT       — network routing puzzle
    ├── Puzzle: BASTION       — identity/auth cipher
    ├── Puzzle: ARGUS         — log timeline anomaly puzzle
    ├── Puzzle: SPECTRE       — temporal divergence (non-linear)
    └── Puzzle: UPLINK        — encrypted data recovery
```

---

## Data Flow

```
Player Input
     │
     ▼
React Component (UI layer)
     │
     ├── Simple UI state → Zustand store
     │
     └── Compute-heavy logic → lib/wasm.ts (typed wrapper)
                                      │
                                      ▼
                            puzzle-engine.wasm (Rust)
                                      │
                            Returns result (primitive / JSON)
                                      │
                                      ▼
                            Zustand store updated
                                      │
                                      ▼
                            Pixi.js scene re-renders
```

---

## Game State Shape

```typescript
interface GameState {
  // Progress
  unlockedPuzzles: Set<string>;
  completedPuzzles: Set<string>;
  discoveredKeys: Record<string, string>; // puzzleId → cipher key found

  // Current session
  activePuzzle: string | null;
  terminalHistory: string[];
  anomalyFlags: string[]; // spectre events observed

  // Meta
  operatorId: string; // generated on first visit
  sessionStart: number; // unix ms
}
```

---

## Rendering Layers (z-order)

| Layer             | Technology          | Content                               |
| ----------------- | ------------------- | ------------------------------------- |
| 0 — Wallpaper     | r3f / CSS           | Animated cyberpunk city backdrop      |
| 1 — Puzzle Canvas | Pixi.js             | Active puzzle scene                   |
| 2 — Shader Pass   | r3f post-processing | CRT, bloom, glitch                    |
| 3 — UI            | React / CSS         | HUD, panels, terminal                 |
| 4 — Overlay       | React               | Dialogue, lore reveals, notifications |

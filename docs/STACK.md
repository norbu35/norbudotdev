# Stack

> Chosen for performance, aesthetics, and compatibility with the Wasm-core architecture.

---

## Layer Map

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Runtime                      │
│                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  Next.js UI  │  │  Pixi.js    │  │  r3f / Three  │  │
│  │  (App Router)│  │  (Canvas)   │  │  (Shaders)    │  │
│  └──────┬───────┘  └──────┬──────┘  └───────┬───────┘  │
│         └─────────────────┼─────────────────┘          │
│                    JS / TS Bridge                        │
│                           │                             │
│  ┌────────────────────────▼────────────────────────┐   │
│  │              WebAssembly Module (Rust)           │   │
│  │   puzzle-engine · cipher · grid · spectre-sim   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │   Zustand    │  │  Web Audio  │  │  Supabase SDK │  │
│  │   (state)    │  │  (sfx/amb)  │  │  (optional)   │  │
│  └──────────────┘  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## Technologies

### Framework — Next.js (App Router)

- **Why**: React component model, file-based routing, API routes for game state persistence, static export support.
- **Alternative considered**: Vite + React — lacks built-in SSR/API routes.

### Rendering — Pixi.js

- **Why**: WebGL-accelerated 2D canvas; integrates cleanly inside React components as a managed canvas; supports pixel art rendering and sprite sheets natively.
- **Role**: Puzzle scene rendering, tile grids, character/entity sprites, neon light effects on canvas.
- **Alternative considered**: Phaser 3 — heavier, more opinionated, harder to compose with React.

### 3D / Shader Effects — `@react-three/fiber` + `drei`

- **Why**: Declarative Three.js in React; enables GPU shader passes for CRT scanlines, bloom, chromatic aberration, and glitch effects that match the cyberpunk aesthetic.
- **Role**: Background wallpaper (replacing current CSS animation), post-processing effects on puzzle scenes.

### Styling — SCSS + CSS Modules

- **Why**: Current SCSS system is solid; CSS Modules scope component styles without runtime overhead.
- **No change** from existing approach.

### Game State — Zustand

- **Why**: Minimal, zero-boilerplate, subscribe-based. Stores: current puzzle, discovered cipher keys, terminal history, chapter unlock state, anomaly flags.
- **Alternative considered**: Redux — unnecessary complexity at this scale.

### WebAssembly Core — Rust + wasm-pack

- **Why**: Rust compiles to efficient Wasm with no GC; `wasm-bindgen` provides typed JS↔Wasm FFI; zero-cost abstractions for hot game logic.
- **Role**: All compute-heavy puzzle logic. See [WASM.md](./WASM.md).

### Backend (Optional) — Supabase

- **Why**: Postgres + Auth + Realtime in one hosted service; drop-in Next.js integration.
- **Role**: Persist player progress, leaderboards, time-locked puzzle events, multiplayer co-op sessions.

### Language — TypeScript

- **Why**: Type safety across React components, Zustand store, and Wasm FFI boundary definitions.

---

## Dependency Summary

```
Production
  next               # Framework
  react / react-dom  # UI
  pixi.js            # 2D canvas rendering
  @react-three/fiber # 3D / shader layer
  @react-three/drei  # r3f helpers
  three              # Three.js (peer dep)
  zustand            # State management
  @supabase/ssr      # Backend SDK (optional)

Development
  wasm-pack          # Rust → Wasm build tool
  typescript
  sass
```

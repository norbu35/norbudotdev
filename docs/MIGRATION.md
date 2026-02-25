# Migration Plan

> Phased migration from the current Zola static site to the Next.js puzzle game stack.

---

## Guiding Principle

**Ship continuously.** Each phase leaves the site in a working, deployable state. Nothing big-bangs.

---

## Phase 0 — Foundation (Current state)

- [x] Zola site with VT323 pixel font, SCSS cyberpunk wallpaper
- [x] Interactive terminal (vanilla JS)
- [x] Axiom lore narrative content
- [ ] `docs/` architecture documentation ← _you are here_

---

## Phase 1 — Framework Migration

**Goal**: Identical visual result, new foundation.

1. Scaffold Next.js (App Router + TypeScript) in a `v3/` branch
2. Port `sass/main.scss` as-is — no visual changes
3. Convert `templates/` to React components:
   - `base.html` → `app/layout.tsx` + wallpaper component
   - `index.html` → `app/page.tsx` with lore section components
   - `terminal.js` → `components/terminal/Terminal.tsx`
4. Configure `next.config.ts` for SCSS, font loading
5. Verify: identical render to current Zola output
6. Deploy: switch DNS from Zola build to Next.js

**Output**: Next.js site, visually identical, SCSS intact.

---

## Phase 2 — Wasm Core

**Goal**: Rust puzzle engine compiled and callable from TypeScript.

1. Init `puzzle-engine/` Rust crate with `wasm-pack`
2. Implement `cipher.rs` — at minimum, one working cipher type
3. Wire `lib/wasm.ts` — typed FFI wrapper + `initWasm()` boot call
4. Wire into terminal: cipher-related terminal commands now route through Wasm
5. Write basic tests: `cargo test` for Rust logic, Jest for FFI wrapper

**Output**: Terminal commands `decode`, `scan` powered by Wasm.

---

## Phase 3 — The Grid (Puzzle Hub)

**Goal**: First playable area.

1. Implement `/grid` page — 2D Pixi.js canvas scene
2. `grid.rs` in Rust: grid state, node types (locked/accessible/anomalous)
3. Grid renders from Wasm state — JS only draws, Rust owns truth
4. First puzzle unlockable from the terminal (password found via lore)
5. Zustand store: persist unlock state to `localStorage`

**Output**: Navigable grid map, at least one puzzle accessible.

---

## Phase 4 — Puzzle Scenes

**Goal**: Actual playable puzzle loops.

Implement one puzzle per system component:

| Puzzle  | Mechanic                                                  | Wasm module  |
| ------- | --------------------------------------------------------- | ------------ |
| TRANSIT | Wire-routing / network flow                               | `grid.rs`    |
| BASTION | Identity cipher — decode your operator key                | `cipher.rs`  |
| ARGUS   | Timeline reconstruction — reorder scrambled log events    | `solver.rs`  |
| SPECTRE | Non-linear — solve a puzzle that changes between attempts | `spectre.rs` |

Each puzzle: Pixi.js scene + Wasm logic + Zustand state update on completion.

---

## Phase 5 — Shader Pass & Polish

**Goal**: Full visual fidelity.

1. Replace CSS wallpaper with `@react-three/fiber` + GLSL shaders
2. CRT scanline + barrel distortion post-processing pass
3. Neon bloom on puzzle canvas
4. Spectre glitch effect (triggers when anomaly score > threshold)
5. Ambient audio layer (Web Audio API)
6. Mobile responsiveness audit

**Output**: Production-quality visual experience.

---

## Phase 6 — Backend (Optional)

**Goal**: Persistence, social, events.

1. Supabase project: player table, progress table, leaderboard
2. Auth: anonymous session on first visit, optional GitHub OAuth for named profile
3. Time-locked puzzles: new puzzle unlocks at a specific UTC timestamp
4. Co-op mode: shared cipher key — two operators must solve halves simultaneously

---

## Deployment

| Phase       | Host                 | Method                                |
| ----------- | -------------------- | ------------------------------------- |
| 0 (current) | Any static host      | `zola build`                          |
| 1+          | Vercel (recommended) | `next build`, auto-deploy from GitHub |
| 6 (backend) | Vercel + Supabase    | Supabase managed Postgres             |

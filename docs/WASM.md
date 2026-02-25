# WebAssembly Engine

> The puzzle-engine Rust crate: what it owns, how it's built, and how JS calls it.

---

## Responsibility Boundary

Wasm owns the **compute core**. JS/TS owns the **surface**.

| Concern                       | Owner                |
| ----------------------------- | -------------------- |
| Puzzle logic / rules          | Wasm (Rust)          |
| Cipher encoding/decoding      | Wasm (Rust)          |
| Grid pathfinding              | Wasm (Rust)          |
| Constraint solving            | Wasm (Rust)          |
| Anomaly/divergence simulation | Wasm (Rust)          |
| DOM manipulation              | JS only              |
| Canvas / WebGL rendering      | JS (Pixi.js / r3f)   |
| Audio                         | JS (Web Audio)       |
| Routing, UI state             | JS (React / Zustand) |

---

## Module Layout

```
puzzle-engine/
├── Cargo.toml
└── src/
    ├── lib.rs          # wasm-bindgen exports, module root
    ├── cipher.rs       # XOR, substitution, Vigenère, custom ciphers
    ├── grid.rs         # 2D grid state, BFS/DFS/A* pathfinding
    ├── spectre.rs      # Pseudo-non-deterministic anomaly engine
    └── solver.rs       # Backtracking constraint solver for lock puzzles
```

### `cipher.rs`

Handles all in-game encryption mechanics. Exposes encode/decode functions for multiple cipher types used as puzzle mechanics. Can be seeded with an `operator_id` to generate player-specific cipher keys.

### `grid.rs`

Owns the grid data structure for the The-Grid puzzle hub and individual tile-based puzzles. Runs pathfinding for wire-routing and network-tracing puzzles. All coordinate math and state mutation happens here.

### `spectre.rs`

Simulates the "temporal inconsistency" mechanic. A seeded RNG engine that produces deterministic-but-opaque sequences — outputs can appear to precede their triggering inputs (by design). State divergence is logged for Argus puzzles.

### `solver.rs`

Backtracking solver for constraint-satisfaction lock/cipher puzzles. Runs significantly faster than JS for large puzzle spaces.

---

## Build

### Prerequisites

```bash
cargo install wasm-pack
```

### Compile

```bash
cd puzzle-engine
wasm-pack build --target web --out-dir pkg
```

Output in `puzzle-engine/pkg/`:

- `puzzle_engine_bg.wasm` — binary module
- `puzzle_engine.js` — JS glue (auto-generated)
- `puzzle_engine.d.ts` — TypeScript types (auto-generated)

### Integration

```typescript
// lib/wasm.ts
import init, {
  solve_cipher,
  trace_path,
} from '../puzzle-engine/pkg/puzzle_engine.js';

let wasmReady = false;

export async function initWasm() {
  await init();
  wasmReady = true;
}

export function decodeCipher(input: string, key: number): string {
  if (!wasmReady) throw new Error('Wasm not initialized');
  return solve_cipher(input, key);
}
```

---

## FFI Contract (example exports)

```rust
use wasm_bindgen::prelude::*;

/// Decode a cipher string with the given operator key
#[wasm_bindgen]
pub fn solve_cipher(input: &str, key: u32) -> String { ... }

/// Find shortest path between two grid nodes
/// Returns JSON-encoded Vec<[u8; 2]> of coordinates
#[wasm_bindgen]
pub fn trace_path(grid: &[u8], width: u32, from: u32, to: u32) -> String { ... }

/// Tick the spectre anomaly engine, returns divergence score 0.0–1.0
#[wasm_bindgen]
pub fn spectre_tick(seed: u64, epoch: u32) -> f64 { ... }

/// Attempt to solve a constraint puzzle, returns solution or null
#[wasm_bindgen]
pub fn solve_constraints(puzzle_json: &str) -> Option<String> { ... }
```

---

## Performance Notes

- Wasm runs at **~70–80% of native speed** for compute-heavy logic vs ~10–20% for equivalent JS.
- No GC pauses — all memory is managed via Rust's ownership system.
- Cold-start load is ~50–200KB (depending on module size); initialize once at app boot via `initWasm()`.
- Keep individual JS↔Wasm calls coarse-grained — pass bulk data in typed arrays, not per-element calls.

---

## Language: Rust

### Why not C/C++?

Emscripten works, but the Rust toolchain (`wasm-pack`) is significantly friendlier and generates tighter, safer output.

### Why not AssemblyScript?

AssemblyScript (TypeScript → Wasm) has a lower learning curve but a weaker ecosystem, no ownership system (manual memory), and fewer game-relevant libraries.

### Why not Go?

Go's Wasm target embeds the full runtime (~2MB) and retains GC — both disqualifying for game-critical paths.

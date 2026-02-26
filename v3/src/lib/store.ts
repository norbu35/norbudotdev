import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  operatorId: string | null;
  sessionToken: string | null;
  setOperatorId: (id: string) => void;
  setSessionToken: (token: string) => void;
  initializeOperator: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      operatorId: null,
      sessionToken: null,
      setOperatorId: (id) => set({ operatorId: id }),
      setSessionToken: (token) => set({ sessionToken: token }),
      initializeOperator: () => {
        if (!get().operatorId) {
          const newId = crypto.randomUUID();
          set({ operatorId: newId });
        }
      },
    }),
    {
      name: 'axiom-operator-state',
    },
  ),
);

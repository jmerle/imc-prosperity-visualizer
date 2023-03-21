import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Algorithm, Theme } from './models';

export interface State {
  theme: Theme;
  idToken: string;
  round: string;

  algorithm: Algorithm | null;

  setTheme: (theme: Theme) => void;
  setIdToken: (idToken: string) => void;
  setRound: (round: string) => void;
  setAlgorithm: (algorithm: Algorithm | null) => void;
}

export const useStore = create(
  persist<State>(
    set => ({
      theme: 'system',
      idToken: '',
      round: 'ROUND0',

      algorithm: null,

      setTheme: theme => set({ theme }),
      setIdToken: idToken => set({ idToken }),
      setRound: round => set({ round }),
      setAlgorithm: algorithm => set({ algorithm }),
    }),
    {
      name: 'imc-prosperity-visualizer',
      partialize: state =>
        ({
          theme: state.theme,
          idToken: state.idToken,
          round: state.round,
        } as State),
    },
  ),
);

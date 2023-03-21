import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Algorithm, Theme } from './models';

export interface State {
  theme: Theme;
  idToken: string;
  round: string;
  corsProxy: string;

  algorithm: Algorithm | null;

  setTheme: (theme: Theme) => void;
  setIdToken: (idToken: string) => void;
  setRound: (round: string) => void;
  setCorsProxy: (corsProxy: string) => void;
  setAlgorithm: (algorithm: Algorithm | null) => void;
}

export const useStore = create(
  persist<State>(
    set => ({
      theme: 'system',
      idToken: '',
      round: 'ROUND0',
      corsProxy: 'https://imc-prosperity-visualizer-cors-anywhere.jmerle.dev/',

      algorithm: null,

      setTheme: theme => set({ theme }),
      setIdToken: idToken => set({ idToken }),
      setRound: round => set({ round }),
      setCorsProxy: corsProxy => set({ corsProxy }),
      setAlgorithm: algorithm => set({ algorithm }),
    }),
    {
      name: 'imc-prosperity-visualizer',
      partialize: state =>
        ({
          theme: state.theme,
          idToken: state.idToken,
          round: state.round,
          corsProxy: state.corsProxy,
        } as State),
    },
  ),
);

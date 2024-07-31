import { create } from "zustand";

interface TimerState {
  timer: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

let timerHandler: number | null = null;

export const useTimerStore = create<TimerState>((set) => ({
  timer: 0,

  startTimer: () => {
    if (timerHandler) return;
    timerHandler = setInterval(() => {
      set((state) => ({ timer: state.timer + 1 }));
    }, 1000);
  },

  stopTimer: () => {
    if (timerHandler) {
      clearInterval(timerHandler);
      timerHandler = null;
    }
  },

  resetTimer: () => {
    set({ timer: 0 });
    if (timerHandler) {
      clearInterval(timerHandler);
      timerHandler = null;
    }
  },
}));

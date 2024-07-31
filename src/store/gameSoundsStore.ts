import { Howl } from "howler";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import explosionSound from "@sounds/explosion.wav";
import sonarSound from "@sounds/sonar.wav";
import winSound from "@sounds/win.wav";

type SoundState = {
  muted: boolean;
  sonar: Howl;
  win: Howl;
  explosion: Howl;
  toggleMute: () => void;
};

export const useSoundStore = create<SoundState>()(
  devtools((set, get) => {
    return {
      muted: false,

      sonar: new Howl({ src: [sonarSound as string], volume: 0.5 }),
      win: new Howl({ src: [winSound as string], volume: 0.5 }),
      explosion: new Howl({ src: [explosionSound as string], volume: 0.5 }),

      toggleMute: () => {
        set({ muted: !get().muted });

        get().sonar.volume(get().muted ? 0 : 0.5);
        get().win.volume(get().muted ? 0 : 0.5);
        get().explosion.volume(get().muted ? 0 : 0.5);
      },
    };
  }),
);

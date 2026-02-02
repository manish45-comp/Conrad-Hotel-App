import { AudioPlayer, createAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";

export function useScanFeedback() {
  const successSound = useRef<AudioPlayer | null>(null);
  const errorSound = useRef<AudioPlayer | null>(null);

  useEffect(() => {
    successSound.current = createAudioPlayer(
      require("@/assets/sounds/scan-success.wav"),
    );

    errorSound.current = createAudioPlayer(
      require("@/assets/sounds/scan-error.wav"),
    );

    return () => {
      successSound.current?.release();
      errorSound.current?.release();
    };
  }, []);

  const playPlayer = async (player: AudioPlayer | null) => {
    if (!player) return;

    try {
      // ensure restart even if already playing
      player.seekTo(0);
      player.play();
    } catch (err) {
      console.warn("Audio play failed:", err);
    }
  };

  const playSuccess = async () => {
    playPlayer(successSound.current);

    // run haptics in parallel
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const playError = async () => {
    playPlayer(errorSound.current);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return {
    playSuccess,
    playError,
  };
}

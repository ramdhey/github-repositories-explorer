import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";
import type { Engine } from "tsparticles-engine";

export default function FireworksBg() {
  const init = useCallback(async (engine: Engine) => {
    await loadFireworksPreset(engine);
  }, []);

  return (
    <Particles
      id="fireworks"
      init={init}
      options={{
        preset: "fireworks",
        fullScreen: { zIndex: -1 },
        background: { color: "transparent" },
        sounds: {
          enable: false,
        },
      }}
    />
  );
}

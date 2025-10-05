
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadConfettiPreset } from "@tsparticles/preset-confetti";
import type { Container } from "@tsparticles/engine";

export default function Confetti() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadConfettiPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log("Particles container loaded", container);
  };

  const options = useMemo(() => {
    if (!init) return null;
      
      return {
        preset: "confetti",
        particles: {
          number: {
            value: 100,
          },
          shape: {
            type: "heart",
          },
          size: {
            value: { min: 5, max: 10 },
          },
          move: {
            speed: 2,
            direction: "bottom" as const,
            straight: true,
          },
          color: {
              value: ["#ff007f", "#ff4da6", "#ff7fbf", "#ffb3d9", "#ffe6f2"]
          }
        },
        fullScreen: {
          enable: true,
        }
      };
    },
    [init],
  );

  if (!init || !options) {
    return null;
  }

  return (
    <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options as any}
    />
  );
}

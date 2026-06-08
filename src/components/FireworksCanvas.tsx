/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from "react";

interface FireworksProps {
  activeScreen: "home" | "letter" | "memories" | "promises";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  size: number;
  sparkleChance: boolean;
}

interface Rocket {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  exploded: boolean;
}

export default function FireworksCanvas({ activeScreen }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeScreenRef = useRef(activeScreen);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
  }, [activeScreen]);

  useEffect(() => {
    // Only launch fireworks on memories or promises
    if (activeScreen !== "memories" && activeScreen !== "promises") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let rockets: Rocket[] = [];

    // Colors suited to romantic ambiance: vibrant neon pinks, cyans, violet, gold, and magenta sparkles.
    const colors = [
      "#ff5e97", // Hot pink
      "#ff2a6d", // Neon crimson
      "#c77dff", // Lavender
      "#38ef7d", // Light emerald
      "#00f5ff", // Electric cyan
      "#ffd700", // Gold shimmer
      "#ff9e00", // Soft orange
      "#ff007f", // Deep magenta
    ];

    // Handle resizing beautifully
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const createExplosion = (x: number, y: number, color: string) => {
      const particleCount = Math.floor(Math.random() * 45) + 40;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.5 + 2.0;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color,
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.009,
          gravity: 0.12,
          friction: 0.95,
          size: Math.random() * 2.2 + 1.2,
          sparkleChance: Math.random() > 0.4,
        });
      }
    };

    const spawnRocket = () => {
      const startX = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
      const startY = canvas.height + 10;
      const targetX = startX + (Math.random() - 0.5) * 160;
      const targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.15;

      const angle = Math.atan2(targetY - startY, targetX - startX);
      const speed = Math.random() * 4 + 8;
      const color = colors[Math.floor(Math.random() * colors.length)];

      rockets.push({
        x: startX,
        y: startY,
        tx: targetX,
        ty: targetY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * 2 + 1.8,
        opacity: 1,
        exploded: false,
      });
    };

    // Spawn 4 immediate romantic explosions directly at random positions when opening the screen
    for (let j = 0; j < 4; j++) {
      const rx = Math.random() * (canvas.width * 0.6) + canvas.width * 0.2;
      const ry = Math.random() * (canvas.height * 0.4) + canvas.height * 0.2;
      const rcol = colors[Math.floor(Math.random() * colors.length)];
      createExplosion(rx, ry, rcol);
    }

    // Continuously spawn rockets periodically
    const spawnInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        spawnRocket();
      }
    }, 1800);

    // Maintain a physics loop
    const tick = () => {
      // Clear with soft trails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "lighter";

      // 1. Process Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        
        // Draw rocket spark tail
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.size, 0, Math.PI * 2);
        ctx.fillStyle = r.color;
        ctx.fill();

        // Spawn beautiful subtle smoke particles
        if (Math.random() > 0.4) {
          particles.push({
            x: r.x,
            y: r.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.2 + 0.3,
            color: r.color,
            alpha: 0.6,
            decay: 0.04,
            gravity: 0.05,
            friction: 0.98,
            size: r.size * 0.6,
            sparkleChance: false,
          });
        }

        // Apply velocities
        r.x += r.vx;
        r.y += r.vy;

        // Decelerate as it reaches peak height
        r.vx *= 0.98;
        r.vy *= 0.98;

        // Explode if it is moving extremely slowly or exceeds height target
        if (r.vy >= -0.8 || r.y <= r.ty) {
          createExplosion(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // 2. Process Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;

        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw active glow particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        // Let romantic sparkles twinkle periodically
        if (p.sparkleChance && Math.random() > 0.85) {
          ctx.shadowBlur = Math.random() * 8 + 4;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(spawnInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeScreen]);

  // Keep rendering canvas full screen beneath the overlays securely
  if (activeScreen !== "memories" && activeScreen !== "promises") {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[25] transition-opacity duration-1000 select-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

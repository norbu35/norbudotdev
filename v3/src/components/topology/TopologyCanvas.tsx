"use client";

import { useEffect, useRef } from "react";
import styles from "./TopologyCanvas.module.scss";

export default function TopologyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initial node setup for structural noise
    const nodes = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    // Time-based drawing loop
    let lastTime = 0;
    const draw = (time: number) => {
      // Throttle to roughly ~25fps (40ms) to match Prelude feel
      if (time - lastTime < 40) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;

      ctx.fillStyle = "#04060b";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(118, 245, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;

        // Bounce off walls
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Randomly flicker visibility 
        if (Math.random() > 0.94) continue;

        ctx.fillStyle = Math.random() > 0.95 ? "#63e8ff" : "rgba(255,255,255,0.15)";
        ctx.fillRect(n1.x, n1.y, 1.5, 1.5);

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n2.x - n1.x, n2.y - n1.y);
          if (dist < 100 && Math.random() > 0.6) {
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}

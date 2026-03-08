import { useEffect, useRef } from "react";

const COLORS = ["#C084FC","#818CF8","#67E8F9","#34D399","#F472B6","#FBBF24","#60A5FA","#A78BFA"];
const SHAPES = ["circle","rect","ribbon"];

function rand(min, max) { return Math.random() * (max - min) + min; }

export default function Confetti({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 110 }, () => ({
      x: rand(0, canvas.width),
      y: rand(-200, -10),
      r: rand(5, 11),
      color: COLORS[Math.floor(rand(0, COLORS.length))],
      shape: SHAPES[Math.floor(rand(0, SHAPES.length))],
      vx: rand(-2, 2),
      vy: rand(3, 7),
      spin: rand(-0.15, 0.15),
      angle: rand(0, Math.PI * 2),
      opacity: 1,
      w: rand(6, 14), h: rand(3, 8),
    }));

    let frame;
    let done = false;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;
        p.vy += 0.08;
        if (p.y > canvas.height - 80) p.opacity -= 0.025;
        if (p.opacity > 0) alive++;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "rect") {
          ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.moveTo(-p.w/2, 0);
          ctx.bezierCurveTo(-p.w/4, -p.h, p.w/4, p.h, p.w/2, 0);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      if (alive > 0) {
        frame = requestAnimationFrame(draw);
      } else if (!done) {
        done = true;
        onDone && onDone();
      }
    }

    draw();
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        zIndex: 9998, width: "100%", height: "100%",
      }}
    />
  );
}

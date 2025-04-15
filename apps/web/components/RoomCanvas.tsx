"use client";
import { useRef, useEffect } from "react";
export const RoomCanvas = (roomId: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      let scrollX = 0;
      let scrollY = 0;
      let clicked = false;

      canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        scrollX = e.clientX;
        scrollY = e.clientY;
      });

      canvas.addEventListener("mouseup", (e) => {
        clicked = false;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
          const width = e.clientX - scrollX;
          const height = e.clientY - scrollY;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = "#09090b";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = "#fff";
          ctx.strokeRect(scrollX, scrollY, width, height);
        }
      });
    }
  }, [canvasRef]);
  return <canvas ref={canvasRef} width={1000} height={1000} />;
};

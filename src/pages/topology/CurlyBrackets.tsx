import React, { useEffect, useRef } from 'react';

const CurlyBrackets3Painter: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const chaoqianBoxPortDto: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = { width: canvas.width, height: canvas.height };
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    chaoqianBoxPortDto.forEach((value, i) => {
      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1.5;

      const path = new Path2D();
      path.moveTo(size.width * 0.5, 0);
      path.bezierCurveTo(
        size.width * 0.5,
        size.height * 0.4,
        size.width * ((i + 1) / (chaoqianBoxPortDto.length + 1)),
        size.height * 0.45,
        size.width * ((i + 1) / (chaoqianBoxPortDto.length + 1)),
        size.height * 0.9,
      );

      ctx.stroke(path);
    });
  }, [chaoqianBoxPortDto]);

  return (
    <canvas ref={canvasRef} width={500} height={150} style={{ border: '1px solid black' }}></canvas>
  );
};

export { CurlyBrackets3Painter };

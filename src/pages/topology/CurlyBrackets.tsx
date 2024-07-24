import { ChaoqianBoxPortDto } from '@/pages/topology/type';
import React, { useEffect, useRef } from 'react';
import fiberImage from './../../../src/assets/images/fiber.png';

interface OnuProp {
  chaoqianBoxPortDto: ChaoqianBoxPortDto[];
}

const CurlyBrackets3Painter: React.FC<OnuProp> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(new Image());

  const chaoqianBoxPortDto: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = { width: canvas.width, height: canvas.height };

    const image = imageRef.current;
    image.src = fiberImage;
    // 颜色滤镜
    const redColor = 'rgba(255, 0, 0, 1)'; // 红色

    image.onload = () => {
      ctx.clearRect(0, 0, size.width, size.height); // 每次绘制前清除画布

      chaoqianBoxPortDto.forEach((value, i) => {
        ctx.strokeStyle = 'grey';
        ctx.lineWidth = 1.5;

        const path = new Path2D();
        path.moveTo(size.width * 0.5, 0);
        path.bezierCurveTo(
          size.width * 0.5,
          size.height * 0.3,
          size.width * ((i + 1) / (chaoqianBoxPortDto.length + 1)),
          size.height * 0.4,
          size.width * ((i + 1) / (chaoqianBoxPortDto.length + 1)),
          size.height * 0.8,
        );

        ctx.stroke(path);

        // 绘制图片
        const imageX = size.width * ((i + 1) / (chaoqianBoxPortDto.length + 1)) - 20 / 2;
        const imageY = size.height * 0.9 - 15;

        ctx.drawImage(image, imageX, imageY, 20, 25);

        // 设置合成模式为“源在上”
        ctx.globalCompositeOperation = 'source-atop';

        // 绘制红色矩形以覆盖图片
        ctx.fillStyle = redColor;
        ctx.fillRect(imageX, imageY, 20, 25);

        // 恢复合成模式
        ctx.globalCompositeOperation = 'source-over';
      });
    };
  }, [chaoqianBoxPortDto]);

  return <canvas ref={canvasRef} width={500} height={180}></canvas>;
};

const LineCanvasWithText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置起点和终点坐标
    const startX = 0;
    const startY = 50;
    const endX = 300;
    const endY = 50;

    // 设置线条样式
    ctx.strokeStyle = 'blue'; // 线条颜色
    ctx.lineWidth = 2; // 线条宽度

    // 开始绘制路径
    ctx.beginPath();
    ctx.moveTo(startX, startY); // 移动到起点
    ctx.lineTo(endX, endY); // 绘制直线到终点
    ctx.stroke(); // 渲染线条

    // 绘制文字
    const textAbove = 'Above';
    const textBelow = 'Below';
    const textX = (startX + endX) / 2; // 文字水平居中
    const textYAbove = startY - 10; // 在线条上方显示文字，偏移10像素
    const textYBelow = endY + 20; // 在线条下方显示文字，偏移20像素

    ctx.fillStyle = 'black'; // 文字颜色
    ctx.font = '14px Arial'; // 文字样式
    ctx.textAlign = 'center'; // 文字水平居中
    ctx.fillText(textAbove, textX, textYAbove); // 绘制文字在线条上方
    ctx.fillText(textBelow, textX, textYBelow); // 绘制文字在线条下方

    // 清理上下文
    ctx.closePath();
  }, []);

  return <canvas ref={canvasRef} width={300} height={300} />;
};

export { CurlyBrackets3Painter, LineCanvasWithText };

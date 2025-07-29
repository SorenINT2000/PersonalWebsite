import React, { useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';
import Konva from 'konva';
import { useTheme } from '@mui/material/styles';

export interface DrawingCanvasRef {
  clear: () => void;
  getStage: () => Konva.Stage | null;
}

interface DrawingCanvasProps {
  onDraw: (stage: Konva.Stage) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({ onDraw }, ref) => {
  const isDrawing = useRef(false);

  // Off-screen Konva stage for high-resolution drawing
  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<Konva.Line | null>(null);

  // On-screen canvas for pixelated preview
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const tabRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [isTabVisible, setIsTabVisible] = useState(false);

  // Initialize the off-screen stage
  useEffect(() => {
    void tf.setBackend('cpu');
    if (!containerRef.current) return;

    stageRef.current = new Konva.Stage({
      width: 280,
      height: 280,
      container: containerRef.current,
    });
    const layer = new Konva.Layer();
    const background = new Konva.Rect({
      width: 280,
      height: 280,
      fill: 'black',
    });
    layer.add(background);
    stageRef.current.add(layer);
    updatePreview();
    const timer = setTimeout(() => {
      setIsTabVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const updatePreview = () => {
    if (!stageRef.current || !previewCanvasRef.current) return;

    const stageCanvas = stageRef.current.toCanvas();

    tf.tidy(() => {
      const tensor = tf.browser.fromPixels(stageCanvas, 1).toFloat();
      const downsampled = tf.avgPool(tensor, [10, 10], [10, 10], 'valid');
      const normalized = downsampled.div(255);

      // Render to the visible canvas, scaling up for a pixelated look
      const upscaled = tf.image.resizeNearestNeighbor(normalized as tf.Tensor3D, [280, 280]);
      void tf.browser.draw(upscaled, previewCanvasRef.current!);
    });
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (!stageRef.current) return;
      const layer = stageRef.current.getLayers()[0];
      layer.find('Line').forEach(line => line.destroy());
      layer.batchDraw();
      updatePreview();
    },
    getStage: () => {
      return stageRef.current;
    }
  }));

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (isTabVisible) {
      setIsTabVisible(false);
    }
    e.preventDefault();
    isDrawing.current = true;
    const pos = getPointerPosition(e);
    if (!pos || !stageRef.current) return;

    const layer = stageRef.current.getLayers()[0];
    currentLineRef.current = new Konva.Line({
      points: [pos.x, pos.y, pos.x, pos.y], // Use two points to ensure a dot is rendered
      stroke: "white",
      strokeWidth: 20,
      tension: 0,
      lineCap: "round",
      lineJoin: "round",
    });
    layer.add(currentLineRef.current);
    layer.batchDraw();
    requestAnimationFrame(updatePreview);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();

    const pos = getPointerPosition(e);
    if (!pos || !currentLineRef.current || !stageRef.current) return;

    const line = currentLineRef.current;
    const newPoints = line.points().concat([pos.x, pos.y]);
    line.points(newPoints);

    const layer = stageRef.current.getLayers()[0];
    layer.batchDraw();

    requestAnimationFrame(updatePreview);
    onDraw(stageRef.current);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return; // Only run if we were drawing.

    isDrawing.current = false;
    currentLineRef.current = null;
    if (!stageRef.current) return;

    onDraw(stageRef.current);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={previewCanvasRef}
        width={280}
        height={280}
        style={{
          border: '1px solid grey',
          imageRendering: 'pixelated',
          touchAction: 'none',
          verticalAlign: 'bottom',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
      <div
        ref={tabRef}
        style={{
          position: 'absolute',
          left: '0',
          top: '20px',
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.getContrastText(theme.palette.secondary.main),
          padding: '5px',
          borderTopRightRadius: '5px',
          borderBottomRightRadius: '5px',
          writingMode: 'vertical-rl',
          transform: `${isTabVisible ? 'translateX(-100%)' : 'translateX(0)'} rotate(180deg)`,
          pointerEvents: 'none',
          fontSize: '16px',
          transition: 'transform 800ms ease-out',
          zIndex: 0,
        }}
      >
        draw a digit here
      </div>
      <div ref={containerRef} style={{ display: 'none' }} />
    </div>
  );
});

export default DrawingCanvas; 
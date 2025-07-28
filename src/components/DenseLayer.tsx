import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Grid } from '@mui/material';

interface DenseLayerProps {
  activations: tf.Tensor | null;
  width: number;
  height: number;
}

const SCALE = 10;

const DenseLayer: React.FC<DenseLayerProps> = ({ activations, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (activations) {
      const canvas = canvasRef.current;
      const numNeurons = activations.shape[activations.shape.length - 1];

      const layerDims = [
        width ?? numNeurons,
        height ?? 1,
      ];

      canvas.width = layerDims[0] * SCALE;
      canvas.height = layerDims[1] * SCALE;

      tf.tidy(() => {
        const reshaped = activations.reshape([layerDims[1], layerDims[0]]);
        const min = reshaped.min();
        const max = reshaped.max();
        const range = max.sub(min);
        // Avoid division by zero in case all activations are the same
        const normalized = tf.tidy(() => tf.where(
          tf.equal(range, 0),
          tf.zerosLike(reshaped),
          reshaped.sub(min).div(range)
        ));
        const expanded = normalized.expandDims(-1);
        const resized = tf.image.resizeNearestNeighbor(
          expanded as tf.Tensor3D,
          [canvas.height, canvas.width]
        );
        void tf.browser.draw(resized, canvas);
      });
    } else {
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [activations, width, height]);

  return (
    <Grid container direction="column" alignItems="center" spacing={1} sx={{ m: 1 }}>
      <canvas
        width={width ? width * SCALE : 10}
        height={height ? height * SCALE : 10}
        ref={canvasRef}
        style={{
          border: '1px solid grey',
          imageRendering: 'pixelated',
        }}
      />
    </Grid>
  );
};

export default DenseLayer; 
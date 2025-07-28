import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Grid, Typography } from '@mui/material';

interface DenseLayerProps {
  layerName: string;
  activations: tf.Tensor | null;
  orientation?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
}

const DenseLayer: React.FC<DenseLayerProps> = ({ layerName, activations, orientation = 'horizontal', width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activations && canvasRef.current) {
      const canvas = canvasRef.current;
      const numNeurons = activations.shape[activations.shape.length - 1];
      const scale = 10;

      const isHorizontal = orientation === 'horizontal';

      const layerDims = [
        width ?? (isHorizontal ? numNeurons : 1),
        height ?? (isHorizontal ? 1 : numNeurons),
      ];

      canvas.width = layerDims[0] * scale;
      canvas.height = layerDims[1] * scale;

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
    } else if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [activations, orientation, width, height]);

  return (
    <Grid container direction="column" alignItems="center" spacing={1} sx={{ m: 2 }}>
      <Typography variant="h6">{layerName}</Typography>
      <canvas
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
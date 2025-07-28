import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Grid } from '@mui/material';

interface Conv2DLayerProps {
  featureMaps: number;
  activations: tf.Tensor | null;
  wrapLimit?: number;
}

const Conv2DLayer: React.FC<Conv2DLayerProps> = ({ featureMaps, activations, wrapLimit }) => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  useEffect(() => {
    if (activations) {
      const activationSlice = activations.slice([0, 0, 0, 0], [-1, -1, -1, featureMaps]);
      const unstacked = tf.unstack(activationSlice, 3);

      unstacked.forEach((tensor, i) => {
        const canvas = canvasRefs.current[i];
        if (!canvas) return;
        tf.tidy(() => {
          const squeezed = tensor.squeeze([0]);
          const min = squeezed.min();
          const max = squeezed.max();
          const normalized = squeezed.sub(min).div(max.sub(min));
          const resized = tf.image.resizeNearestNeighbor(normalized.expandDims(2) as tf.Tensor3D, [56, 56]);
          void tf.browser.draw(resized, canvas);
        });
      });
    } else {
      canvasRefs.current.forEach(canvas => {
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
      });
    }
  }, [activations, featureMaps]);

  const featureIndices = Array.from({ length: featureMaps }, (_, i) => i);
  const columns = wrapLimit || featureMaps;
  const groupedFeatureMaps = featureIndices.reduce<number[][]>((rows, featureIndex) => {
    const lastRow = rows[rows.length - 1];
    if (!lastRow || lastRow.length === columns) {
      rows.push([featureIndex]);
    } else {
      lastRow.push(featureIndex);
    }
    return rows;
  }, []);

  const renderFeatureMaps = () => {
    const items = Array.from({ length: featureMaps }, (_, i) => (
      <Grid key={i} sx={{ height: 58 }}>
        <canvas
          ref={el => { canvasRefs.current[i] = el; }}
          width={56}
          height={56}
          style={{ border: '1px solid grey', imageRendering: 'pixelated' }}
        />
      </Grid>
    ));

    const rows = groupedFeatureMaps.map((row, index) => (
      <Grid container spacing={1} justifyContent="center" key={index}>
        {row.map(featureIndex => (
          <Grid key={featureIndex}>
            {items[featureIndex]}
          </Grid>
        ))}
      </Grid>
    ));
    return rows;
  };


  return (
    <Grid container spacing={1} justifyContent="center" sx={{ p: 1 }}>
      {renderFeatureMaps()}
    </Grid>
  );
};

export default Conv2DLayer; 
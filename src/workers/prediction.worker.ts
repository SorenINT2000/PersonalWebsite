/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';

let model: tf.LayersModel;
let currentJobId: number | undefined;

const loadModelAndWeights = async () => {
  if (!model) {
    model = await tf.loadLayersModel('/models/model.json');
    await tf.setBackend('cpu');
  }

  self.postMessage({
    type: 'modelReady',
  });
};

const downsample = (imageData: ImageData) => {
  // Efficiently downsample by slicing every 10th pixel in both axes using tfjs
  return tf.tidy(() => {
    // [280, 280, 1]
    const tensor = tf.browser.fromPixels(imageData, 1).toFloat(); // [1, 280, 280, 1]
    const batched = tensor.expandDims(0);
    // Use stridedSlice to pick every 10th pixel in height and width
    const downsampled = batched.stridedSlice(
      [0, 0, 0, 0],
      [1, 280, 280, 1],
      [1, 10, 10, 1]
    ); // [1, 28, 28, 1]
    // Normalize to [0, 1]
    return downsampled.div(255);
  });
};

interface WorkerMessage {
  type: 'init' | 'predict';
  data?: ImageData;
  jobId?: number;
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, data, jobId } = event.data;

  switch (type) {
    case 'init': {
      await loadModelAndWeights();
      break;
    }
    case 'predict': {
      if (!data || !model) break;

      currentJobId = jobId;

      const normalized = downsample(data);
      const outputs: tf.Tensor[] = [];

      // Chain the layers, passing the output of one to the next.
      let x: tf.Tensor = normalized; // The downsample function already returns the correct 4D shape
      for (const layer of model.layers) {
        if (jobId !== currentJobId) {
          // A new job has started, so abort this one.
          outputs.forEach(t => t.dispose());
          normalized.dispose();
          x.dispose();
          return;
        }
        x = layer.apply(x) as tf.Tensor;
        outputs.push(x);
      }

      if (jobId !== currentJobId) {
        // Job was cancelled during processing
        outputs.forEach(t => t.dispose());
        normalized.dispose();
        return;
      }

      const activationPromises = outputs.map(output => output.array());
      const activations = await Promise.all(activationPromises);

      self.postMessage({ type: 'activations', data: activations, jobId });

      const finalPrediction = x.argMax(-1).dataSync()[0];
      self.postMessage({ type: 'prediction', data: finalPrediction, jobId });

      outputs.forEach(t => t.dispose());
      normalized.dispose();
      break;
    }
  }
};
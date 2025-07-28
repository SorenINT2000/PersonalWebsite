/// <reference lib="webworker" />
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';

let model: tf.LayersModel;

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
  return tf.tidy(() => {
    const tensor = tf.browser.fromPixels(imageData, 1);
    const downsampled = tf.avgPool(tensor.as4D(1, 280, 280, 1).toFloat(), [10, 10], [10, 10], 'valid');
    return downsampled.div(255);
  });
};

interface WorkerMessage {
  type: 'init' | 'predict';
  data?: ImageData;
  jobId?: string;
}

const isWorkerMessage = (data: unknown): data is WorkerMessage => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const { type } = data as { type: unknown };

  if (type === 'init') {
    return true;
  }

  if (type === 'predict') {
    return 'data' in data && 'jobId' in data;
  }

  return false;
}

self.onmessage = async (event: MessageEvent) => {
  if (!isWorkerMessage(event.data)) {
    return;
  }
  const { type, data, jobId } = event.data;

  switch (type) {
    case 'init': {
      await loadModelAndWeights();
      break;
    }
    case 'predict': {
      if (data && model) {
        const normalized = downsample(data);
        const outputs: tf.Tensor[] = [];
        
        // Chain the layers, passing the output of one to the next.
        let x: tf.Tensor = normalized.reshape([1, 784]); // Initial input for the first layer.
        for (const layer of model.layers) {
          x = layer.apply(x) as tf.Tensor;
          outputs.push(x);
        }
        
        const activationPromises = outputs.map(output => output.array());
        const activations = await Promise.all(activationPromises);
        
        self.postMessage({ type: 'activations', data: activations, jobId });

        const finalPrediction = x.argMax(-1).dataSync()[0];
        self.postMessage({ type: 'prediction', data: finalPrediction, jobId });

        outputs.forEach(t => t.dispose());
        normalized.dispose();
      }
      break;
    }
  }
}; 
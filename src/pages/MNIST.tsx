import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import DrawingCanvas, { type DrawingCanvasRef } from '../components/DrawingCanvas';
import {
    Button,
    Typography,
    Backdrop,
    CircularProgress,
    Divider,
    useMediaQuery,
    Box,
} from "@mui/material";
import Conv2DLayer from "../components/Conv2DLayer";
import DenseLayer from "../components/DenseLayer";
import Konva from "konva";

type WorkerMessage =
    | { type: "modelReady" }
    | {
        type: 'activations';
        data: tf.TensorLike[];
        jobId: number;
    } | {
        type: 'prediction';
        data: number;
        jobId: number;
    };

const MNIST: React.FC = () => {
    const [prediction, setPrediction] = useState<number | null>(null);
    const [conv1Activations, setConv1Activations] = useState<tf.Tensor | null>(null);
    const [conv2Activations, setConv2Activations] = useState<tf.Tensor | null>(null);
    const [conv3Activations, setConv3Activations] = useState<tf.Tensor | null>(null);
    const [dense1Activations, setDense1Activations] = useState<tf.Tensor | null>(null);
    const [outputActivations, setOutputActivations] = useState<tf.Tensor | null>(null);

    const [isModelLoading, setIsModelLoading] = useState(true);
    const canvasRef = useRef<DrawingCanvasRef | null>(null);
    const workerRef = useRef<Worker | null>(null);
    const jobIdRef = useRef(0);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../workers/prediction.worker.ts', import.meta.url), { type: 'module' });
        workerRef.current.postMessage({ type: 'init' });

        workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
            const { type } = event.data;

            if (type !== 'modelReady' && event.data.jobId !== jobIdRef.current) {
                return; // Ignore messages from old jobs
            }
            switch (type) {
                case 'modelReady':
                    setIsModelLoading(false);
                    break;
                case 'activations': {
                    const { data } = event.data;
                    if (data && Array.isArray(data)) {
                        // Correct indices based on the actual model.json architecture
                        setConv1Activations(tf.tensor(data[3]));   // 'activation_48'
                        setConv2Activations(tf.tensor(data[6]));   // 'activation_49'
                        setConv3Activations(tf.tensor(data[9]));   // 'activation_50'
                        setDense1Activations(tf.tensor(data[13]));  // 'activation_51'
                        setOutputActivations(tf.tensor(data[15]));  // 'dense_25' (final output)
                    }
                    break;
                }
                case 'prediction':
                    setPrediction(event.data.data);
                    break;
            }
        }

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const handleClear = () => {
        jobIdRef.current++; // Invalidate current job
        canvasRef.current?.clear();
        setConv1Activations(null);
        setConv2Activations(null);
        setConv3Activations(null);
        setDense1Activations(null);
        setOutputActivations(null);
        setPrediction(null);
    };

    const handleDraw = (stage: Konva.Stage) => {
        if (isModelLoading) return;

        const canvas = stage.toCanvas();
        const context = canvas.getContext('2d');
        if (!context) return;

        const imageData = context.getImageData(0, 0, 280, 280);

        workerRef.current?.postMessage({ type: 'predict', data: imageData, jobId: jobIdRef.current });
    };

    return (
        <>
            {isModelLoading && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={isModelLoading}
                >
                    <CircularProgress color="inherit" />
                    <Typography sx={{ ml: 2 }}>Loading Model...</Typography>
                </Backdrop>
            )}
            <Box sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                m: 1,
            }}>
                <DrawingCanvas ref={canvasRef} onDraw={handleDraw} />
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button variant="contained" onClick={handleClear} disabled={isModelLoading}>Clear</Button>
                    {prediction !== null && (
                        <Typography variant="h5" sx={{ zIndex: 2, opacity: 1 }} >Prediction: {prediction}</Typography>
                    )}
                </Box>
            </Box >
            <Box sx={{
                width: '100%',
                maxHeight: 'calc(100vh - 500px)', // Adjust this value as needed
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                zIndex: 2,
                opacity: 1,
            }}>
                <Conv2DLayer featureMaps={12} activations={conv1Activations} wrapLimit={6} />
                <Divider style={{ width: '30%' }} />
                <Conv2DLayer featureMaps={24} activations={conv2Activations} wrapLimit={6} />
                <Divider style={{ width: '30%' }} />
                <Conv2DLayer
                    featureMaps={32}
                    activations={conv3Activations}
                    wrapLimit={useMediaQuery('(max-width:600px)') ? 6 : 8}
                />
                <Divider style={{ width: '30%' }} />
                <DenseLayer activations={dense1Activations} width={20} height={10} />
                <Divider style={{ width: '30%' }} />
                <DenseLayer activations={outputActivations} width={10} height={1} />
            </Box>
        </>
    );
};

export default MNIST;
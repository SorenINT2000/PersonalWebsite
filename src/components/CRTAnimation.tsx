import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Pixelation, Scanline, Bloom, ChromaticAberration, Vignette, ShockWave } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useTheme } from '@mui/material/styles';

// ─── Mouse-tracking light ──────────────────────────────────────────────────────

/**
 * A directional light whose position follows the mouse cursor.
 * Mouse coordinates are normalized to [-1, 1] (viewport center = 0,0)
 * then scaled into 3D world positions so the light orbits the scene.
 */
function MouseLight({ intensity = 0.9 }: { intensity?: number }) {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    // Smoothed position for lerping
    const smoothRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            // Normalize to [-1, 1] relative to viewport center
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1); // flip Y
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame(() => {
        if (!lightRef.current) return;

        // Smooth lerp toward target so the light doesn't jitter
        const lerpFactor = 0.05;
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * lerpFactor;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * lerpFactor;

        // Map normalized coords to a light position that orbits the scene
        const range = 500;
        lightRef.current.position.set(
            smoothRef.current.x * range,
            smoothRef.current.y * range,
            400
        );
    });

    return <directionalLight ref={lightRef} position={[400, 400, 400]} intensity={intensity} />;
}

// ─── Torus knot scene ──────────────────────────────────────────────────────────

function TorusKnotScene() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        meshRef.current.rotation.x = -0.25 * Math.PI;
        meshRef.current.rotation.y = 0
        meshRef.current.rotation.z = t * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[140, 20, 200, 20, 3, 5]}/>
            <meshLambertMaterial
                color={0xffffff}
                // flatShading
            />
        </mesh>
    );
}

// ─── Main Exported Component ───────────────────────────────────────────────────


export default function CRTAnimation() {
    const theme = useTheme();
    return (
        <Canvas
            camera={{ position: [0, 0, 350], fov: 90 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'transparent',
                
                opacity: theme.palette.mode === 'dark' ? 0.6 : 0.3,
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.1} />
            <MouseLight intensity={0.4} />

            <TorusKnotScene />
            <EffectComposer>
                <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.001, 0.01, 0.002]} />
                {/* <Noise blendFunction={BlendFunction.MULTIPLY} opacity={2} /> */}
                <Bloom luminanceThreshold={0.01} blendFunction={BlendFunction.LIGHTEN} radius={0.5} intensity={0.8} />
                <Vignette offset={0.1} darkness={1.1} />
                <Pixelation granularity={1} />
                <Scanline density={1} blendFunction={BlendFunction.MULTIPLY} opacity={0.5} scrollSpeed={0.005} />
                <ShockWave />

            </EffectComposer>
        </Canvas>
    );
}

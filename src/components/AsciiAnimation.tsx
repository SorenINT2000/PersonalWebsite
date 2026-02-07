import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
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
        const lerpFactor = 0.08;
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
            <torusKnotGeometry args={[140, 20, 100, 20, 3, 5]} />
            <meshLambertMaterial
                color={0xffffff}
            // flatShading
            />
        </mesh>
    );
}

// ─── ASCII Renderer ────────────────────────────────────────────────────────────

interface AsciiRendererProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    fgColor: string;
    bgColor: string;
    resolution: number;
}

function AsciiRenderer({ containerRef, fgColor, bgColor, resolution }: AsciiRendererProps) {
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef<InstanceType<typeof AsciiEffect> | null>(null);

    useEffect(() => {
        gl.domElement.style.display = 'none';

        const effect = new AsciiEffect(gl, '.:-*+=%@# ',
            {
                invert: true,
                resolution: resolution,
            });

        effect.setSize(size.width, size.height);
        effect.domElement.style.color = fgColor;
        effect.domElement.style.backgroundColor = bgColor;
        effect.domElement.style.position = 'absolute';
        effect.domElement.style.top = '0';
        effect.domElement.style.left = '0';
        effect.domElement.style.width = '100%';
        effect.domElement.style.height = '100%';
        effect.domElement.style.pointerEvents = 'none';

        effectRef.current = effect;

        if (containerRef.current) {
            containerRef.current.appendChild(effect.domElement);
        }

        return () => {
            if (effect.domElement.parentNode) {
                effect.domElement.parentNode.removeChild(effect.domElement);
            }
        };
    }, [gl, size, containerRef, fgColor, bgColor, resolution]);

    useEffect(() => {
        if (effectRef.current) {
            effectRef.current.domElement.style.color = fgColor;
            effectRef.current.domElement.style.backgroundColor = bgColor;
        }
    }, [fgColor, bgColor]);

    useFrame(() => {
        if (effectRef.current) {
            effectRef.current.render(scene, camera);
        }
    }, 1);

    return null;
}

// ─── Main Exported Component ───────────────────────────────────────────────────

interface AsciiAnimationProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    resolution?: number;
}

export default function AsciiAnimation({
    containerRef,
    resolution = 0.15,
}: AsciiAnimationProps) {
    const theme = useTheme();

    const isDark = theme.palette.mode === 'dark';
    const fgColor = isDark ? 'rgba(144, 202, 249, 1)' : 'rgba(25, 118, 210, 1)';
    const bgColor = isDark ? '#121212' : '#f5f5f5';

    return (
        <Canvas
            key={`${resolution}`}
            camera={{ position: [0, 0, 600], fov: 50 }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'transparent',
            }}
            gl={{ antialias: true, alpha: true }}
        >
            <ambientLight intensity={0.02} />
            <MouseLight intensity={0.9} />

            <TorusKnotScene />
            <AsciiRenderer
                containerRef={containerRef}
                fgColor={fgColor}
                bgColor={bgColor}
                resolution={resolution}
            />
        </Canvas>
    );
}

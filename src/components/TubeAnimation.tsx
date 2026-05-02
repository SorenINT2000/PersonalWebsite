import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useMemo } from 'react';

// ─── Mouse-tracking light ──────────────────────────────────────────────────────

function MouseLight({ intensity = 0.9 }: { intensity?: number }) {
    const lightRef = useRef<THREE.DirectionalLight>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const smoothRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame(() => {
        if (!lightRef.current) return;

        const lerpFactor = 0.05;
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * lerpFactor;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * lerpFactor;

        const range = 500;
        lightRef.current.position.set(
            smoothRef.current.x * range,
            smoothRef.current.y * range,
            400
        );
    });

    return <directionalLight ref={lightRef} position={[400, 400, 400]} intensity={intensity} />;
}

// ─── Torus knot edges scene ─────────────────────────────────────────────────────

function TorusKnotEdges() {
    const groupRef = useRef<THREE.Group>(null);

    const edgesGeometry = useMemo(() => {
        const base = new THREE.TorusKnotGeometry(140, 20, 200, 20, 3, 5);
        const edges = new THREE.EdgesGeometry(base, 15);
        base.dispose();
        return edges;
    }, []);

    useFrame(({ clock }) => {
        if (!groupRef.current) return;
        const t = clock.getElapsedTime();
        groupRef.current.rotation.x = -0.25 * Math.PI;
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.z = t * 0.1;
    });

    return (
        <group ref={groupRef}>
            <lineSegments geometry={edgesGeometry}>
                <lineBasicMaterial color={0xffffff} />
            </lineSegments>
        </group>
    );
}

// ─── Main Exported Component ───────────────────────────────────────────────────

const TubeAnimation = () => {
    return (
        <Canvas camera={{ position: [0, 0, 350], fov: 90 }} gl={{ antialias: true, alpha: true }}>
            <MouseLight />
            <TorusKnotEdges />
        </Canvas>
    );
};

export default TubeAnimation;

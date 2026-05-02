import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';

// ─── Edge detection shaders ─────────────────────────────────────────────────────

const EDGE_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const EDGE_FRAGMENT = /* glsl */ `
uniform sampler2D tNormal;
uniform sampler2D tDepth;
uniform vec2 resolution;
uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;

float linearizeDepth(float d) {
    return cameraNear * cameraFar / (cameraFar + d * (cameraNear - cameraFar));
}

void main() {
    vec2 texel = 1.0 / resolution;

    // Depth edge detection (cross pattern)
    float dc = linearizeDepth(texture2D(tDepth, vUv).x);
    float dn = linearizeDepth(texture2D(tDepth, vUv + vec2(0.0, texel.y)).x);
    float ds = linearizeDepth(texture2D(tDepth, vUv - vec2(0.0, texel.y)).x);
    float de = linearizeDepth(texture2D(tDepth, vUv + vec2(texel.x, 0.0)).x);
    float dw = linearizeDepth(texture2D(tDepth, vUv - vec2(texel.x, 0.0)).x);

    float depthDiff = abs(dn - dc) + abs(ds - dc) + abs(de - dc) + abs(dw - dc);
    float depthEdge = depthDiff / max(dc, 0.001);

    // Normal edge detection (cross pattern)
    vec3 nc = texture2D(tNormal, vUv).rgb;
    vec3 nn = texture2D(tNormal, vUv + vec2(0.0, texel.y)).rgb;
    vec3 ns = texture2D(tNormal, vUv - vec2(0.0, texel.y)).rgb;
    vec3 ne = texture2D(tNormal, vUv + vec2(texel.x, 0.0)).rgb;
    vec3 nw = texture2D(tNormal, vUv - vec2(texel.x, 0.0)).rgb;

    float normalEdge = length(nn - nc) + length(ns - nc) + length(ne - nc) + length(nw - nc);

    float edge = max(step(0.05, depthEdge), step(1.0, normalEdge));

    gl_FragColor = vec4(edge, edge, edge, edge);
}
`;

// ─── Mouse-tracking light ───────────────────────────────────────────────────────

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
        const k = 0.05;
        smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * k;
        smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * k;
        const r = 500;
        lightRef.current.position.set(smoothRef.current.x * r, smoothRef.current.y * r, 400);
    });

    return <directionalLight ref={lightRef} position={[400, 400, 400]} intensity={intensity} />;
}

// ─── Torus knot scene ───────────────────────────────────────────────────────────

function TorusKnotScene() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        const t = clock.getElapsedTime();
        meshRef.current.rotation.x = -0.25 * Math.PI;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.z = t * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[140, 20, 200, 20, 3, 5]} />
            <meshBasicMaterial />
        </mesh>
    );
}

// ─── Custom depth + normal edge detection renderer ──────────────────────────────

function EdgeDetectionRenderer() {
    const { scene, camera, gl, size } = useThree();

    const normalOverride = useMemo(() => new THREE.MeshNormalMaterial(), []);

    const normalTarget = useMemo(() => {
        const dpr = gl.getPixelRatio();
        const w = Math.floor(size.width * dpr);
        const h = Math.floor(size.height * dpr);
        const rt = new THREE.WebGLRenderTarget(w, h);
        rt.depthTexture = new THREE.DepthTexture(w, h);
        return rt;
    }, [gl, size.width, size.height]);

    useEffect(() => () => {
        normalTarget.dispose();
        normalTarget.depthTexture?.dispose();
    }, [normalTarget]);

    const { quadScene, quadCamera, edgeMaterial } = useMemo(() => {
        const em = new THREE.ShaderMaterial({
            uniforms: {
                tNormal: { value: null },
                tDepth: { value: null },
                resolution: { value: new THREE.Vector2(1, 1) },
                cameraNear: { value: 0.1 },
                cameraFar: { value: 1000 },
            },
            vertexShader: EDGE_VERTEX,
            fragmentShader: EDGE_FRAGMENT,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
        const qs = new THREE.Scene();
        qs.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), em));
        const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        return { quadScene: qs, quadCamera: qc, edgeMaterial: em };
    }, []);

    useFrame(() => {
        const cam = camera as THREE.PerspectiveCamera;
        const dpr = gl.getPixelRatio();

        gl.setClearColor(0x000000, 0);

        // Pass 1 — render normals + depth to offscreen target
        scene.overrideMaterial = normalOverride;
        gl.setRenderTarget(normalTarget);
        gl.clear();
        gl.render(scene, camera);
        scene.overrideMaterial = null;

        // Pass 2 — fullscreen edge-detection quad to screen
        edgeMaterial.uniforms.tNormal.value = normalTarget.texture;
        edgeMaterial.uniforms.tDepth.value = normalTarget.depthTexture;
        edgeMaterial.uniforms.resolution.value.set(
            Math.floor(size.width * dpr),
            Math.floor(size.height * dpr),
        );
        edgeMaterial.uniforms.cameraNear.value = cam.near;
        edgeMaterial.uniforms.cameraFar.value = cam.far;

        gl.setRenderTarget(null);
        gl.clear();
        gl.render(quadScene, quadCamera);
    }, 1);

    return null;
}

// ─── Main exported component ────────────────────────────────────────────────────

const OutlineAnimation = () => (
    <Canvas
        camera={{ position: [0, 0, 350], fov: 90 }}
        gl={{ antialias: true, alpha: true }}
    >
        <MouseLight />
        <TorusKnotScene />
        <EdgeDetectionRenderer />
    </Canvas>
);

export default OutlineAnimation;

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState, useCallback } from 'react';


// ─── Torus knot scene ──────────────────────────────────────────────────────────

function TorusKnotScene({ onMeshReady }: { onMeshReady: (mesh: THREE.Mesh | null) => void }) {
    const localRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!localRef.current) return;
        const t = clock.getElapsedTime();
        localRef.current.rotation.x = -0.25 * Math.PI;
        localRef.current.rotation.y = 0;
        localRef.current.rotation.z = t * 0.1;
    });

    const combinedRef = useCallback((node: THREE.Mesh | null) => {
        localRef.current = node;
        onMeshReady(node);
    }, [onMeshReady]);

    return (
        <mesh ref={combinedRef}>
            <torusKnotGeometry args={[140, 20, 200, 20, 3, 5]} />
            <meshLambertMaterial
                transparent
                opacity={0}
            />
        </mesh>
    );
}

// ─── Main Exported Component ───────────────────────────────────────────────────

const PostProcessingOutline = ({ selectedObjects }: {selectedObjects: THREE.Object3D[]}) => {
    const { scene, camera, gl: renderer } = useThree();
    const composer = useRef<EffectComposer>(null);
  
    useEffect(() => {
        // 1. Create the EffectComposer
        if (composer.current) return;

        composer.current = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.current.addPass(renderPass);
    
        // 2. Create and configure the OutlinePass
        const outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            scene,
            camera
        );
        outlinePass.visibleEdgeColor.set(0xffffff); // Red visible edge
        outlinePass.hiddenEdgeColor.set(0xffffff); // Red hidden edge
        outlinePass.edgeStrength = 2.0;
        // ... configure other properties like edgeStrength, edgeGlow etc.
        composer.current.addPass(outlinePass);
    
        // 3. Add a final pass (optional, e.g., an output pass for color management)
        const outputPass = new OutputPass();
        composer.current.addPass(outputPass);
    
        return () => {
            // Cleanup
            composer.current = null;
        };
    }, [renderer, scene, camera]);
  
    useEffect(() => {
        // Update the selected objects for the OutlinePass when the selection changes
        if (composer.current) {
            const outlinePass = composer.current.passes.find(pass => pass instanceof OutlinePass);
            if (outlinePass) {
                // 'selectedObjects' should be an array of THREE.Object3D instances
                outlinePass.selectedObjects = selectedObjects;
            }
        }
    }, [selectedObjects]);
  
    useFrame(() => {
        // Manually render the composer in the animation loop
        if (composer.current) {
            renderer.setRenderTarget(composer.current.readBuffer); // Important solution for some setups
            composer.current.render();
        }
    }, 1); // priority 1 ensures it runs after standard R3F updates
  
    return null;
  };
  
// Main App component
const OutlineAnimation = () => {
    const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D[]>([]);

    const setMeshRef = useCallback((node: THREE.Mesh | null) => {
        if (node !== null) {
            setSelectedMesh([node as THREE.Object3D]);
        }
    }, []);

    

    return (
        <Canvas camera={{ position: [0, 0, 350], fov: 90 }} gl={{ antialias: true, alpha: true }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            <TorusKnotScene onMeshReady={setMeshRef} />
            {/* Pass the currently selected objects to the post-processing component */}
            <PostProcessingOutline selectedObjects={selectedMesh} />
        </Canvas>
    );
};

export default OutlineAnimation;
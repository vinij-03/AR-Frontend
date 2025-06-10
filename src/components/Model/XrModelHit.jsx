import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model";
import { useGesture } from "@use-gesture/react";

const XrModelHit = ({ modelUrl }) => {
    const reticleRef = useRef();
    const modelRef = useRef();
    const [modelData, setModelData] = useState(null);
    const { isPresenting } = useXR();
    const [scale, setScale] = useState(1);
    const [rotationY, setRotationY] = useState(0);

    // Non-AR camera position
    useThree(({ camera }) => {
        if (!isPresenting) {
            camera.position.set(0, 1.5, 3);
        }
    });

    // Hit test tracking
    useHitTest((hitMatrix) => {
        if (reticleRef.current) {
            hitMatrix.decompose(
                reticleRef.current.position,
                reticleRef.current.quaternion,
                reticleRef.current.scale
            );
            reticleRef.current.visible = true;
        }
    });

    // Model placement (only one at a time)
    const placeModel = () => {
        if (!modelUrl || !reticleRef.current.visible) return;

        const pos = reticleRef.current.position.clone();
        const quat = reticleRef.current.quaternion.clone();
        setModelData({ position: pos, quaternion: quat, id: Date.now() });
    };

    // Gesture handling for AR (rotation & zoom)
    useGesture(
        {
            onDrag: ({ delta: [dx] }) => {
                if (isPresenting && modelRef.current) {
                    setRotationY((prev) => prev + dx * 0.01); // rotate horizontally
                }
            },
            onPinch: ({ delta: [d], offset: [s] }) => {
                if (isPresenting && modelRef.current) {
                    setScale(Math.min(2, Math.max(0.2, s)));
                }
            },
        },
        {
            target: modelRef,
            eventOptions: { passive: false },
            pinch: { scaleBounds: { min: 0.2, max: 2 } },
        }
    );

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 4, 1]} intensity={0.8} castShadow />

            {/* OrbitControls for non-AR preview */}
            <OrbitControls
                enableRotate={!isPresenting}
                enableZoom={!isPresenting}
                maxPolarAngle={Math.PI / 2}
            />

            {/* One Model Placement */}
            {modelData && isPresenting && (
                <group
                    ref={modelRef}
                    position={modelData.position}
                    quaternion={modelData.quaternion}
                    rotation={[0, rotationY, 0]}
                    scale={[scale, scale, scale]}
                >
                    <Model modelUrl={modelUrl} />
                </group>
            )}

            {/* Reticle */}
            {isPresenting && (
                <Interactive onSelect={placeModel}>
                    <mesh ref={reticleRef} visible={false}>
                        <ringGeometry args={[0.02, 0.045, 32]} />
                        <meshStandardMaterial color="white" opacity={0.85} transparent />
                    </mesh>
                </Interactive>
            )}

            {/* Static preview in non-AR mode */}
            {!isPresenting && modelUrl && (
                <Model position={[0, -0.5, 0]} modelUrl={modelUrl} />
            )}
        </>
    );
};

export default XrModelHit;

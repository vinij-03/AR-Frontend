import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Interactive, useHitTest, useXR } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model";

const XrModelHit = ({ modelUrl }) => {
    const reticleRef = useRef();
    const [models, setModels] = useState([]);
    const { isPresenting } = useXR();

    // Adjust camera position in non-AR mode
    useThree(({ camera }) => {
        if (!isPresenting) {
            camera.position.z = 3;
        }
    });

    // Plane detection and reticle pose update
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

    // On user tap, place model at reticle position
    const placeModel = () => {
        if (!modelUrl || !reticleRef.current.visible) return;

        const pos = reticleRef.current.position.clone();
        const quat = reticleRef.current.quaternion.clone();
        const id = Date.now();

        setModels(prev => [...prev, { position: pos, quaternion: quat, id }]);
    };

    return (
        <>
            <OrbitControls
                enableRotate={!isPresenting}
                enableZoom={false}
                maxPolarAngle={Math.PI / 2}
            />
            <ambientLight intensity={0.5} />

            {/* Placed Models */}
            {models.map(({ position, quaternion, id }) => (
                <Model
                    key={id}
                    position={position}
                    quaternion={quaternion}
                    modelUrl={modelUrl}
                />
            ))}

            {/* Reticle for placement preview */}
            {isPresenting && (
                <Interactive onSelect={placeModel}>
                    <mesh ref={reticleRef} visible={false}>
                        <ringGeometry args={[0.03, 0.06, 32]} />
                        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
                    </mesh>
                </Interactive>
            )}

            {/* Non-AR Fallback */}
            {!isPresenting && modelUrl && (
                <Model position={[0, -0.5, 0]} modelUrl={modelUrl} />
            )}
        </>
    );
};

export default XrModelHit;

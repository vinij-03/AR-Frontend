import { OrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { Interactive, useHitTest, useXR, useController } from "@react-three/xr";
import { useRef, useState } from "react";
import * as THREE from "three";
import Model from "./Model/Model";

const XrModelHit = ({ modelUrl }) => {
    const reticleRef = useRef();
    const modelRef = useRef();
    const [modelData, setModelData] = useState(null);
    const { isPresenting } = useXR();
    const [scale, setScale] = useState(1);
    const [rotationY, setRotationY] = useState(0);
    const lastTouches = useRef({ dist: null, rotation: null });

    // Set camera for non-AR
    useThree(({ camera }) => {
        if (!isPresenting) {
            camera.position.set(0, 1.5, 3);
        }
    });

    // Hit test for reticle
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

    // Place model
    const placeModel = () => {
        if (!modelUrl || !reticleRef.current.visible) return;

        const pos = reticleRef.current.position.clone();
        const quat = reticleRef.current.quaternion.clone();
        setModelData({ position: pos, quaternion: quat, id: Date.now() });

        // Reset scale/rotation
        setScale(1);
        setRotationY(0);
        lastTouches.current = { dist: null, rotation: null };
    };

    // Manual gesture detection in AR
    useFrame(({ gl }) => {
        if (!isPresenting || !modelRef.current) return;

        const touches = gl.domElement.ownerDocument?.activeElement?.ownerDocument?.defaultView?.navigator?.xr?.inputSources
            ?.filter((s) => s.targetRayMode === "tracked-pointer" && s.handedness === "none");

        const session = gl.xr?.getSession?.();
        if (!session || !session.inputSources || session.inputSources.length < 2) return;

        const [touch1, touch2] = session.inputSources;
        if (!touch1 || !touch2) return;

        const pos1 = new THREE.Vector2().fromArray(touch1.gamepad?.axes || []);
        const pos2 = new THREE.Vector2().fromArray(touch2.gamepad?.axes || []);

        const currentDist = pos1.distanceTo(pos2);
        const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);

        if (lastTouches.current.dist != null) {
            const deltaScale = currentDist / lastTouches.current.dist;
            setScale((prev) => Math.min(2, Math.max(0.2, prev * deltaScale)));

            const deltaAngle = angle - lastTouches.current.rotation;
            setRotationY((prev) => prev + deltaAngle);
        }

        lastTouches.current = { dist: currentDist, rotation: angle };
    });

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 4, 1]} intensity={0.8} castShadow />

            <OrbitControls
                enableRotate={!isPresenting}
                enableZoom={!isPresenting}
                maxPolarAngle={Math.PI / 2}
            />

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

            {isPresenting && (
                <Interactive onSelect={placeModel}>
                    <mesh ref={reticleRef} visible={false}>
                        <ringGeometry args={[0.02, 0.045, 32]} />
                        <meshStandardMaterial color="white" opacity={0.85} transparent />
                    </mesh>
                </Interactive>
            )}

            {!isPresenting && modelUrl && (
                <Model position={[0, -0.5, 0]} modelUrl={modelUrl} />
            )}
        </>
    );
};

export default XrModelHit;

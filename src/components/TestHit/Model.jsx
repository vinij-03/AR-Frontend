

import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = ({ position }) => {
  const gltf = useLoader(GLTFLoader, "/house.glb");
  return (
    <>
      <OrbitControls
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2} />
      <Suspense fallback={null}>
        <primitive position={position} object={gltf.scene} scale={[5, 5, 5]} />
      </Suspense>
    </>
  );
};

export default Model;
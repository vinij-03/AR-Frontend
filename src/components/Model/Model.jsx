import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const Model = ({ position, modelUrl }) => {
  // Load the model using the passed modelUrl prop
  const gltf = useLoader(GLTFLoader, modelUrl);
  const [scene, setScene] = useState(null);

  useEffect(() => {
    if (gltf && gltf.scene) {
      // Clone the scene to ensure we're not modifying the cached version
      const clonedScene = gltf.scene.clone();

      const maxDimension = 2;
      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log("Model Dimensions:", size);

      const targetMaxDimension = Math.max(size.x, size.y, size.z);
      const scale = maxDimension / targetMaxDimension;
      // Apply the scale to the cloned model
      clonedScene.scale.set(scale, scale, scale);

      // Save the cloned and scaled scene to state
      setScene(clonedScene);
    }
  }, [gltf]);

  // If scene is not ready, you can show a fallback or null
  if (!scene) return null;

  return (
    <Suspense fallback={null}>
      <primitive position={position} object={scene} />
    </Suspense>
  );
};

export default Model;


// import { useLoader } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { Suspense, useEffect } from "react";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import * as THREE from "three";

// const Model = ({ position, modelUrl }) => {
//   // Load the model dynamically using the passed modelUrl prop
//   const gltf = useLoader(GLTFLoader, modelUrl);

//   const maxDimension = 2;
//   useEffect(() => {
//     if (gltf && gltf.scene) {
//       const box = new THREE.Box3().setFromObject(gltf.scene);
//       const size = new THREE.Vector3();
//       box.getSize(size);
//       console.log("Model Dimensions:", size);

//       const targetMaxDimension = Math.max(size.x, size.y, size.z);
//       const scale = maxDimension / targetMaxDimension;
//       // Apply the scale to the model
//       gltf.scene.scale.set(scale, scale, scale);
//     }
//   }, [gltf]);

//   return (
//     <Suspense fallback={null}>
//       <primitive position={position} object={gltf.scene} />
//     </Suspense>
//   );
// };

// export default Model;

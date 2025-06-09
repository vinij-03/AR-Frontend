import { Canvas } from "@react-three/fiber";
import { XR, ARButton } from "@react-three/xr";
import { Suspense, useRef, useEffect, useState } from "react";
import XrModelHit from "./XrModelHit";

const HitTest = ({ modelUrl }) => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (navigator.xr) {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
                setReady(supported);
            });
        }
    }, []);

    return (
        <div className="relative w-screen h-[66.6667vh]">
            <Canvas
                style={{ backgroundColor: "#F3F4F6", width: "100%", height: "100%" }}
                gl={{ preserveDrawingBuffer: true }}
            >
                <XR>
                    <Suspense fallback={null}>
                        <XrModelHit modelUrl={modelUrl} />
                    </Suspense>
                </XR>
            </Canvas>

            {ready ? (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ARButton
                        sessionInit={{
                            requiredFeatures: ["hit-test"],
                        }}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            backgroundColor: "#3B82F6",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    />
                </div>
            ) : (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-red-600 px-4 py-2 rounded z-10">
                    AR not supported
                </div>
            )}
        </div>
    );
};

export default HitTest;

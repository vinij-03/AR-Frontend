import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { Suspense, useRef, useEffect, useState } from "react";
import XrModelHit from "./XrModelHit";

const HitTest = ({ modelUrl }) => {
    const containerRef = useRef(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof navigator.xr === "undefined") {
            console.error("WebXR not supported");
        } else {
            navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
                setReady(supported);
                if (!supported) {
                    console.error("immersive-ar not supported");
                }
            });
        }
    }, []);

    return (
        <div ref={containerRef} className="w-screen h-screen flex flex-col">
            <div className="w-full flex-grow">
                <Canvas style={{ backgroundColor: "#31363F", width: "100%", height: "100%" }} gl={{ preserveDrawingBuffer: true }}>
                    <XR>
                        <Suspense fallback={null}>
                            <XrModelHit modelUrl={modelUrl} />
                        </Suspense>
                    </XR>
                </Canvas>
            </div>

            <div className="p-4 flex justify-center bg-slate-700">
                {ready ? (
                    <ARButton
                        sessionInit={{
                            requiredFeatures: ["hit-test", "dom-overlay"],
                            domOverlay: { root: containerRef.current },
                        }}
                        style={{
                            padding: "10px 20px",
                            fontSize: "1rem",
                            borderRadius: "8px",
                            backgroundColor: "#4F46E5",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                        }}
                    />
                ) : (
                    <div className="text-white">AR not supported</div>
                )}
            </div>
        </div>
        
    );
};

export default HitTest;

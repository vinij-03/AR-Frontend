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
        <div ref={containerRef} className="w-screen h-[70%] md:h-[100vh]  flex flex-col">
            <div className="w-full h-[70%] lg:h-full ">
                <Canvas style={{ backgroundColor: "#F3F4F6", width: "100%", height: "100%" }} gl={{ preserveDrawingBuffer: true }}>
                        <XR>
                            <Suspense fallback={null}>
                                <XrModelHit modelUrl={modelUrl} />
                            </Suspense>
                        </XR>
                    </Canvas>
                </div>

            <div className="p-4 flex justify-center bg-slate-100 border-t border-gray-200">
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
                                backgroundColor: "#3B82F6",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        />
                    ) : (
                        <div className="text-black">AR not supported</div>
                    )}
                </div>
            </div>
        
    );
};

export default HitTest;

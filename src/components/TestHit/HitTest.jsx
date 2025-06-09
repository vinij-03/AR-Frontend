
import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import XrModelHit from "./XrModelHit";

const HitTest = () => {
    return (
        <>
            <ARButton
                sessionInit={{
                    requiredFeatures: ["hit-test"],
                }}
            />
            <div className="w-screen h-[66.6667vh]">
                <Canvas>
                    <XR>
                        <XrModelHit />
                    </XR>
                </Canvas>
            </div>
        </>
    );
};

export default HitTest;
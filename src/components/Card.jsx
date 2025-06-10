import React, { useEffect, useState } from "react";
import axios from "axios";
import { Canvas } from "@react-three/fiber";
import Model from "./Model/Model";

const backendBaseUrl = 'https://resonant-lillian-vineetjana-d2332314.koyeb.app';

const Thumbnail = ({ modelUrl }) => (
    <Canvas
        style={{
            width: "100px",
            height: "100px",
            background: "#222",
            borderRadius: "8px",
        }}
        orthographic
        camera={{ zoom: 50, position: [0, 0, 100] }}
    >
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} position={[0, 0, 5]} />
        <Model position={[0, -0.5, 0]} modelUrl={modelUrl} />
    </Canvas>
);

function Card({ onModelSelect }) {
    const [models, setModels] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        axios
            .get("/models")
            .then((res) => setModels(res.data))
            .catch(() => setModels([]));
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const res = await axios.get("/models");
            setModels(res.data);
            setFile(null);
        } catch (err) {
            alert("Upload failed");
        }
        setUploading(false);
    };

    const publicModels = [
        { name: "house.glb", filePath: "/house.glb" },
        { name: "forest_house.glb", filePath: "/forest_house.glb" },
    ];

    const allModels = [
        ...publicModels,
        ...models
            .filter((m) => !publicModels.some((pm) => pm.filePath === m.filePath))
            .map((m) => ({
                ...m,
                filePath: m.filePath.startsWith("/uploads")
                    ? backendBaseUrl + m.filePath
                    : m.filePath,
            })),
    ];

    return (
        <div className="w-full overflow-x-auto">
            <div className="flex flex-row gap-4 p-4 bg-slate-800 rounded-xl shadow-lg overflow-x-auto">
                {/* Upload Card */}
                <div className="border-2 border-dashed border-blue-400 rounded-lg p-4 w-[140px] bg-slate-700 hover:bg-slate-600 transition flex flex-col items-center justify-between text-white">
                    <form onSubmit={handleUpload} className="flex flex-col gap-2 items-center w-full">
                        <label className="text-xs text-center">Upload Model</label>
                        <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="text-xs text-white w-full"
                        />
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs w-full"
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </form>
                </div>

                {/* Model Thumbnails */}
                {allModels.map((model) => (
                    <div
                        key={model.filePath}
                        onClick={() => onModelSelect(model.filePath)}
                        className="border border-gray-300 rounded-lg p-2 cursor-pointer text-center w-[120px] bg-slate-700 hover:bg-slate-600 transition"
                    >
                        <div className="w-[100px] h-[100px] mx-auto mb-2">
                            <Thumbnail modelUrl={model.filePath} />
                        </div>
                        <div className="truncate text-white text-xs">{model.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Card;

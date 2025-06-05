import { useState } from "react";
import HitTest from "../components/Model/HitTest";
import Card from "../components/Card";
import Navbar from "../components/Navbar";

function AppPage() {
  const [modelUrl, setModelUrl] = useState(null);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-slate-900">
      <Navbar />

      {/* AR/3D Section */}
      <div className="flex-grow">
        <HitTest modelUrl={modelUrl} />
      </div>

      {/* Model Selector */}
      <div className="mt-4 px-4 pb-6">
        <Card onModelSelect={setModelUrl} />
      </div>
    </div>
  );
}

export default AppPage;

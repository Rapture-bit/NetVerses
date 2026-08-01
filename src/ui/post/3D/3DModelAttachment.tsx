import * as THREE from "three";
import React, { useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} />;
}

export default function ThreeDModelAttachment({ attachment, ...props }) {
  useEffect(() => {
    console.log(attachment.attachmentDetails.src);
  }, []);

  return (
    <>
      <div
        className={`${attachment.isAI ? "border-2 border-red-500" : ""} rounded-lg cursor-pointer hover:brightness-90 duration-300 transition-all w-64 h-40 object-cover flex-shrink-0`}
        {...props}
      >
        <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
          <ambientLight />
          <directionalLight position={[5, 5, 5]} />

          <Suspense fallback={null}>
            <Model url={attachment.attachmentDetails.src} />
          </Suspense>
          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.4}
            enablePan={true}
            minDistance={1.5}
            maxDistance={4}
          />
        </Canvas>
      </div>
    </>
  );
}

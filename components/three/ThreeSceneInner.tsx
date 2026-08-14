'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';

/** GLB fallback — lightweight procedural sphere until models are added to /public/models */
export function ThreeSceneInner({
  modelPath,
  accentColor,
}: {
  modelPath: string;
  accentColor: string;
}) {
  void modelPath;

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere args={[1, 64, 64]} scale={1.1}>
          <MeshDistortMaterial
            color={accentColor}
            attach="material"
            distort={0.25}
            speed={1.5}
            roughness={0.25}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
    </Canvas>
  );
}

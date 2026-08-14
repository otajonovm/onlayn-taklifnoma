'use client';

import { Suspense, lazy } from 'react';

const Scene = lazy(() =>
  import('./ThreeSceneInner').then((m) => ({ default: m.ThreeSceneInner }))
);

export interface ThreeSceneRouterProps {
  category?: string;
  modelPath?: string;
  accentColor?: string;
  className?: string;
}

function GoldSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-32">
      <div
        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: '#D4AF37', borderTopColor: 'transparent' }}
      />
    </div>
  );
}

export function ThreeSceneRouter({
  category = 'wedding',
  modelPath,
  accentColor = '#D4AF37',
  className = 'h-40 w-full',
}: ThreeSceneRouterProps) {
  const resolvedModel =
    modelPath ||
    (category === 'kids_sunnat'
      ? '/models/crown.glb'
      : category === 'education'
        ? '/models/academic_book.glb'
        : '/models/wedding_rings.glb');

  return (
    <div className={className}>
      <Suspense fallback={<GoldSpinner />}>
        <Scene modelPath={resolvedModel} accentColor={accentColor} />
      </Suspense>
    </div>
  );
}

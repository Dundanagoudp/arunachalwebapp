'use client';

import dynamic from 'next/dynamic';

const InthenewsComponent = dynamic(
  () => import('@/components/(public)/Inthenews/modules/Inthenews-section'),
  { ssr: false }
);

export default function InthenewsClientPage() {
  return <InthenewsComponent />;
} 
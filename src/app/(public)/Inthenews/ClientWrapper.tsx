'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const LoadingProgress = dynamic(() => import('@/components/LoadingProgress'), { ssr: false });
const InthenewsComponent = dynamic(() => import('@/components/(public)/Inthenews/modules/Inthenews-section'), { ssr: false });

export default function ClientWrapper() {
  return (
    <>
      <LoadingProgress />
      <InthenewsComponent />
    </>
  );
} 
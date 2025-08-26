import React, { Suspense } from 'react';
import LoadingProgress from '@/components/LoadingProgress';
import InthenewsSection from '@/components/(public)/Inthenews/modules/Inthenews-section';

export default function InthenewsPage() {
  return (
    <>
      <LoadingProgress />
      <Suspense fallback={<div>Loading...</div>}>
        <InthenewsSection />
      </Suspense>
    </>
  );
} 
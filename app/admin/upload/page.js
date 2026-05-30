'use client';

import { Suspense } from 'react';
import UploadPageInner from './UploadPageInner';

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <UploadPageInner />
    </Suspense>
  );
}
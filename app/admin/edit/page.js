import { Suspense } from 'react';
import UploadClient from '../upload/UploadClient';

export default function EditApartmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 px-4 py-12 text-center text-slate-600 dark:bg-slate-950 dark:text-slate-300">
          Loading listing editor...
        </div>
      }
    >
      <UploadClient requireListingId />
    </Suspense>
  );
}

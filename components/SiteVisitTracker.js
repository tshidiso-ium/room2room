'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebaseClient';

let lastTrackedPath = null;

export default function SiteVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
      return;
    }
    if (lastTrackedPath === pathname) return;
    lastTrackedPath = pathname;

    const day = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setDoc(
      doc(db, 'stats', 'site'),
      {
        pageViewCount: increment(1),
        dailyViews: { [day]: increment(1) },
        lastVisitedAt: serverTimestamp(),
      },
      { merge: true }
    ).catch((error) => console.error('Failed to track site visit:', error));
  }, [pathname]);

  return null;
}

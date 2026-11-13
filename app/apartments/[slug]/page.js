import { notFound } from 'next/navigation';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '@/app/lib/firebaseClient';
import ApartmentDetailClient from './ApartmentDetailClient';

export const dynamic = 'force-dynamic';

function serializeApartment(doc) {
  const data = doc.data();

  const apartment = {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : null,
    updatedAt: data.updatedAt?.seconds
      ? new Date(data.updatedAt.seconds * 1000).toISOString()
      : null,
  };

  // Firestore timestamps (including visit/contact dates) must be plain values
  // before this object crosses the Server Component boundary.
  return JSON.parse(JSON.stringify(apartment));
}

async function getApartmentBySlug(slug) {
  const q = query(
    collection(db, 'apartments'),
    where('slug', '==', slug),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty || snapshot.docs[0].data().isSuspended === true) {
    return null;
  }

  return serializeApartment(snapshot.docs[0]);
}

export default async function ApartmentPage({ params }) {
  const { slug } = await params;

  const apartment = await getApartmentBySlug(slug);

  if (!apartment) {
    notFound();
  }

  return <ApartmentDetailClient apartment={apartment} />;
}

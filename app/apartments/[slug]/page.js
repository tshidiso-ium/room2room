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

export const revalidate = 60;
export const dynamic = 'force-static';
export const dynamicParams = true;

function serializeApartment(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.seconds
      ? new Date(data.createdAt.seconds * 1000).toISOString()
      : null,
    updatedAt: data.updatedAt?.seconds
      ? new Date(data.updatedAt.seconds * 1000).toISOString()
      : null,
  };
}

async function getApartmentBySlug(slug) {
  const q = query(
    collection(db, 'apartments'),
    where('slug', '==', slug),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return serializeApartment(snapshot.docs[0]);
}

export async function generateStaticParams() {
  return [];
}

export default async function ApartmentPage({ params }) {
  const { slug } = await params;

  const apartment = await getApartmentBySlug(slug);

  if (!apartment) {
    notFound();
  }

  return <ApartmentDetailClient apartment={apartment} />;
}
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

export const revalidate = 60; // regenerate page at most every 60 seconds
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

async function getApartmentSlugs() {
  const snapshot = await getDocs(collection(db, 'apartments'));

  return snapshot.docs
    .map((doc) => doc.data().slug)
    .filter(Boolean)
    .map((slug) => ({
      slug,
    }));
}

async function getApartmentBySlug(slug) {
  const apartmentsRef = collection(db, 'apartments');

  const q = query(
    apartmentsRef,
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
  return getApartmentSlugs();
}

export default async function ApartmentPage({ params }) {
  const { slug } = await params;

  const apartment = await getApartmentBySlug(slug);

  if (!apartment) {
    notFound();
  }

  return <ApartmentDetailClient apartment={apartment} />;
}
import { notFound } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebaseClient';
import ApartmentDetailClient from './ApartmentDetailClient';

async function getApartments() {
  const snapshot = await getDocs(collection(db, 'apartments'));

  return snapshot.docs.map((doc) => {
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
  });
}

export async function generateStaticParams() {
  const apartments = await getApartments();

  return apartments
    .filter((apartment) => apartment.slug)
    .map((apartment) => ({
      slug: apartment.slug,
    }));
}

export default async function ApartmentPage({ params }) {
  const { slug } = await params;

  const apartments = await getApartments();
  const apartment = apartments.find((item) => item.slug === slug);

  if (!apartment) {
    notFound();
  }

  return <ApartmentDetailClient apartment={apartment} />;
}
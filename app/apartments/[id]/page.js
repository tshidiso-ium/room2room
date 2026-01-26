import apartmentData from '@/app/data/apartmentData'; // move the object to a reusable file
import ApartmentDetailClient from './ApartmentDetailClient';

export async function generateStaticParams() {
  return Object.keys(apartmentData).map(id => ({ id }));
}

export default async function ApartmentDetailPage({ params }) {
  const paramsVar = await params || {}; // Ensure params is defined
  const apartment = await apartmentData[paramsVar.id];

  if (!apartment) return <div className="p-10 text-center">Listing not found.</div>;

  return <ApartmentDetailClient apartment={apartment} />;
}
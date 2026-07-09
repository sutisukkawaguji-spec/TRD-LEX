import { mockListings } from '@/lib/mockData';
import ListingDetailClient from '@/components/ListingDetailClient';

export function generateStaticParams() {
  return mockListings.map((l) => ({
    id: l.id,
  }));
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <ListingDetailClient id={resolvedParams.id} />;
}

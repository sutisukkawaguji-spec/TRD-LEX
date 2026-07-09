import { mockListings } from '@/lib/mockData';
import ListingDetailClient from '@/components/ListingDetailClient';

export function generateStaticParams() {
  return mockListings.map((l) => ({
    id: l.id,
  }));
}

export default function Page({ params }) {
  return <ListingDetailClient params={params} />;
}

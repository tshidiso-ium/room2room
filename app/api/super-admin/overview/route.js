import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { requireSuperAdmin } from '@/app/lib/superAdminAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function listAllUsers() {
  const users = [];
  let pageToken;

  do {
    const page = await adminAuth.listUsers(1000, pageToken);
    users.push(...page.users.map((user) => ({
      uid: user.uid,
      email: user.email || '',
      name: user.displayName || '',
      disabled: user.disabled,
      createdAt: user.metadata.creationTime || null,
      lastSignInAt: user.metadata.lastSignInTime || null,
    })));
    pageToken = page.pageToken;
  } while (pageToken);

  return users;
}

function trafficDays(dailyViews) {
  const todayInSouthAfrica = new Date(Date.now() + 2 * 60 * 60 * 1000);
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(todayInSouthAfrica);
    date.setUTCDate(date.getUTCDate() - (13 - index));
    const day = date.toISOString().slice(0, 10);
    return { day, views: Number(dailyViews?.[day] || 0) };
  });
}

export async function GET(request) {
  const access = await requireSuperAdmin(request);
  if (access.error) return access.error;

  try {
    const [users, listingsSnapshot, statsSnapshot] = await Promise.all([
      listAllUsers(),
      adminDb.collection('apartments').get(),
      adminDb.collection('stats').doc('site').get(),
    ]);

    const listings = listingsSnapshot.docs.map((snapshot) => {
      const listing = snapshot.data();
      return {
        id: snapshot.id,
        title: listing.title || 'Untitled listing',
        slug: listing.slug || snapshot.id,
        agentId: listing.agentId || '',
        agentName: listing.agentName || listing.agent?.name || '',
        isAvailable: listing.isAvailable === true,
        isPromoted: listing.isPromoted === true,
        promotedAt: listing.promotedAt?.toDate?.().toISOString() || null,
        createdAt: listing.createdAt?.toDate?.().toISOString() || null,
        visitCount: Number(listing.visitCount || 0),
        contactClick: Number(listing.contactClick || 0),
      };
    });
    const stats = statsSnapshot.data() || {};

    return NextResponse.json(
      {
        currentUser: { uid: access.user.uid, email: access.user.email || '' },
        users,
        listings,
        traffic: {
          pageViews: Number(stats.pageViewCount || 0),
          previousHomepageVisits: Number(stats.visitCount || 0),
          days: trafficDays(stats.dailyViews),
        },
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Failed to load super admin overview:', error);
    return NextResponse.json({ error: 'Unable to load the site overview.' }, { status: 500 });
  }
}

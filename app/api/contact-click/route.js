import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/app/lib/firebaseAdmin';

export const runtime = 'nodejs';

const actionFields = {
  contactAgent: ['contactClick', 'lastContactedAt'],
  quickWhatsapp: ['quickWhatsappClick', 'lastQuickWhatsappAt'],
};

export async function POST(request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const listingId = body?.listingId;
  const fields = Object.hasOwn(actionFields, body?.action)
    ? actionFields[body.action]
    : null;
  if (typeof listingId !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(listingId) || !fields) {
    return NextResponse.json({ error: 'Invalid listing or contact action.' }, { status: 400 });
  }

  try {
    const listingRef = adminDb.collection('apartments').doc(listingId);
    const result = await adminDb.runTransaction(async (transaction) => {
      const listing = await transaction.get(listingRef);
      if (!listing.exists) return 'missing';
      if (listing.data().isSuspended === true) return 'suspended';
      transaction.update(listingRef, {
        [fields[0]]: FieldValue.increment(1),
        [fields[1]]: FieldValue.serverTimestamp(),
      });
      return 'tracked';
    });
    if (result === 'missing') {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }
    if (result === 'suspended') {
      return NextResponse.json({ error: 'This listing is suspended.' }, { status: 410 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error.code === 5 || error.code === 'not-found') {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }
    console.error('Failed to track listing contact click:', error);
    return NextResponse.json({ error: 'Unable to track contact click.' }, { status: 500 });
  }
}

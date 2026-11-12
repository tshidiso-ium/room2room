import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from '@/app/lib/firebaseAdmin';
import { requireSuperAdmin } from '@/app/lib/superAdminAuth';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
  const access = await requireSuperAdmin(request);
  if (access.error) return access.error;

  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
  if (typeof body?.promoted !== 'boolean' || !id) {
    return NextResponse.json({ error: 'A valid promotion status is required.' }, { status: 400 });
  }

  try {
    const listingRef = adminDb.collection('apartments').doc(id);
    if (!(await listingRef.get()).exists) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }
    await listingRef.update({
      isPromoted: body.promoted,
      promotedAt: body.promoted ? FieldValue.serverTimestamp() : null,
      promotedBy: body.promoted ? access.user.uid : null,
    });
    return NextResponse.json({ id, isPromoted: body.promoted });
  } catch (error) {
    console.error('Failed to change listing promotion:', error);
    return NextResponse.json({ error: 'Unable to update the listing.' }, { status: 500 });
  }
}

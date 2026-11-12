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
  const changingPromotion = typeof body?.promoted === 'boolean';
  const changingSuspension = typeof body?.suspended === 'boolean';
  if (!id || changingPromotion === changingSuspension) {
    return NextResponse.json({ error: 'Choose a promotion or suspension status.' }, { status: 400 });
  }

  try {
    const listingRef = adminDb.collection('apartments').doc(id);
    const result = await adminDb.runTransaction(async (transaction) => {
      const listing = await transaction.get(listingRef);
      if (!listing.exists) return { status: 404, error: 'Listing not found.' };
      if (changingPromotion && body.promoted && listing.data().isSuspended === true) {
        return { status: 409, error: 'Restore this listing before boosting it.' };
      }

      if (changingSuspension) {
        transaction.update(listingRef, {
          isSuspended: body.suspended,
          suspendedAt: body.suspended ? FieldValue.serverTimestamp() : null,
          suspendedBy: body.suspended ? access.user.uid : null,
        });
        return { id, isSuspended: body.suspended };
      }

      transaction.update(listingRef, {
        isPromoted: body.promoted,
        promotedAt: body.promoted ? FieldValue.serverTimestamp() : null,
        promotedBy: body.promoted ? access.user.uid : null,
      });
      return { id, isPromoted: body.promoted };
    });
    if (result.status) return NextResponse.json({ error: result.error }, { status: result.status });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to change listing status:', error);
    return NextResponse.json({ error: 'Unable to update the listing.' }, { status: 500 });
  }
}

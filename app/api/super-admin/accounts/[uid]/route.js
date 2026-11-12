import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebaseAdmin';
import { requireSuperAdmin } from '@/app/lib/superAdminAuth';

export const runtime = 'nodejs';

export async function PATCH(request, { params }) {
  const access = await requireSuperAdmin(request);
  if (access.error) return access.error;

  const { uid } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (typeof body?.disabled !== 'boolean' || !uid) {
    return NextResponse.json({ error: 'A valid account status is required.' }, { status: 400 });
  }
  if (uid === access.user.uid) {
    return NextResponse.json({ error: 'You cannot disable your own account.' }, { status: 400 });
  }

  try {
    const target = await adminAuth.getUser(uid);
    const allowedEmails = (process.env.SUPER_ADMIN_EMAILS || '')
      .split(',')
      .map((email) => email.trim().toLowerCase());
    if (allowedEmails.includes((target.email || '').toLowerCase())) {
      return NextResponse.json({ error: 'Super admin accounts cannot be disabled here.' }, { status: 400 });
    }

    // Rules can check this document immediately, even before old ID tokens expire.
    await adminDb.collection('accountStatus').doc(uid).set(
      { disabled: body.disabled, updatedAt: new Date(), updatedBy: access.user.uid },
      { merge: true }
    );
    await adminAuth.updateUser(uid, { disabled: body.disabled });
    if (body.disabled) await adminAuth.revokeRefreshTokens(uid);

    return NextResponse.json({ uid, disabled: body.disabled });
  } catch (error) {
    console.error('Failed to change account status:', error);
    return NextResponse.json({ error: 'Unable to change the account status.' }, { status: 500 });
  }
}

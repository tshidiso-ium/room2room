import { NextResponse } from 'next/server';
import { adminAuth } from './firebaseAdmin';

function configuredAdminEmails() {
  return (process.env.SUPER_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireSuperAdmin(request) {
  const allowedEmails = configuredAdminEmails();
  if (!allowedEmails.length) {
    return {
      error: NextResponse.json(
        { error: 'Super admin access has not been configured.' },
        { status: 503 }
      ),
    };
  }

  const authorization = request.headers.get('authorization') || '';
  const match = /^Bearer (\S+)$/i.exec(authorization);
  if (!match) {
    return {
      error: NextResponse.json({ error: 'Sign in to continue.' }, { status: 401 }),
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(match[1], true);
    const user = await adminAuth.getUser(decodedToken.uid);
    if (user.disabled || !user.emailVerified || !allowedEmails.includes((user.email || '').toLowerCase())) {
      return {
        error: NextResponse.json({ error: 'Super admin access is required.' }, { status: 403 }),
      };
    }

    return { user };
  } catch (error) {
    if (error.code === 'app/invalid-credential' || error.code === 'app/invalid-app-credential') {
      console.error('Firebase Admin credentials are unavailable:', error);
      return {
        error: NextResponse.json(
          { error: 'Server credentials are not configured.' },
          { status: 503 }
        ),
      };
    }

    return {
      error: NextResponse.json({ error: 'Your session has expired. Sign in again.' }, { status: 401 }),
    };
  }
}

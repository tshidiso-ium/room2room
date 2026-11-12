import { NextResponse } from 'next/server';
import { requireSuperAdmin } from '@/app/lib/superAdminAuth';

export const runtime = 'nodejs';

export async function GET(request) {
  const access = await requireSuperAdmin(request);
  if (access.error) return access.error;
  return NextResponse.json({ isSuperAdmin: true });
}

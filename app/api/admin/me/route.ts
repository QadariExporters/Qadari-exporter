import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';
import { getAdminById } from '@/lib/db/service';

export async function GET() {
  try {
    const adminPayload = await getCurrentAdmin();
    if (!adminPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await getAdminById(adminPayload.id);
    if (!admin) {
      return NextResponse.json({
        id: adminPayload.id,
        email: adminPayload.email,
        name: adminPayload.name,
        role: adminPayload.role,
      });
    }

    return NextResponse.json(admin);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

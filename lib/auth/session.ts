import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME, verifyAdminToken, AdminJWTPayload } from './jwt';
import { getAdminById } from '../db/service';

export async function getCurrentAdmin(): Promise<AdminJWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;

  const payload = await verifyAdminToken(token);
  if (!payload) return null;

  return payload;
}

export async function requireAuth(): Promise<AdminJWTPayload> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}

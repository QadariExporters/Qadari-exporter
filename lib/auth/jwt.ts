import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'qadri_secret_jwt_key_984392849234_secure_admin_token_2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export const AUTH_COOKIE_NAME = 'qadri_admin_token';
export const TOKEN_EXPIRY = '7d';

export interface AdminJWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function signAdminToken(payload: AdminJWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token: string): Promise<AdminJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminJWTPayload;
  } catch (err) {
    return null;
  }
}

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // If hash is a dummy or bcrypt format, verify with bcrypt
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    console.error('Password comparison error:', err);
    return false;
  }
}

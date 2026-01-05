import { createHash } from 'crypto';

/**
 * Normalizes and hashes a string using SHA-256.
 * Useful for enhanced conversions (Google/Meta).
 * @param data The string to hash (e.g., email or phone).
 * @returns The hex-encoded SHA-256 hash.
 */
export function hashUserData(data: string | undefined | null): string | undefined {
    if (!data) return undefined;

    // 1. Normalize: trim and lowercase
    const normalized = data.trim().toLowerCase();

    // 2. Hash: SHA-256
    return createHash('sha256').update(normalized).digest('hex');
}

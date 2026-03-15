/**
 * Simple in-memory rate limiter using a windowed counter.
 * Suitable for single-instance deployments. For production serverless,
 * replace with Redis-based limiter (e.g., @upstash/ratelimit).
 */

const VISIT_MAP = new Map<string, { count: number; firstSeen: number }>();

// Cleanup stale entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of VISIT_MAP) {
        if (now - entry.firstSeen > windowMs * 2) {
            VISIT_MAP.delete(key);
        }
    }
}

/**
 * Check if the given identifier has exceeded the rate limit.
 * @param identifier - Unique key (e.g., IP address)
 * @param limit - Max requests allowed within the window (default: 10)
 * @param windowMs - Window duration in milliseconds (default: 60 seconds)
 * @returns `true` if rate limit exceeded, `false` otherwise
 */
export function isRateLimited(
    identifier: string,
    limit = 10,
    windowMs = 60_000
): boolean {
    cleanupStaleEntries(windowMs);

    const now = Date.now();
    const entry = VISIT_MAP.get(identifier);

    if (!entry || now - entry.firstSeen > windowMs) {
        VISIT_MAP.set(identifier, { count: 1, firstSeen: now });
        return false;
    }

    entry.count += 1;
    return entry.count > limit;
}

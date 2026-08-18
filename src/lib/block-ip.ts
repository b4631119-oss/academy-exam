/**
 * IP Blocking Module with automatic expiration (24h default)
 */

interface BlockRecord {
  blockedUntil: number;
  reason: string;
}

const blockedIPs = new Map<string, BlockRecord>();

const DEFAULT_BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Checks if an IP is currently blocked.
 */
export function isIPBlocked(ip: string): boolean {
  if (!ip) return false;
  const isLoopback = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
  if (isLoopback && process.env.NODE_ENV === 'development') {
    return false;
  }

  const record = blockedIPs.get(ip);
  if (!record) return false;

  if (Date.now() > record.blockedUntil) {
    blockedIPs.delete(ip);
    return false;
  }

  return true;
}

/**
 * Blocks an IP address for a specified duration.
 */
export function blockIP(ip: string, reason: string = 'DDoS / Rate Limit Exceeded', durationMs: number = DEFAULT_BLOCK_DURATION) {
  if (!ip) return;
  const isLoopback = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost';
  if (isLoopback && process.env.NODE_ENV === 'development') {
    console.log(`[SECURITY DEBUG] Skipped 24h IP block for loopback address ${ip} in development.`);
    return;
  }

  blockedIPs.set(ip, {
    blockedUntil: Date.now() + durationMs,
    reason
  });
  console.warn(`[SECURITY WARN] IP ${ip} blocked until ${new Date(Date.now() + durationMs).toISOString()}. Reason: ${reason}`);
}

/**
 * Unblocks an IP address manually.
 */
export function unblockIP(ip: string) {
  blockedIPs.delete(ip);
}

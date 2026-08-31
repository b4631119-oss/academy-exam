/**
 * Action Logger for tracking user actions and security violations.
 */
import type { LogMetadata } from "./types"

export function logAction(action: string, userId: string = 'ANONYMOUS', data?: LogMetadata) {
  const timestamp = new Date().toISOString();
  const logPayload = {
    timestamp,
    action,
    userId,
    data: data || null
  };

  console.log(`[AUDIT LOG] ${timestamp} | Action: ${action} | User: ${userId}`, data ? JSON.stringify(data) : '');

  return logPayload;
}

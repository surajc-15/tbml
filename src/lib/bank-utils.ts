/**
 * Extract bank code from account ID
 * Format: Bank_A_1245 -> Bank_A (everything before the last segment)
 */
export function getBankCode(accountId: string | null): string {
  if (!accountId) return '';

  let cleaned = accountId.trim();

  // Normalize spaces to underscores for bank names like "Bank A"
  if (cleaned.includes(' ')) {
    cleaned = cleaned.replace(/\s+/g, '_');
  }

  const parts = cleaned.split('_');

  // If this looks like a full account id (Bank_A_1234), return Bank_A
  if (parts.length >= 3) {
    return parts.slice(0, -1).join('_');
  }

  // If this already looks like a bank code (Bank_A), return as-is
  if (parts.length === 2) {
    return parts.join('_');
  }

  // Fallback: return the cleaned value
  return cleaned;
}

/**
 * Check if account belongs to a specific bank
 */
export function accountBelongsToBank(accountId: string | null, bankCode: string): boolean {
  if (!accountId || !bankCode) return false;
  const acct = getBankCode(accountId);
  const normalize = (s: string) => s.replace(/[_\s-]/g, '').toLowerCase();
  return normalize(acct) === normalize(bankCode);
}

/**
 * Check if transaction involves a specific bank (as sender or receiver)
 */
export function transactionInvolvesBank(
  senderAccountId: string | null,
  receiverAccountId: string | null,
  bankCode: string
): boolean {
  return (
    accountBelongsToBank(senderAccountId, bankCode) || accountBelongsToBank(receiverAccountId, bankCode)
  );
}

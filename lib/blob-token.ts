/**
 * Resolve Blob write token from env. Supports legacy/custom key names.
 */
export function getBlobReadWriteToken(): string | null {
  return (
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.pirate1_READ_WRITE_TOKEN?.trim() ||
    null
  );
}

export function blobConfigured(): boolean {
  return Boolean(getBlobReadWriteToken());
}

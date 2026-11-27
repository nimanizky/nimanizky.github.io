export function isPublished(status: unknown, allowMissing = true): boolean {
  return (status === undefined && allowMissing)
    || (typeof status === 'string' && status.trim().toLowerCase() === 'published');
}

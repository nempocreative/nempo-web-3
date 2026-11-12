// Stand-in: no Clerk key is needed while buyer accounts are disabled.
export function publishableKeyFromHost(_host: string, _key?: string) {
  return 'guest-mode';
}

export function buildUserSnapshot(firebaseUser, dbUser) {
  if (!firebaseUser && !dbUser) {
    return undefined;
  }

  const name = dbUser?.displayName ?? firebaseUser?.name ?? firebaseUser?.email ?? '';
  const email = dbUser?.email ?? firebaseUser?.email ?? '';

  return {
    firebaseUid: firebaseUser?.uid,
    name: name || undefined,
    email: email || undefined,
    role: dbUser?.role
  };
}

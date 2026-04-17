/** Community profile tier used for gating features and moderation. */
export type CommunityPermission = 'fan' | 'super_fan' | 'mod';

const ORDER: Record<CommunityPermission, number> = {
  fan: 1,
  super_fan: 2,
  mod: 3,
};

export function parseCommunityPermission(value: unknown): CommunityPermission | null {
  if (value === 'fan' || value === 'super_fan' || value === 'mod') return value;
  return null;
}

/** True when `user` has at least the tier `required` (e.g. mod can access super_fan gates). */
export function hasAtLeastPermission(
  user: CommunityPermission,
  required: CommunityPermission
): boolean {
  return ORDER[user] >= ORDER[required];
}

export function permissionLabel(p: CommunityPermission): string {
  switch (p) {
    case 'fan':
      return 'Fan';
    case 'super_fan':
      return 'Super fan';
    case 'mod':
      return 'Mod';
  }
}

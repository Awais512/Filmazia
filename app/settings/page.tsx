import { requireAuth } from '@/features/auth/utils/require-auth';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const user = await requireAuth();
  return <SettingsClient userId={user.id} />;
}

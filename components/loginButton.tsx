'use client';

import { Button } from '@/components/ui/button';

import { useRouter } from 'next/navigation';

export function LoginButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push('/api/auth/signin');
      }}
    >
      Login
    </Button>
  );
}

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push('/api/auth/signout');
      }}
    >
      Logout
    </Button>
  );
}

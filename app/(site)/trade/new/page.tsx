'use client';

import { useRouter } from 'next/navigation';
import CreateTradePage from '../../../components/CreateTradePage';

export default function NewTradePage() {
  const router = useRouter();
  
  return (
    <CreateTradePage 
      onBack={() => router.back()}
      onSubmit={(data) => {
        console.log('Trade created:', data);
        router.push('/trade');
      }}
    />
  );
}

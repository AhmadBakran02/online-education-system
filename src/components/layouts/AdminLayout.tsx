'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      router.push('/unauthorized');
    }
  }, [user, loading, router]);

  if (loading || user?.role !== 'admin') {
    return <div>Loading or verifying permissions...</div>;
  }

  return (
    <div className="admin-layout">
      {/* <AdminNavbar /> */}
      <main>{children}</main>
    </div>
  );
}
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminLayout } from '@/components/admin';

export default function AdminRootLayout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        // For now, we'll check if user is admin (assuming role field exists)
        // If not an admin, redirect to access denied
        if (!loading && user && user.role !== 'admin') {
            router.push('/access-denied');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <AdminLayout>{children}</AdminLayout>;
}

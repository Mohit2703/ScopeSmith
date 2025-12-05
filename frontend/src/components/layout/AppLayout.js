'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';

export function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/dashboard" className="text-xl font-bold text-primary">
                                    ScopeSmith
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${pathname === '/dashboard'
                                            ? 'border-primary text-foreground'
                                            : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3 flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {user?.username || user?.email}
                                </span>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    Sign out
                                </Button>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <Link
                                href="/dashboard"
                                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${pathname === '/dashboard'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </div>
                        <div className="border-t border-border pb-3 pt-4">
                            <div className="flex items-center px-4">
                                <div className="ml-3">
                                    <div className="text-base font-medium text-foreground">{user?.username}</div>
                                    <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start px-4"
                                    onClick={logout}
                                >
                                    Sign out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

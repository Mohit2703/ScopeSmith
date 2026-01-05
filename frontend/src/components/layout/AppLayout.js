'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import ThemeToggle from '@/components/home/ThemeToggle';

export function AppLayout({ children }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center gap-2">
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    <Logo className="w-30 h-30 object-contain" />
                                </Link>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors ${pathname === '/dashboard'
                                        ? 'border-[var(--brand-blue)] text-slate-900 dark:text-white'
                                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <div className="relative ml-3 flex items-center gap-4">
                                <ThemeToggle />
                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                    {user?.username || user?.email}
                                </span>
                                <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                                    Sign out
                                </Button>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden gap-2">
                            <ThemeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-slate-600 dark:text-slate-400"
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
                    <div className="sm:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <div className="space-y-1 pb-3 pt-2">
                            <Link
                                href="/dashboard"
                                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${pathname === '/dashboard'
                                    ? 'border-[var(--brand-blue)] bg-blue-50 dark:bg-blue-900/10 text-[var(--brand-blue)]'
                                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-800 pb-3 pt-4">
                            <div className="flex items-center px-4">
                                <div className="ml-3">
                                    <div className="text-base font-medium text-slate-800 dark:text-slate-200">{user?.username}</div>
                                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{user?.email}</div>
                                </div>
                            </div>
                            <div className="mt-3 space-y-1">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start px-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
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

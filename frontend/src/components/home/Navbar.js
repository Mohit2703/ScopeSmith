import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import Logo from '@/components/ui/Logo';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-white dark:bg-slate-950 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo className="w-30 h-30 object-contain" />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#services" className="text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-2 text-sm font-medium transition-colors">
                                Services
                            </Link>
                            <Link href="#ai-generator" className="text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-2 text-sm font-medium transition-colors">
                                AI Generator
                            </Link>
                            <Link href="#process" className="text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-2 text-sm font-medium transition-colors">
                                Process
                            </Link>
                            <Link href="#about" className="text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-2 text-sm font-medium transition-colors">
                                About
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Link
                            href="/dashboard"
                            className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-purple)] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Generate Requirement
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600 dark:text-slate-300 p-2"
                        >
                            {isMobileMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-4 text-base font-medium border-b border-slate-50 dark:border-slate-900">
                            Services
                        </Link>
                        <Link href="#ai-generator" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-4 text-base font-medium border-b border-slate-50 dark:border-slate-900">
                            AI Generator
                        </Link>
                        <Link href="#process" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-4 text-base font-medium border-b border-slate-50 dark:border-slate-900">
                            Process
                        </Link>
                        <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="block text-slate-600 dark:text-slate-300 hover:text-[var(--brand-blue)] px-3 py-4 text-base font-medium border-b border-slate-50 dark:border-slate-900">
                            About
                        </Link>
                        <div className="pt-4">
                            <Link
                                href="/dashboard"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-purple)] text-white px-6 py-4 rounded-xl text-center text-base font-bold shadow-lg"
                            >
                                Generate Requirement
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

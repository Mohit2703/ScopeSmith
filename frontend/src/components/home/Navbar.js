import Link from 'next/link';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <div className="w-5 h-5 rounded-full border-[3px] border-white/30" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Nexora
                            </span>
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
                            href="/quote"
                            className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-purple)] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Get Quote
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

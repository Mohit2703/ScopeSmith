import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900/50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-10 gap-12 mb-20">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <img src="/pranix_logo.png" alt="Pranix logo" className="w-40 h-40 object-contain" />
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-sm">
                            Building powerful digital solutions that transform businesses and drive growth.
                        </p>
                        <div className="flex gap-4">
                            {['linkedin', 'twitter', 'github', 'instagram'].map((social) => (
                                <a key={social} href={`#${social}`} className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[var(--brand-blue)] hover:text-white transition-all duration-300 border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <span className="sr-only">{social}</span>
                                    <div className="w-5 h-5 bg-current" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg">Services</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li>Custom CRM</li>
                            <li>SaaS Development</li>
                            <li>Mobile Apps</li>
                            <li>AI Automations</li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg">Resources</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li>Documentation</li>
                            <li>Case Studies</li>
                            <li>AI Generator</li>
                            <li>FAQ</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg">Contact</h4>
                        <ul className="space-y-4 text-slate-600 dark:text-slate-400">
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--brand-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                buildwithpranix@gmail.com
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--brand-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                +91 (914) 632-8339   /  +91 (738) 575-5338
                            </li>
                            <li className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-[var(--brand-teal)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Pune, Maharashtra
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        © {new Date().getFullYear()} Nexora. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-slate-500 dark:text-slate-400 font-medium">
                        <Link href="#" className="hover:text-[var(--brand-blue)] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[var(--brand-blue)] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

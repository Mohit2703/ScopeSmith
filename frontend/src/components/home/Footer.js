import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900/50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
                    {/* Brand */}
                    <div className="md:col-span-4">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <Logo className="w-32 object-contain" />
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8 max-w-sm">
                            Building powerful digital solutions that transform businesses and drive growth.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Linkedin, name: 'linkedin' },
                                { icon: Twitter, name: 'twitter' }
                            ].map((social) => (
                                <a key={social.name} href={`#${social.name}`} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-[var(--brand-blue)] hover:text-white transition-all duration-300 border border-slate-100 dark:border-slate-800 shadow-sm group">
                                    <span className="sr-only">{social.name}</span>
                                    <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
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
                    <div className="md:col-span-4">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-8 text-lg">Contact</h4>
                        <ul className="space-y-6 text-slate-600 dark:text-slate-400">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-[var(--brand-blue)]" />
                                </div>
                                <div className="pt-2">
                                    <p className="font-medium text-slate-900 dark:text-white mb-1">Email</p>
                                    <p className="break-all">buildwithpranix@gmail.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/10 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-[var(--brand-purple)]" />
                                </div>
                                <div className="pt-2">
                                    <p className="font-medium text-slate-900 dark:text-white mb-1">Phone</p>
                                    <p>+91 (914) 632-8339</p>
                                    <p>+91 (738) 575-5338</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-[var(--brand-teal)]" />
                                </div>
                                <div className="pt-2">
                                    <p className="font-medium text-slate-900 dark:text-white mb-1">Office</p>
                                    <p>Pune, Maharashtra</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        © {new Date().getFullYear()} Pranix. All rights reserved.
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

import { useState } from 'react';

export default function AIRequirementGenerator() {
    const [projectType, setProjectType] = useState('SaaS');

    return (
        <section id="ai-generator" className="py-32 bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 text-[var(--brand-purple)] text-sm font-bold mb-8 border border-purple-100 dark:border-purple-800/30">
                            <span className="text-lg">✨</span>
                            AI-Powered
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight">
                            Generate Your <br />
                            <span className="text-gradient">Project Requirements</span> with AI
                        </h2>

                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                            Not sure where to start? Our AI requirement generator helps you define your project scope, features, and technical specifications in minutes. Get a detailed brief ready for development.
                        </p>

                        <ul className="space-y-6 mb-10">
                            {[
                                'Auto-generate detailed project specifications',
                                'Get feature recommendations based on your industry',
                                'Instant technical stack suggestions'
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-medium">
                                    <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-purple)] rounded-3xl opacity-10 blur-2xl" />
                        <div className="relative bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800/50 p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-purple)] flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Requirement Generator</h3>
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Project Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['SaaS', 'Mobile App', 'Website'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setProjectType(type)}
                                                className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${projectType === type
                                                    ? 'bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-purple)] text-white border-transparent shadow-lg shadow-indigo-500/20'
                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[var(--brand-blue)]'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Industry</label>
                                    <div className="relative">
                                        <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20 transition-all">
                                            <option>E-commerce & Retail</option>
                                            <option>Healthcare</option>
                                            <option>Fintech</option>
                                            <option>Education</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Describe Your Idea</label>
                                    <textarea
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]/20 transition-all"
                                        placeholder="I want to build a subscription-based learning platform..."
                                    />
                                </div>

                                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-purple)] to-[var(--brand-teal)] text-white font-bold text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Generate Requirements
                                </button>

                                <div className="mt-6 p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-teal-600">✨</span>
                                        <span className="text-sm font-bold text-teal-900 dark:text-teal-400">AI Generated Preview</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        Based on your input, we recommend: User authentication, video streaming module, progress dashboard, community forum, subscription...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] conic-gradient opacity-20 blur-[120px] rounded-full animate-spin-slow" />
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40 dark:opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border-gradient backdrop-blur-md mb-8">
                    <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[var(--brand-blue)] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--brand-blue)]"></span>
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">AI-Powered Development</span>
                </div>

                <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.05]">
                    Build Anything. <span className="text-gradient">Scale Everything.</span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Transform your ideas into powerful digital products — from custom CRMs and SaaS platforms to mobile apps, websites, and AI automations.
                </p>

                <div className="flex justify-center items-center">
                    <Link
                        href="/ai-requirements"
                        className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-[var(--brand-blue)] via-[var(--brand-purple)] to-[var(--brand-teal)] rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/40 transform hover:-translate-y-1 active:translate-y-0"
                    >
                        <span className="mr-2">✨</span>
                        Generate Requirements with AI
                    </Link>
                </div>

            </div>
        </div>
    );
}

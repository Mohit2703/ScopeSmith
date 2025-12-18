import Link from 'next/link';

export default function CTABanner() {
    return (
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-[3.5rem] overflow-hidden mesh-gradient px-8 py-24 sm:px-16 sm:py-32 text-center shadow-[0_32px_64px_-12px_rgba(79,70,229,0.3)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-grid-slate-100 opacity-20 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-bold mb-8 border border-white/20 backdrop-blur-sm">
                            <span className="text-lg">🚀</span>
                            Ready to Start?
                        </div>
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                            Let's Build Something <br /> Extraordinary Together
                        </h2>
                        <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Whether you have a detailed spec or just an idea, we're here to help turn your vision into reality. Get a free consultation and project quote today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link
                                href="/quote"
                                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-slate-900 transition-all duration-300 bg-white rounded-2xl hover:bg-slate-50 hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0"
                            >
                                Get Your Free Quote
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/schedule"
                                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 bg-white/10 border-2 border-white/30 rounded-2xl hover:bg-white/20 hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-sm"
                            >
                                Schedule a Call
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

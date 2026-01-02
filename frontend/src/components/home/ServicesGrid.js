const services = [
    {
        title: 'Custom CRM',
        description: 'Tailored customer relationship management systems that streamline your sales pipeline and boost team productivity.',
        icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
        ),
        color: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
        title: 'Social Media Platforms',
        description: 'Scalable social platforms with real-time features, content moderation, and engaging user experiences.',
        icon: (
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
        ),
        color: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
        title: 'SaaS Development',
        description: 'Multi-tenant SaaS applications built for scale with subscription management and analytics dashboards.',
        icon: (
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
        color: 'bg-teal-50 dark:bg-teal-900/20'
    },
    {
        title: 'Mobile App Development',
        description: 'Native and cross-platform mobile apps that deliver exceptional performance and user experience.',
        icon: (
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
        color: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
        title: 'Website Development',
        description: 'High-converting websites with modern design, SEO optimization, and blazing-fast performance.',
        icon: (
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
        ),
        color: 'bg-blue-50/50 dark:bg-blue-900/10'
    },
    {
        title: 'AI Automations',
        description: 'Intelligent automation solutions powered by machine learning to optimize your business processes.',
        icon: (
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        ),
        color: 'bg-emerald-50 dark:bg-emerald-900/20'
    }
];

export default function ServicesGrid() {
    return (
        <section id="services" className="py-32 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-bold mb-6 border border-slate-200 dark:border-slate-800">
                        Our Services
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Everything You Need to <span className="text-gradient">Go Digital</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        From concept to deployment, we build digital solutions that drive growth and transform businesses.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-12 shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] transition-all duration-500 border border-slate-100 dark:border-slate-800/50 flex flex-col h-full transform hover:-translate-y-2 backdrop-blur-sm"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                                {service.icon}
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                                {service.title}
                            </h3>

                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 flex-grow">
                                {service.description}
                            </p>

                            {/* <div className="mt-auto">
                                <button className="text-[var(--brand-blue)] font-bold flex items-center gap-2 group/btn text-lg">
                                    Learn more
                                    <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

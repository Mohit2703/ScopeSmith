export default function ProcessTimeline() {
    const steps = [
        {
            title: 'Discovery Call',
            description: 'We discuss your vision, goals, and requirements to understand exactly what you need.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        },
        {
            title: 'Planning & Design',
            description: 'Our team creates detailed specifications, wireframes, and prototypes for your approval.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            title: 'Development',
            description: 'We build your solution using agile sprints with regular updates and feedback loops.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            )
        },
        {
            title: 'Testing & QA',
            description: 'Rigorous testing ensures your product is bug-free, secure, and performs flawlessly.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: 'Launch & Support',
            description: 'We deploy your solution and provide ongoing maintenance and support.',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        }
    ];

    return (
        <section id="process" className="py-32 bg-slate-50/50 dark:bg-slate-900/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-bold mb-6 border border-slate-200 dark:border-slate-800">
                        Our Process
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        From Idea to <span className="text-gradient">Launch</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        Our proven 5-step process ensures smooth delivery and exceptional results every time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="relative mb-8">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--brand-blue)] via-[var(--brand-purple)] to-[var(--brand-teal)] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    {step.icon}
                                </div>
                                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center text-sm font-bold text-slate-900 dark:text-white shadow-md">
                                    0{index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                {step.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

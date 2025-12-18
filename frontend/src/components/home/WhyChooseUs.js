export default function WhyChooseUs() {
    const features = [
        {
            title: 'Enterprise-Grade Security',
            description: 'Your data is protected with industry-leading security practices, encryption, and compliance standards.',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            color: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            title: 'Rapid Development',
            description: 'Our agile methodology and experienced team deliver high-quality solutions in record time.',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            color: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            title: 'Dedicated Partnership',
            description: 'We become an extension of your team, committed to your long-term success and growth.',
            icon: (
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: 'bg-teal-50 dark:bg-teal-900/20'
        }
    ];

    return (
        <section className="py-32 bg-white dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm font-bold mb-6 border border-slate-200 dark:border-slate-800">
                        Why Choose Us
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
                        Built on Trust, <span className="text-gradient">Driven by Results</span>
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                        We combine technical excellence with a client-first approach to deliver solutions that exceed expectations.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center group">
                            <div className={`w-24 h-24 mx-auto ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-slate-100 dark:border-slate-800`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

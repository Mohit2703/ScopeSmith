import React from 'react';

const trendIcons = {
    up: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
    ),
    down: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 005.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941" />
        </svg>
    ),
    neutral: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
    ),
};

const trendColors = {
    up: 'text-admin-accent-green',
    down: 'text-admin-accent-rose',
    neutral: 'text-muted-foreground',
};

const iconColors = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-admin-accent-green/10 text-admin-accent-green',
    amber: 'bg-admin-accent-amber/10 text-admin-accent-amber',
    rose: 'bg-admin-accent-rose/10 text-admin-accent-rose',
    blue: 'bg-admin-accent-blue/10 text-admin-accent-blue',
};

export function StatCard({
    title,
    value,
    change,
    changeLabel,
    trend = 'neutral',
    icon,
    iconColor = 'primary',
    isLoading = false
}) {
    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="h-3 w-24 skeleton rounded mb-3" />
                        <div className="h-8 w-16 skeleton rounded mb-2" />
                        <div className="h-4 w-32 skeleton rounded" />
                    </div>
                    <div className="w-12 h-12 skeleton rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {title}
                    </p>
                    <p className="text-3xl font-bold mt-1 text-foreground">
                        {value}
                    </p>
                    {(change !== undefined || changeLabel) && (
                        <p className={`text-sm mt-2 flex items-center gap-1 ${trendColors[trend]}`}>
                            {trendIcons[trend]}
                            <span>
                                {change !== undefined && (
                                    <span className="font-medium">
                                        {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{change}
                                    </span>
                                )}
                                {changeLabel && <span className="ml-1">{changeLabel}</span>}
                            </span>
                        </p>
                    )}
                </div>
                {icon && (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColors[iconColor]}`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}

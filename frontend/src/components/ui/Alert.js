import React from 'react';

export function Alert({ children, variant = 'default', className = '', ...props }) {
    const variants = {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
    };

    return (
        <div
            role="alert"
            className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function AlertTitle({ className, children, ...props }) {
    return (
        <h5
            className={`mb-1 font-medium leading-none tracking-tight ${className}`}
            {...props}
        >
            {children}
        </h5>
    );
}

export function AlertDescription({ className, children, ...props }) {
    return (
        <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
            {children}
        </div>
    );
}

import React from 'react';
import { marked } from 'marked';

export default function ReportViewer({ htmlContent, className = '' }) {
    if (!htmlContent) return null;

    // Parse markdown to HTML
    // The content might be mixed Markdown and HTML, which marked handles well
    const parsedContent = marked.parse(htmlContent);

    return (
        <div className={`bg-white text-slate-900 rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
            <div
                className="prose prose-slate max-w-none p-8"
                dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
        </div>
    );
}

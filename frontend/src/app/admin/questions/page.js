'use client';

export default function QuestionsPage() {
    // Redirect to templates by default
    if (typeof window !== 'undefined') {
        window.location.href = '/admin/questions/templates';
    }
    return null;
}

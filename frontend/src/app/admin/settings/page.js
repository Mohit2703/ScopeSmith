'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import adminApi from '@/lib/adminApi';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        ai_questions_enabled: true,
        voice_input_enabled: false,
        report_regeneration_enabled: true,
        primary_color: '#4f46e5',
        accent_color: '#10b981',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const systemInfo = {
        backendUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
        apiVersion: 'v1.0.0',
        environment: 'Development',
    };

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getSettings();
            setSettings({
                ai_questions_enabled: response.ai_questions_enabled,
                voice_input_enabled: response.voice_input_enabled,
                report_regeneration_enabled: response.report_regeneration_enabled,
                primary_color: response.primary_color || '#4f46e5',
                accent_color: response.accent_color || '#10b981',
            });
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const toggleFeature = (key) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await adminApi.updateSettings(settings);
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Configure system features and branding</p>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="h-6 skeleton rounded w-1/3 mb-4" />
                                <div className="space-y-4">
                                    <div className="h-10 skeleton rounded" />
                                    <div className="h-10 skeleton rounded" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure system features and branding</p>
            </div>

            {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Feature Flags */}
            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Enable AI Questions</p>
                                <p className="text-sm text-muted-foreground">AI-generated follow-up questions for projects</p>
                            </div>
                            <button
                                onClick={() => toggleFeature('ai_questions_enabled')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.ai_questions_enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.ai_questions_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Enable Voice Input</p>
                                <p className="text-sm text-muted-foreground">Allow voice responses for questions</p>
                            </div>
                            <button
                                onClick={() => toggleFeature('voice_input_enabled')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.voice_input_enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.voice_input_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="p-4 flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Allow Report Regeneration</p>
                                <p className="text-sm text-muted-foreground">Let users regenerate reports after initial generation</p>
                            </div>
                            <button
                                onClick={() => toggleFeature('report_regeneration_enabled')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.report_regeneration_enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.report_regeneration_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Branding */}
            <Card>
                <CardHeader>
                    <CardTitle>Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Primary Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.primary_color}
                                    onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <Input
                                    value={settings.primary_color}
                                    onChange={(e) => setSettings(prev => ({ ...prev, primary_color: e.target.value }))}
                                    className="w-28 font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-foreground">Accent Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={settings.accent_color}
                                    onChange={(e) => setSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <Input
                                    value={settings.accent_color}
                                    onChange={(e) => setSettings(prev => ({ ...prev, accent_color: e.target.value }))}
                                    className="w-28 font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* System Information */}
            <Card>
                <CardHeader>
                    <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border">
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Backend URL</span>
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{systemInfo.backendUrl}</code>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">API Version</span>
                            <span className="text-sm font-medium text-foreground">{systemInfo.apiVersion}</span>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Environment</span>
                            <span className="text-sm font-medium text-admin-accent-green">{systemInfo.environment}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}

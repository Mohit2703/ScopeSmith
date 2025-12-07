'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, SlidePanel, FormField } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import adminApi from '@/lib/adminApi';

export default function ProjectTypesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedProjectType, setSelectedProjectType] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', icon: '📁', enabled: true });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProjectTypes = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getProjectTypes();
            setProjectTypes(response.results || []);
        } catch (err) {
            console.error('Failed to fetch project types:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectTypes();
    }, []);

    const handleEdit = (projectType) => {
        setSelectedProjectType(projectType);
        setFormData({
            name: projectType.name,
            description: projectType.description || '',
            icon: projectType.icon || '📁',
            enabled: projectType.enabled
        });
        setError('');
        setIsPanelOpen(true);
    };

    const handleAdd = () => {
        setSelectedProjectType(null);
        setFormData({ name: '', description: '', icon: '📁', enabled: true });
        setError('');
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedProjectType(null);
        setError('');
    };

    const handleToggleEnabled = async (projectType) => {
        try {
            await adminApi.toggleProjectType(projectType.id);
            fetchProjectTypes();
        } catch (err) {
            console.error('Failed to toggle project type:', err);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            if (selectedProjectType) {
                await adminApi.updateProjectType(selectedProjectType.id, formData);
            } else {
                await adminApi.createProjectType(formData);
            }
            handleClosePanel();
            fetchProjectTypes();
        } catch (err) {
            setError(err.message || 'Failed to save project type');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedProjectType) return;
        if (!confirm('Are you sure you want to delete this project type? This may affect existing projects.')) return;
        try {
            await adminApi.deleteProjectType(selectedProjectType.id);
            handleClosePanel();
            fetchProjectTypes();
        } catch (err) {
            setError(err.message || 'Failed to delete project type');
        }
    };

    const columns = [
        {
            header: 'Project Type',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{row.icon || '📁'}</span>
                    <div>
                        <p className="font-medium text-foreground">{row.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{row.description || 'No description'}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Questions',
            render: (row) => (
                <span className="text-sm text-muted-foreground">{row.question_count || 0}</span>
            ),
        },
        {
            header: 'Projects',
            render: (row) => (
                <span className="text-sm text-muted-foreground">{row.project_count || 0}</span>
            ),
        },
        {
            header: 'Status',
            render: (row) => (
                <button
                    onClick={() => handleToggleEnabled(row)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${row.enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${row.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
            ),
        },
        {
            header: 'Created',
            render: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Project Types</h1>
                    <p className="text-muted-foreground mt-1">Manage project categories and their question templates</p>
                </div>
                <Button onClick={handleAdd}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Project Type
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={projectTypes}
                isLoading={isLoading}
                actions={(row) => (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Button>
                )}
                emptyMessage="No project types found"
            />

            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title={selectedProjectType ? 'Edit Project Type' : 'Add Project Type'}
                description={selectedProjectType ? `Editing ${selectedProjectType.name}` : 'Create a new project type'}
                footer={
                    <div className="flex justify-between">
                        {selectedProjectType && (
                            <Button variant="destructive" className="mr-auto" onClick={handleDelete}>
                                Delete
                            </Button>
                        )}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleClosePanel}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : (selectedProjectType ? 'Save Changes' : 'Add Project Type')}
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    <FormField label="Name" required>
                        <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., Enterprise, SMB, Startup"
                        />
                    </FormField>
                    <FormField label="Icon">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">{formData.icon}</span>
                            <Input
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                placeholder="📁"
                                className="w-20"
                            />
                        </div>
                    </FormField>
                    <FormField label="Description">
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of this project type..."
                            rows={3}
                        />
                    </FormField>
                    <FormField label="Status">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, enabled: !formData.enabled })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className="text-sm text-muted-foreground">
                                {formData.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </FormField>
                </div>
            </SlidePanel>
        </div>
    );
}

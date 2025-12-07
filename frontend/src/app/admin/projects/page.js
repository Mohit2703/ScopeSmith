'use client';

import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import adminApi from '@/lib/adminApi';

const statusConfig = {
    proposed: { label: 'Proposed', variant: 'warning' },
    called: { label: 'Called', variant: 'info' },
    converted: { label: 'Converted', variant: 'success' },
    trash: { label: 'Trash', variant: 'destructive' },
};

export default function ProjectsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [reportFilter, setReportFilter] = useState('all');

    const fetchProjectTypes = async () => {
        try {
            const response = await adminApi.getProjectTypes();
            setProjectTypes(response.results || []);
        } catch (err) {
            console.error('Failed to fetch project types:', err);
        }
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (typeFilter !== 'all') params.project_type = typeFilter;
            if (reportFilter !== 'all') params.has_report = reportFilter === 'has' ? 'true' : 'false';
            const response = await adminApi.getProjects(params);
            setProjects(response.results || []);
        } catch (err) {
            console.error('Failed to fetch projects:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [statusFilter, typeFilter, reportFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchProjects();
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleGenerateReport = async (projectId) => {
        try {
            await adminApi.regenerateReport(projectId);
            fetchProjects();
        } catch (err) {
            console.error('Failed to generate report:', err);
            alert(err.message || 'Failed to generate report');
        }
    };

    const columns = [
        {
            header: 'Project',
            render: (row) => (
                <div>
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-sm text-muted-foreground">{row.project_type?.name || 'Unknown'}</p>
                </div>
            ),
        },
        {
            header: 'Client',
            render: (row) => (
                <div>
                    <p className="font-medium text-foreground">{row.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{row.user?.email || ''}</p>
                </div>
            ),
        },
        {
            header: 'Status',
            render: (row) => {
                const config = statusConfig[row.status] || { label: row.status, variant: 'default' };
                return <Badge variant={config.variant}>{config.label}</Badge>;
            },
        },
        {
            header: 'Report',
            render: (row) => (
                row.has_report ? (
                    <div className="flex items-center gap-1.5 text-admin-accent-green">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Ready</span>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )
            ),
        },
        {
            header: 'Last Updated',
            render: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Projects</h1>
                    <p className="text-muted-foreground mt-1">View and manage all projects across clients</p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={projects}
                isLoading={isLoading}
                headerActions={
                    <>
                        <Input
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-56"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="proposed">Proposed</option>
                            <option value="called">Called</option>
                            <option value="converted">Converted</option>
                            <option value="trash">Trash</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Types</option>
                            {projectTypes.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                        </select>
                        <select
                            value={reportFilter}
                            onChange={(e) => setReportFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Reports</option>
                            <option value="has">Has Report</option>
                            <option value="none">No Report</option>
                        </select>
                    </>
                }
                actions={(row) => (
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" title="View Project">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </Button>
                        {row.has_report ? (
                            <Button variant="ghost" size="sm" title="View Report">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </Button>
                        ) : (
                            <Button variant="ghost" size="sm" title="Generate Report" onClick={() => handleGenerateReport(row.id)}>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                            </Button>
                        )}
                    </div>
                )}
                pagination={{
                    from: 1,
                    to: projects.length,
                    total: projects.length,
                    onPrevious: () => { },
                    onNext: () => { },
                }}
                emptyMessage="No projects found"
            />
        </div>
    );
}

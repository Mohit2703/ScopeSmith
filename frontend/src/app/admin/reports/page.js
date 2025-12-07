'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, StatCard, SlidePanel } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import ReportViewer from '@/components/ReportViewer';
import adminApi from '@/lib/adminApi';

export default function ReportsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [regenerating, setRegenerating] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            const response = await adminApi.getReports(params);
            let results = response.results || [];

            // Client-side status filter
            if (statusFilter !== 'all') {
                results = results.filter(r => r.status === statusFilter);
            }

            setReports(results);
        } catch (err) {
            console.error('Failed to fetch reports:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [statusFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchReports();
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleRegenerate = async (projectId) => {
        setRegenerating(projectId);
        try {
            await adminApi.regenerateReport(projectId);
            fetchReports();
        } catch (err) {
            console.error('Failed to regenerate report:', err);
            alert(err.message || 'Failed to regenerate report');
        } finally {
            setRegenerating(null);
        }
    };

    const handleDelete = async (reportId) => {
        if (!confirm('Are you sure you want to delete this report?')) return;
        try {
            await adminApi.deleteReport(reportId);
            fetchReports();
        } catch (err) {
            console.error('Failed to delete report:', err);
        }
    };

    const handleView = (report) => {
        setSelectedReport(report);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedReport(null);
    };

    const readyReports = reports.filter(r => r.status === 'ready').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;

    const columns = [
        {
            header: 'Project',
            render: (row) => (
                <div>
                    <p className="font-medium text-foreground">{row.project?.name || 'Unknown'}</p>
                    <p className="text-sm text-muted-foreground">{row.project?.user?.name || 'Unknown'}</p>
                </div>
            ),
        },
        {
            header: 'Client Email',
            render: (row) => (
                <span className="text-sm text-muted-foreground">{row.project?.user?.email || 'N/A'}</span>
            ),
        },
        {
            header: 'Status',
            render: (row) => (
                <Badge variant={row.status === 'ready' ? 'success' : 'warning'}>
                    {row.status === 'ready' ? 'Ready' : 'Pending'}
                </Badge>
            ),
        },
        {
            header: 'Format',
            render: (row) => (
                row.format ? (
                    <span className="text-sm text-foreground">{row.format}</span>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )
            ),
        },
        {
            header: 'Generated',
            render: (row) => (
                row.created_at ? (
                    <span className="text-sm text-muted-foreground">
                        {new Date(row.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                )
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Reports</h1>
                <p className="text-muted-foreground mt-1">View, search, and manage generated project reports</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    title="Total Reports"
                    value={reports.length}
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    }
                    iconColor="primary"
                />
                <StatCard
                    title="Ready"
                    value={readyReports}
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconColor="green"
                />
                <StatCard
                    title="Pending"
                    value={pendingReports}
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconColor="amber"
                />
            </div>

            <DataTable
                columns={columns}
                data={reports}
                isLoading={isLoading}
                headerActions={
                    <>
                        <Input
                            placeholder="Search by project or client..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-72"
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="ready">Ready</option>
                            <option value="pending">Pending</option>
                        </select>
                    </>
                }
                actions={(row) => (
                    <div className="flex items-center gap-1">
                        {row.status === 'ready' ? (
                            <>
                                <Button variant="ghost" size="sm" title="View Report" onClick={() => handleView(row)}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Regenerate"
                                    onClick={() => handleRegenerate(row.project?.id)}
                                    disabled={regenerating === row.project?.id}
                                >
                                    <svg className={`w-4 h-4 ${regenerating === row.project?.id ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Delete"
                                    onClick={() => handleDelete(row.id)}
                                >
                                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleRegenerate(row.project?.id)}
                                disabled={regenerating === row.project?.id}
                            >
                                {regenerating === row.project?.id ? 'Generating...' : 'Generate'}
                            </Button>
                        )}
                    </div>
                )}
                emptyMessage="No reports found"
            />

            {/* View Report Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title="Report Details"
                description={selectedReport ? selectedReport.project?.name : ''}
                size="lg"
            >
                {selectedReport && (
                    <div className="space-y-6">
                        {/* Report Meta */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Project</label>
                                <p className="text-foreground font-medium">{selectedReport.project?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Client</label>
                                <p className="text-foreground">{selectedReport.project?.user?.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedReport.project?.user?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <Badge variant={selectedReport.status === 'ready' ? 'success' : 'warning'}>
                                    {selectedReport.status === 'ready' ? 'Ready' : 'Pending'}
                                </Badge>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Generated</label>
                                <p className="text-foreground text-sm">
                                    {new Date(selectedReport.created_at).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Report Content */}
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Report Content</label>
                            <div className="p-4 bg-background border border-border rounded-lg max-h-[60vh] overflow-y-auto">
                                <ReportViewer htmlContent={selectedReport.report} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedReport.report || '');
                                    alert('Report copied to clipboard');
                                }}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                </svg>
                                Copy to Clipboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleRegenerate(selectedReport.project?.id)}
                                disabled={regenerating === selectedReport.project?.id}
                            >
                                <svg className={`w-4 h-4 mr-2 ${regenerating === selectedReport.project?.id ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                                {regenerating === selectedReport.project?.id ? 'Regenerating...' : 'Regenerate'}
                            </Button>
                        </div>
                    </div>
                )}
            </SlidePanel>
        </div>
    );
}

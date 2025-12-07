'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, StatCard, SlidePanel } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import adminApi from '@/lib/adminApi';

export default function AIMonitorPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [aiQuestions, setAIQuestions] = useState([]);
    const [projects, setProjects] = useState([]);
    const [projectFilter, setProjectFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, projectsRes] = await Promise.all([
                adminApi.getDashboardStats(),
                adminApi.getProjects()
            ]);
            setStats(statsRes);
            setProjects(projectsRes.results || []);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAIQuestions = async () => {
        try {
            const params = {};
            if (projectFilter !== 'all') params.project = projectFilter;
            if (statusFilter !== 'all') params.answered = statusFilter === 'answered' ? 'true' : 'false';
            const response = await adminApi.getAIQuestions(params);
            setAIQuestions(response.results || []);
        } catch (err) {
            console.error('Failed to fetch AI questions:', err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchAIQuestions();
    }, [projectFilter, statusFilter]);

    const handleView = (question) => {
        setSelectedQuestion(question);
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedQuestion(null);
    };

    const pendingCount = aiQuestions.filter(q => q.status === 'pending').length;
    const answeredCount = aiQuestions.filter(q => q.status === 'answered').length;

    const columns = [
        {
            header: 'Question',
            render: (row) => (
                <div className="max-w-md">
                    <p className="font-medium text-foreground line-clamp-2">{row.text}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {row.description ? row.description.substring(0, 80) + '...' : 'No description'}
                    </p>
                </div>
            ),
        },
        {
            header: 'Project',
            render: (row) => (
                <span className="text-sm text-primary font-medium">{row.project_name || 'Unknown'}</span>
            ),
        },
        {
            header: 'Order',
            render: (row) => (
                <span className="text-sm text-muted-foreground">#{row.question_no}</span>
            ),
        },
        {
            header: 'Status',
            render: (row) => (
                <Badge variant={row.status === 'answered' ? 'success' : 'warning'}>
                    {row.status === 'answered' ? 'Answered' : 'Pending'}
                </Badge>
            ),
        },
        {
            header: 'Created',
            render: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                    })}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">AI Questions Monitor</h1>
                <p className="text-muted-foreground mt-1">View and manage AI-generated questions across all projects</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total AI Questions"
                    value={stats?.total_ai_questions || 0}
                    changeLabel="all time"
                    trend="neutral"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                        </svg>
                    }
                    iconColor="blue"
                />
                <StatCard
                    title="Pending"
                    value={pendingCount}
                    changeLabel="awaiting answers"
                    trend="neutral"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconColor="amber"
                />
                <StatCard
                    title="Answered"
                    value={answeredCount}
                    changeLabel="completed"
                    trend="neutral"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconColor="green"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.active_projects || 0}
                    changeLabel="with AI questions"
                    trend="neutral"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    }
                    iconColor="primary"
                />
            </div>

            {/* AI Questions Table */}
            <DataTable
                columns={columns}
                data={aiQuestions}
                isLoading={isLoading}
                headerActions={
                    <>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Projects</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="answered">Answered</option>
                        </select>
                    </>
                }
                actions={(row) => (
                    <Button variant="ghost" size="sm" onClick={() => handleView(row)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Button>
                )}
                emptyMessage="No AI questions found"
            />

            {/* View Question Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title="AI Question Details"
                description={selectedQuestion ? `Question #${selectedQuestion.question_no}` : ''}
            >
                {selectedQuestion && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Project</label>
                            <p className="text-foreground font-medium">{selectedQuestion.project_name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Question</label>
                            <p className="text-foreground">{selectedQuestion.text}</p>
                        </div>
                        {selectedQuestion.description && (
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                                <p className="text-foreground text-sm">{selectedQuestion.description}</p>
                            </div>
                        )}
                        <div className="flex gap-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                <Badge variant={selectedQuestion.status === 'answered' ? 'success' : 'warning'}>
                                    {selectedQuestion.status === 'answered' ? 'Answered' : 'Pending'}
                                </Badge>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Answers</label>
                                <span className="text-foreground">{selectedQuestion.answer_count || 0}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Created</label>
                            <p className="text-foreground text-sm">
                                {new Date(selectedQuestion.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </SlidePanel>
        </div>
    );
}

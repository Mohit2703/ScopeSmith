'use client';

import React, { useState, useEffect } from 'react';
import { StatCard, ActivityFeed } from '@/components/admin';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import adminApi from '@/lib/adminApi';

export default function AdminOverviewPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const fetchDashboardStats = async () => {
        setIsLoading(true);
        try {
            const response = await adminApi.getDashboardStats();
            setStats(response);
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
                <p className="text-muted-foreground mt-1">Welcome to the admin dashboard</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Users"
                    value={stats?.total_users || 0}
                    change={`+${stats?.new_users_this_week || 0}`}
                    changeLabel="this week"
                    trend="up"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                    iconColor="blue"
                />
                <StatCard
                    title="Total Projects"
                    value={stats?.total_projects || 0}
                    change={`+${stats?.new_projects_this_week || 0}`}
                    changeLabel="this week"
                    trend="up"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>
                    }
                    iconColor="primary"
                />
                <StatCard
                    title="Reports Generated"
                    value={stats?.total_reports || 0}
                    change={`+${stats?.reports_this_week || 0}`}
                    changeLabel="this week"
                    trend="up"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    }
                    iconColor="green"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.active_projects || 0}
                    changeLabel="in progress"
                    trend="neutral"
                    isLoading={isLoading}
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                        </svg>
                    }
                    iconColor="amber"
                />
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Project Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats?.project_types_count || 0}</div>
                        <p className="text-sm text-muted-foreground mt-1">Active project types</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Question Templates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats?.questions_count || 0}</div>
                        <p className="text-sm text-muted-foreground mt-1">Active questions</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats?.total_ai_questions || 0}</div>
                        <p className="text-sm text-muted-foreground mt-1">Total AI-generated</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect } from 'react';
import { DataTable, SlidePanel, FormField } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import adminApi from '@/lib/adminApi';

export default function UsersPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', role: 'client', password: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (searchQuery) params.search = searchQuery;
            if (roleFilter !== 'all') params.role = roleFilter;
            const response = await adminApi.getUsers(params);
            setUsers(response.results || []);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchQuery]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role, password: '' });
        setError('');
        setIsPanelOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setFormData({ name: '', email: '', role: 'client', password: '' });
        setError('');
        setIsPanelOpen(true);
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedUser(null);
        setError('');
    };

    const handleToggleEnabled = async (user) => {
        try {
            await adminApi.toggleUser(user.id);
            fetchUsers();
        } catch (err) {
            console.error('Failed to toggle user:', err);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            if (selectedUser) {
                const updateData = { name: formData.name, email: formData.email, role: formData.role };
                if (formData.password) updateData.password = formData.password;
                await adminApi.updateUser(selectedUser.id, updateData);
            } else {
                if (!formData.password) {
                    setError('Password is required for new users');
                    setSaving(false);
                    return;
                }
                await adminApi.createUser(formData);
            }
            handleClosePanel();
            fetchUsers();
        } catch (err) {
            setError(err.message || 'Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminApi.deleteUser(selectedUser.id);
            handleClosePanel();
            fetchUsers();
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        }
    };

    const columns = [
        {
            header: 'User',
            render: (row) => (
                <div>
                    <p className="font-medium text-foreground">{row.name}</p>
                    <p className="text-sm text-muted-foreground">{row.email}</p>
                </div>
            ),
        },
        {
            header: 'Role',
            render: (row) => (
                <Badge variant={row.role === 'admin' ? 'primary' : 'default'}>
                    {row.role}
                </Badge>
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
            header: 'Joined',
            render: (row) => (
                <span className="text-sm text-muted-foreground">
                    {new Date(row.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Users</h1>
                    <p className="text-muted-foreground mt-1">Manage system users and their access</p>
                </div>
                <Button onClick={handleAdd}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add User
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                headerActions={
                    <>
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-56"
                        />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="client">Client</option>
                        </select>
                    </>
                }
                actions={(row) => (
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </Button>
                )}
                emptyMessage="No users found"
            />

            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title={selectedUser ? 'Edit User' : 'Add User'}
                description={selectedUser ? `Editing ${selectedUser.name}` : 'Create a new user'}
                footer={
                    <div className="flex justify-between">
                        {selectedUser && (
                            <Button variant="destructive" className="mr-auto" onClick={handleDelete}>
                                Delete User
                            </Button>
                        )}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleClosePanel}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : (selectedUser ? 'Save Changes' : 'Add User')}
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
                            placeholder="Enter user name"
                        />
                    </FormField>
                    <FormField label="Email" required>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Enter email address"
                        />
                    </FormField>
                    <FormField label="Role" required>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                        </select>
                    </FormField>
                    <FormField label={selectedUser ? "New Password (leave blank to keep)" : "Password"} required={!selectedUser}>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder={selectedUser ? "Enter new password" : "Enter password"}
                        />
                    </FormField>
                </div>
            </SlidePanel>
        </div>
    );
}

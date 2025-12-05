import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function ProjectCard({ project, onDelete }) {
    // Assuming project structure: { id, name, description, status, created_at }
    // Status might be 'completed', 'in_progress', etc.

    const statusVariant = {
        completed: 'success',
        in_progress: 'default',
        pending: 'warning',
    }[project.status] || 'default';

    return (
        <Card className="flex flex-col justify-between transition-shadow hover:shadow-md">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1 text-lg">{project.name}</CardTitle>
                    <Badge variant={statusVariant}>{project.status?.replace('_', ' ') || 'Unknown'}</Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                    {project.description || 'No description provided.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                </p>
            </CardContent>
            <CardFooter className="gap-2">
                <Link href={`/projects/${project.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        Open
                    </Button>
                </Link>
                {project.status === 'completed' && (
                    <Link href={`/projects/${project.id}/report`} className="w-full">
                        <Button variant="secondary" className="w-full">
                            Report
                        </Button>
                    </Link>
                )}
            </CardFooter>
        </Card>
    );
}

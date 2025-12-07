'use client';

import React, { useState, useEffect } from 'react';
import { SlidePanel, FormField } from '@/components/admin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import adminApi from '@/lib/adminApi';

export default function QuestionTemplatesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [selectedProjectType, setSelectedProjectType] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [formData, setFormData] = useState({ text: '', description: '', question_type: 'text', question_no: 1, project_type_id: null, enabled: true });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchProjectTypes = async () => {
        try {
            const response = await adminApi.getProjectTypes({ enabled: 'true' });
            setProjectTypes(response.results || []);
            if (response.results?.length > 0 && !selectedProjectType) {
                setSelectedProjectType(response.results[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch project types:', err);
        }
    };

    const fetchQuestions = async () => {
        if (!selectedProjectType) return;
        setIsLoading(true);
        try {
            const response = await adminApi.getQuestions({ project_type: selectedProjectType });
            setQuestions(response.results || []);
        } catch (err) {
            console.error('Failed to fetch questions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectTypes();
    }, []);

    useEffect(() => {
        if (selectedProjectType) {
            fetchQuestions();
        }
    }, [selectedProjectType]);

    const handleEdit = (question) => {
        setSelectedQuestion(question);
        setFormData({
            text: question.text,
            description: question.description || '',
            question_type: question.question_type,
            question_no: question.question_no,
            project_type_id: question.project_type?.id || selectedProjectType,
            enabled: question.enabled
        });
        setError('');
        setIsPanelOpen(true);
    };

    const handleAdd = () => {
        setSelectedQuestion(null);
        setFormData({
            text: '',
            description: '',
            question_type: 'text',
            question_no: questions.length + 1,
            project_type_id: selectedProjectType,
            enabled: true
        });
        setError('');
        setIsPanelOpen(true);
    };

    const handleToggleEnabled = async (question) => {
        try {
            await adminApi.toggleQuestion(question.id);
            fetchQuestions();
        } catch (err) {
            console.error('Failed to toggle question:', err);
        }
    };

    const handleClosePanel = () => {
        setIsPanelOpen(false);
        setSelectedQuestion(null);
        setError('');
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            if (selectedQuestion) {
                await adminApi.updateQuestion(selectedQuestion.id, formData);
            } else {
                await adminApi.createQuestion(formData);
            }
            handleClosePanel();
            fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to save question');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedQuestion) return;
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await adminApi.deleteQuestion(selectedQuestion.id);
            handleClosePanel();
            fetchQuestions();
        } catch (err) {
            setError(err.message || 'Failed to delete question');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Question Templates</h1>
                    <p className="text-muted-foreground mt-1">Manage predefined questions for each project type</p>
                </div>
                <Button onClick={handleAdd} disabled={!selectedProjectType}>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Question
                </Button>
            </div>

            {/* Project Type Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground">Project Type:</span>
                        <div className="flex gap-2">
                            {projectTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedProjectType(type.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProjectType === type.id
                                        ? 'bg-primary text-white'
                                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                >
                                    {type.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="p-4 flex items-center gap-4">
                                    <div className="w-8 h-8 skeleton rounded" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-4 skeleton rounded w-1/2" />
                                    </div>
                                    <div className="w-16 h-6 skeleton rounded" />
                                    <div className="w-10 h-6 skeleton rounded" />
                                </div>
                            ))}
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            No questions found for this project type
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {questions.map((question) => (
                                <div
                                    key={question.id}
                                    className={`p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors ${!question.enabled ? 'opacity-50' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                                        {question.question_no}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground">{question.text}</p>
                                        <p className="text-sm text-muted-foreground truncate">{question.description}</p>
                                    </div>
                                    <Badge variant={question.question_type === 'text' ? 'primary' : 'default'}>
                                        {question.question_type}
                                    </Badge>
                                    <button
                                        onClick={() => handleToggleEnabled(question)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${question.enabled ? 'bg-admin-accent-green' : 'bg-muted'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${question.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(question)}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Panel */}
            <SlidePanel
                isOpen={isPanelOpen}
                onClose={handleClosePanel}
                title={selectedQuestion ? 'Edit Question' : 'Add Question'}
                description={selectedQuestion ? `Editing question #${selectedQuestion.question_no}` : 'Create a new question template'}
                footer={
                    <div className="flex justify-between">
                        {selectedQuestion && (
                            <Button variant="destructive" className="mr-auto" onClick={handleDelete}>
                                Delete Question
                            </Button>
                        )}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleClosePanel}>Cancel</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : (selectedQuestion ? 'Save Changes' : 'Add Question')}
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
                    <FormField label="Question Text" required>
                        <Textarea
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                            placeholder="Enter the question text..."
                            rows={3}
                        />
                    </FormField>
                    <FormField label="Help Text / Description">
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Additional context or instructions..."
                            rows={2}
                        />
                    </FormField>
                    <FormField label="Question Type" required>
                        <select
                            value={formData.question_type}
                            onChange={(e) => setFormData({ ...formData, question_type: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="text">Text</option>
                            <option value="mcq">Multiple Choice</option>
                            <option value="mic">Voice Input</option>
                        </select>
                    </FormField>
                    <FormField label="Order">
                        <Input
                            type="number"
                            value={formData.question_no}
                            onChange={(e) => setFormData({ ...formData, question_no: parseInt(e.target.value) || 1 })}
                            min={1}
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

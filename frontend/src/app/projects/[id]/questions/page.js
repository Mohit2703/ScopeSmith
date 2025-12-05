'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function QuestionAnsweringPage() {
  const { id } = useParams();
  const projectId = Number(id);
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);

  // Load next question on mount
  useEffect(() => {
    loadNextQuestion();
  }, [projectId]);

  const loadNextQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth_token');
      
      const response = await api.get(
        `/projects/get_next_question/${projectId}/`,
        {},
        token
      );

      if (response.detail === "All questions have been answered.") {
        // All questions answered - redirect to project dashboard
        router.push(`/projects/${projectId}`);
        return;
      }

      setCurrentQuestion(response.data);
      setAnswer('');
    } catch (err) {
      console.error(err);
      setError(err?.detail || 'Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('auth_token');

      const payload = {
        question_id: currentQuestion.id,
        project_id: projectId,
        text: answer.trim(),
        question_type: currentQuestion.question_type || 'predefined'
      };

      const response = await api.post(
        '/projects/answer_question/',
        payload,
        token
      );

      // Check if there's a next question
      if (response.next_question) {
        setCurrentQuestion(response.next_question);
        setAnswer('');
        setQuestionNumber(prev => prev + 1);
      } else {
        // No more questions - redirect to project dashboard
        router.push(`/projects/${projectId}`);
      }
    } catch (err) {
      console.error(err);
      setError(err?.detail || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    // For now, just load next question
    // You can implement skip logic on backend if needed
    await loadNextQuestion();
    setQuestionNumber(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading next question...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No more questions available.</p>
          <button
            onClick={() => router.push(`/projects/${projectId}`)}
            className="mt-4 text-indigo-600 hover:underline"
          >
            Back to Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {questionNumber}
            </span>
            <span className="text-xs text-gray-500">
              {currentQuestion.question_type === 'ai' ? '🤖 AI Generated' : '📋 Standard'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(questionNumber * 10, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {currentQuestion.text}
          </h2>
          
          {currentQuestion.description && (
            <p className="text-gray-600 text-sm mb-4">
              {currentQuestion.description}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                id="answer"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitting}
              />
              <p className="mt-2 text-sm text-gray-500">
                {answer.length} characters
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit & Continue'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push(`/projects/${projectId}`)}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Save & Exit
              </button>
            </div>
          </form>
        </div>

        {/* Helper Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Tips for better answers:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be as specific and detailed as possible</li>
            <li>• Include examples if applicable</li>
            <li>• Mention any technical preferences or constraints</li>
            <li>• You can always come back and refine your answers later</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
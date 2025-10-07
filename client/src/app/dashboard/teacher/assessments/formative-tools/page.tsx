'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Eye, Loader2 } from 'lucide-react';

interface MCQOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  options: MCQOption[];
}

export default function FormativeToolsPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      questionText: '',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false },
        { id: 3, text: '', isCorrect: false },
        { id: 4, text: '', isCorrect: false },
      ],
    },
  ]);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        questionText: '',
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false },
          { id: 3, text: '', isCorrect: false },
          { id: 4, text: '', isCorrect: false },
        ],
      },
    ]);
  }

  function removeQuestion(questionId: number) {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
  }

  function updateQuestionText(questionId: number, text: string) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, questionText: text } : q))
    );
  }

  function updateOptionText(questionId: number, optionId: number, text: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, text } : o
              ),
            }
          : q
      )
    );
  }

  function toggleCorrectOption(questionId: number, optionId: number) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                isCorrect: o.id === optionId,
              })),
            }
          : q
      )
    );
  }

  function validateQuiz(): boolean {
    if (questions.length === 0) {
      setError('Add at least one question.');
      return false;
    }
    for (const q of questions) {
      if (!q.questionText.trim()) {
        setError(`Question ${q.id} text cannot be empty.`);
        return false;
      }
      const hasCorrect = q.options.some((o) => o.isCorrect);
      if (!hasCorrect) {
        setError(`Question ${q.id} must have one correct option.`);
        return false;
      }
      for (const o of q.options) {
        if (!o.text.trim()) {
          setError(`Option ${o.id} in Question ${q.id} cannot be empty.`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  }

  async function saveQuiz() {
    if (!validateQuiz()) {
      return;
    }
    setSaving(true);
    // Placeholder for saving, replace with real API call later
    setTimeout(() => {
      setSaving(false);
      alert('Quiz saved successfully (MVP)');
    }, 1500);
  }

  if (preview) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 max-w-4xl mx-auto">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Quiz Preview</h1>
          <Button variant="outline" onClick={() => setPreview(false)}>
            Back to Edit
          </Button>
        </header>
        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <p className="font-semibold text-lg">
                Q{q.id}. {q.questionText}
              </p>
              <ul className="list-disc pl-6 space-y-2">
                {q.options.map((o) => (
                  <li
                    key={o.id}
                    className={o.isCorrect ? 'text-green-600 font-semibold' : ''}
                  >
                    {o.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 max-w-4xl mx-auto">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quiz Creator</h1>
        <div className="space-x-2">
          <Button onClick={() => setPreview(true)} variant="outline">
            <Eye className="inline-block h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button onClick={saveQuiz} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="inline-block h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Quiz'
            )}
          </Button>
        </div>
      </header>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}

      <div className="space-y-8">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardHeader className="mb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Question {q.id}</CardTitle>
                {questions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(q.id)}
                    aria-label={`Remove Question ${q.id}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Input
                autoFocus
                placeholder="Enter question text"
                value={q.questionText}
                onChange={(e) =>
                  updateQuestionText(q.id, e.target.value)
                }
                className="mb-4"
              />
              <div className="space-y-3">
                {q.options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={option.isCorrect}
                      onChange={() => toggleCorrectOption(q.id, option.id)}
                    />
                    <Input
                      placeholder={`Option ${option.id} text`}
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(q.id, option.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addQuestion} variant="ghost" className="flex items-center space-x-2 w-full justify-center">
          <Plus />
          <span>Add Question</span>
        </Button>
      </div>
    </div>
  );
}

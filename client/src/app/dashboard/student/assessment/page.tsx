'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { AssessmentResult, QuestionResponse } from '@/types/api';
import {
  GraduationCap, ArrowRight, ArrowLeft,
  Loader2, CheckCircle, Star,
} from 'lucide-react';

// ── Holland Assessment Questions ──────────────────────
const QUESTIONS: { text: string; dimension: QuestionResponse['dimension'] }[] = [
  { text: 'I enjoy working with tools, machines, or my hands.', dimension: 'R' },
  { text: 'I like outdoor activities like farming, gardening, or hiking.', dimension: 'R' },
  { text: 'I prefer fixing broken things or building new ones.', dimension: 'R' },
  { text: 'I enjoy solving puzzles, riddles, and math problems.', dimension: 'I' },
  { text: 'I like reading science books or watching documentaries.', dimension: 'I' },
  { text: 'I am curious about how nature and the universe work.', dimension: 'I' },
  { text: 'I enjoy drawing, painting, singing, or playing music.', dimension: 'A' },
  { text: 'I like writing stories, poetry, or creating videos.', dimension: 'A' },
  { text: 'I appreciate beautiful designs and creative ideas.', dimension: 'A' },
  { text: 'I enjoy helping others learn or solve their problems.', dimension: 'S' },
  { text: 'I volunteer or participate in community service events.', dimension: 'S' },
  { text: 'I like working in groups and leading team activities.', dimension: 'S' },
  { text: 'I enjoy selling things or convincing others of my ideas.', dimension: 'E' },
  { text: 'I dream of starting my own business someday.', dimension: 'E' },
  { text: 'I like organizing events or managing projects.', dimension: 'E' },
  { text: 'I enjoy organizing files, data, and keeping records neat.', dimension: 'C' },
  { text: 'I follow rules carefully and like structured routines.', dimension: 'C' },
  { text: 'I am good at working with numbers and spreadsheets.', dimension: 'C' },
];

const SCORE_LABELS = ['', 'Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

const DIMENSION_COLORS: Record<string, string> = {
  R: 'bg-orange-500', I: 'bg-blue-500', A: 'bg-pink-500',
  S: 'bg-emerald-500', E: 'bg-amber-500', C: 'bg-indigo-500',
};

const DIMENSION_LABELS: Record<string, string> = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
};

export default function AssessmentPage() {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(0));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [error, setError] = useState('');
  const [started, setStarted] = useState(false);

  const progress = Math.round((answers.filter(a => a > 0).length / QUESTIONS.length) * 100);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = score;
    setAnswers(newAnswers);
    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 200);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    const responses: QuestionResponse[] = QUESTIONS.map((q, i) => ({
      dimension: q.dimension,
      score: answers[i],
    }));

    const response = await apiClient.submitAssessment({ responses });
    setIsSubmitting(false);

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setResult(response.data);
    }
  };

  const allAnswered = answers.every(a => a > 0);

  // ── Results View ──────────────────────────────────────
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} />
            <h1 className="text-2xl font-bold">Assessment Complete!</h1>
          </div>
          <p className="opacity-90">Your RIASEC code: <span className="font-mono font-bold text-lg">{result.riasecCode}</span></p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Top Dimensions</h2>
          <div className="space-y-4">
            {result.topDimensions.map((dim, i) => (
              <div key={dim.code} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl ${DIMENSION_COLORS[dim.code]} flex items-center justify-center text-white font-bold`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{dim.label}</p>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-1">
                    <div className={`${DIMENSION_COLORS[dim.code]} h-2.5 rounded-full`} style={{ width: `${(dim.score / 15) * 100}%` }} />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-500">{dim.score}/15</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Careers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.matchedCareers.map((career) => (
              <div key={career} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Star size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium text-blue-900">{career}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Start Screen ──────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Holland Career Assessment (RIASEC)</h1>
          <p className="text-gray-500 mb-6">
            Discover careers that match your personality. Answer 18 quick questions — takes about 5 minutes.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {Object.entries(DIMENSION_LABELS).map(([code, label]) => (
              <div key={code} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <div className={`w-3 h-3 rounded-full ${DIMENSION_COLORS[code]}`} />
                <span className="text-sm text-gray-600">{label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 mx-auto"
          >
            Start Assessment <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── Question View ──────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Career Assessment</h1>
        <span className="text-sm text-gray-500">
          {currentQuestion + 1} / {QUESTIONS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Question card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-3 h-3 rounded-full ${DIMENSION_COLORS[QUESTIONS[currentQuestion].dimension]}`} />
          <span className="text-xs text-gray-400 uppercase font-medium">
            {DIMENSION_LABELS[QUESTIONS[currentQuestion].dimension]}
          </span>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-8">
          {QUESTIONS[currentQuestion].text}
        </p>

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => handleAnswer(score)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                answers[currentQuestion] === score
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-100 hover:border-gray-200 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  answers[currentQuestion] === score ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === score && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm font-medium">{SCORE_LABELS[score]}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 transition-colors"
        >
          <ArrowLeft size={16} /> Previous
        </button>

        {currentQuestion === QUESTIONS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

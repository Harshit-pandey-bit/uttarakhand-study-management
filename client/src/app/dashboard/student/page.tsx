'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import { AssessmentResult, QuestionResponse } from '@/types/api';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap, Video, BookOpen, ArrowRight, ArrowLeft,
  Loader2, CheckCircle, ExternalLink, Clock, AlertCircle,
} from 'lucide-react';

// ── Holland Assessment Questions ──────────────────────
// 18 questions, 3 per dimension, covering rural-relevant scenarios
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

// ── Assessment Component ──────────────────────────────

function AssessmentSection() {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(0));
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswer = (score: number) => {
    const updated = [...answers];
    updated[currentQ] = score;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const responses: QuestionResponse[] = QUESTIONS.map((q, i) => ({
      dimension: q.dimension,
      score: answers[i],
    }));

    const res = await apiClient.submitAssessment({ responses });
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      setResult(res.data);
      setStep('result');
    }
  };

  const allAnswered = answers.every(a => a > 0);

  if (step === 'intro') {
    return (
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="text-emerald-600" size={22} />
            Holland Career Assessment (RIASEC)
          </CardTitle>
          <CardDescription>
            Discover careers that match your personality. Answer 18 quick questions — takes about 5 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'].map((d, i) => (
              <div key={d} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <div className={`w-2.5 h-2.5 rounded-full ${Object.values(DIMENSION_COLORS)[i]}`} />
                {d}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setStep('quiz')} className="bg-emerald-600 hover:bg-emerald-700">
            Start Assessment <ArrowRight size={16} className="ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (step === 'result' && result) {
    return (
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-emerald-600" size={22} />
            Your RIASEC Code: <span className="text-emerald-600">{result.riasecCode}</span>
          </CardTitle>
          <CardDescription>Your top personality dimensions and matched careers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Score Bars */}
          <div className="space-y-3">
            {result.topDimensions.map((dim) => (
              <div key={dim.code} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{dim.label}</span>
                  <span className="text-gray-500">{dim.score} pts</span>
                </div>
                <Progress value={(dim.score / 15) * 100} className="h-2" />
              </div>
            ))}
          </div>

          {/* Matched Careers */}
          <div>
            <h4 className="font-semibold text-sm text-gray-700 mb-2">🎯 Matched Careers</h4>
            <div className="flex flex-wrap gap-2">
              {result.matchedCareers.map((career) => (
                <Badge key={career} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {career}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz step
  const q = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Question {currentQ + 1} of {QUESTIONS.length}</CardTitle>
          <Badge variant="outline" className="text-xs">{q.dimension} — {['','Realistic','Investigative','Artistic','Social','Enterprising','Conventional']['RIASEC'.indexOf(q.dimension) + 1]}</Badge>
        </div>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-800 font-medium">{q.text}</p>

        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => handleAnswer(score)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-xs ${
                answers[currentQ] === score
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <span className="text-lg font-bold">{score}</span>
              <span className="hidden md:block">{SCORE_LABELS[score]}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg">
            <AlertCircle size={16} /> {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
          <ArrowLeft size={16} className="mr-1" /> Previous
        </Button>

        {currentQ < QUESTIONS.length - 1 ? (
          <Button onClick={() => setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === 0}>
            Next <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!allAnswered || loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? <Loader2 size={16} className="mr-1 animate-spin" /> : <CheckCircle size={16} className="mr-1" />}
            {loading ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ── Mentoring Sessions Component ──────────────────────

function MentoringSection() {
  // In a real app this would fetch from GET /mentoring/sessions
  // For now, show a placeholder since we only have POST /mentoring/schedule
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="text-purple-600" size={22} />
          Upcoming Mentoring Sessions
        </CardTitle>
        <CardDescription>Your scheduled sessions with HEI mentors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Placeholder — will be populated when GET endpoint is added */}
          <div className="text-center py-8 text-gray-400">
            <Clock size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium">No upcoming sessions</p>
            <p className="text-xs text-gray-400 mt-1">Your mentor will schedule sessions for you.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Student Dashboard ────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name ?? 'Student';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 lg:p-8 text-white">
        <h1 className="text-2xl font-bold">Welcome, {name}! 👋</h1>
        <p className="text-blue-100 mt-1">
          Discover your career path, complete assignments, and connect with mentors.
        </p>
      </div>

      {/* Assessment */}
      <AssessmentSection />

      {/* Mentoring */}
      <MentoringSection />
    </div>
  );
}

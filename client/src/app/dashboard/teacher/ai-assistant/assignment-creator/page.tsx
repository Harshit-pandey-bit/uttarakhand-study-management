'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { teacherAPI } from '@/lib/teacher-client';
import {
  TeacherProfile,
  Question,
  TeacherAssignment,
  Assignment,
  CreateAssignmentRequest,
  SUBJECTS,
} from '@/types/teacher-types';
import {
  FileText,
  Loader2,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export default function AssignmentCreatorPage() {
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rubricCriteria, setRubricCriteria] = useState<
    Array<{ name: string; description: string; max_marks: number }>
  >([]);
  const [newCriterion, setNewCriterion] = useState({ name: '', description: '', max_marks: 0 });
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const profile = await teacherAPI.getTeacherProfile();
        setTeacherProfile(profile);
        if (profile.subjects.length > 0) setSelectedSubject(profile.subjects[0]);
        if (profile.classes.length > 0) setSelectedClass(profile.classes[0]);
      } catch (err) {
        console.error('Failed to fetch teacher profile', err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedClass) {
      fetchChapters();
    }
  }, [selectedSubject, selectedClass]);

  async function fetchChapters() {
    try {
      const chaptersData = await teacherAPI.getNCERTChapters(selectedSubject, selectedClass);
      setChapters(chaptersData.map((ch) => ch.chapter_title));
      setSelectedChapter('');
    } catch (err) {
      console.error('Failed to fetch chapters', err);
    }
  }

  useEffect(() => {
    if (selectedChapter) {
      fetchQuestions();
    } else {
      setQuestionBank([]);
    }
  }, [selectedChapter, difficulty]);

  async function fetchQuestions() {
    setLoadingQuestions(true);
    try {
      const questions = await teacherAPI.getQuestionBank(selectedSubject, selectedChapter, difficulty);
      setQuestionBank(questions);
    } catch (err) {
      console.error('Failed to fetch questions', err);
    } finally {
      setLoadingQuestions(false);
    }
  }

  function toggleQuestionSelection(question: Question) {
    const exists = selectedQuestions.find((q) => q.id === question.id);
    if (exists) {
      setSelectedQuestions(selectedQuestions.filter((q) => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  }

  function addRubricCriterion() {
    if (!newCriterion.name || newCriterion.max_marks <= 0) return;
    setRubricCriteria([...rubricCriteria, newCriterion]);
    setNewCriterion({ name: '', description: '', max_marks: 0 });
  }

  const totalMarks = useMemo(() => {
    return selectedQuestions.reduce((acc, q) => acc + q.marks, 0);
  }, [selectedQuestions]);

  async function handleCreateAssignment() {
    if (!assignmentTitle || !selectedSubject || !selectedClass || selectedQuestions.length === 0) {
      setError('Please fill in all mandatory fields and select at least one question.');
      return;
    }

    const assignmentRequest: CreateAssignmentRequest = {
      title: assignmentTitle,
      subject: selectedSubject,
      class_level: selectedClass,
      chapter: selectedChapter,
      description: instructions,
      question_ids: selectedQuestions.map((q) => q.id),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      instructions,
      rubric: rubricCriteria.length > 0 ? { criteria: rubricCriteria } : undefined,
    };

    setError(null);
    setCreating(true);
    try {
      const createdAssignment = await teacherAPI.createAssignment(assignmentRequest);
      // Reset form on success
      setAssignmentTitle('');
      setSelectedChapter('');
      setSelectedQuestions([]);
      setInstructions('');
      setRubricCriteria([]);
      alert(`Assignment "${createdAssignment.title}" created successfully!`);
    } catch (err) {
      console.error('Failed to create assignment:', err);
      setError('Failed to create assignment. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  if (!teacherProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertTriangle className="h-8 w-8 text-red-600" />
        <span className="ml-3 text-red-600">Loading teacher profile...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
            <FileText className="h-8 w-8 text-indigo-600" />
            <span>Assignment Creator</span>
          </h1>
          <p className="text-gray-600 mt-1 max-w-lg">
            Build curriculum-aligned assignments by choosing questions from NCERT chapters based on your subjects and classes.
          </p>
        </header>

        {/* Assignment Details */}
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subject */}
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
                disabled={teacherProfile.subjects.length <= 1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {teacherProfile.subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {SUBJECTS[subject as keyof typeof SUBJECTS]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class */}
            <div>
              <Label htmlFor="class">Class</Label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
                disabled={teacherProfile.classes.length <= 1}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherProfile.classes.map((classLevel) => (
                    <SelectItem key={classLevel} value={classLevel}>
                      Class {classLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chapter */}
            <div>
              <Label htmlFor="chapter">Chapter</Label>
              <Select
  value={selectedChapter}
  onValueChange={setSelectedChapter}
  disabled={!selectedSubject || !selectedClass}
>
  <SelectTrigger>
    <SelectValue placeholder="Select chapter" />
  </SelectTrigger>
  <SelectContent>
    {chapters.map((chapter) => (
      <SelectItem key={chapter} value={chapter}>
        {chapter}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

            </div>
          </div>

          {/* Difficulty */}
          <div className="max-w-xs">
            <Label htmlFor="difficulty">Question Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(val) => setDifficulty(val as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Question Bank & Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <CardTitle>Available Questions</CardTitle>
            {loadingQuestions ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading questions...</span>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {questionBank.length === 0 && <p className="text-gray-500 text-sm">No questions found</p>}
                {questionBank.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q)}
                    className={`cursor-pointer p-2 border rounded-md transition-colors ${
                      selectedQuestions.find((sel) => sel.id === q.id)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{q.question_text}</p>
                      <Badge className="ml-2" variant="outline">
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Marks: {q.marks}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Assignment Settings & Preview */}
          <Card className="p-6 space-y-6">
            <CardTitle>Assignment Details</CardTitle>
            <div className="space-y-4">
              <div>
                <Label htmlFor="assignment-title">Assignment Title</Label>
                <Input
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  placeholder="Enter assignment title"
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter instructions for students"
                />
              </div>

              <div>
                <Label>Selected Questions ({selectedQuestions.length}) - Total Marks: {totalMarks}</Label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                  {selectedQuestions.length === 0 && (
                    <p className="text-gray-500 text-sm">No questions selected</p>
                  )}
                  {selectedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex justify-between items-center bg-indigo-50 rounded px-3 py-1"
                    >
                      <span className="text-sm">{q.question_text}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setSelectedQuestions((prev) => prev.filter((item) => item.id !== q.id))
                        }
                        aria-label={`Remove question ${q.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rubric Creator */}
              <div className="space-y-2">
                <Label>Grading Rubric</Label>
                {rubricCriteria.length === 0 && (
                  <p className="text-gray-500 text-sm">No rubric criteria added</p>
                )}
                {rubricCriteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <div>
                      <p className="font-medium">{criterion.name}</p>
                      <p className="text-xs text-gray-600">{criterion.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Max {criterion.max_marks}
                    </Badge>
                  </div>
                ))}

                <div className="flex space-x-2 mt-2">
                  <Input
                    placeholder="Criterion name"
                    value={newCriterion.name}
                    onChange={(e) =>
                      setNewCriterion({ ...newCriterion, name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Max marks"
                    type="number"
                    min={1}
                    value={newCriterion.max_marks || ''}
                    onChange={(e) =>
                      setNewCriterion({
                        ...newCriterion,
                        max_marks: Number(e.target.value),
                      })
                    }
                    className="w-24"
                  />
                  <Input
                    placeholder="Description"
                    value={newCriterion.description}
                    onChange={(e) =>
                      setNewCriterion({ ...newCriterion, description: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Button onClick={addRubricCriterion} disabled={!newCriterion.name || newCriterion.max_marks <= 0}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Create Button & Error */}
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button onClick={handleCreateAssignment} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Assignment'
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

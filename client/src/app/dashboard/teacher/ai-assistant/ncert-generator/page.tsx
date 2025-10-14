'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  FileText,
  Download,
  Clock,
  Target,
  Lightbulb,
  Users,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import { teacherAPI } from '@/lib/teacher-client';
import {
  TeacherProfile,
  NCERTChapter,
  LessonPlanTemplate,
  LessonPlan,
  CreateLessonPlanRequest,
  SUBJECTS,
  CLASS_LEVELS
} from '@/types/teacher-types';

export default function NCERTGeneratorPage() {
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [chapters, setChapters] = useState<NCERTChapter[]>([]);
  const [templates, setTemplates] = useState<LessonPlanTemplate[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  
  // Form state
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<NCERTChapter | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [estimatedDuration, setEstimatedDuration] = useState<number>(50);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true);
        const [profile, templateData] = await Promise.all([
          teacherAPI.getTeacherProfile(),
          teacherAPI.getLessonPlanTemplates()
        ]);
        
        setTeacherProfile(profile);
        setTemplates(templateData);
        
        // Set default subject if teacher has subjects
        if (profile.subjects.length > 0) {
          setSelectedSubject(profile.subjects[0]);
        }
        
        // Set default class if teacher has classes
        if (profile.classes.length > 0) {
          setSelectedClass(profile.classes[0]);
        }
      } catch (error) {
        console.error('Failed to initialize page:', error);
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, []);

  useEffect(() => {
    if (selectedSubject && selectedClass) {
      fetchChapters();
    }
  }, [selectedSubject, selectedClass]);

  const fetchChapters = async () => {
    try {
      const chapterData = await teacherAPI.getNCERTChapters(selectedSubject, selectedClass);
      setChapters(chapterData);
      setSelectedChapter(null);
    } catch (error) {
      console.error('Failed to fetch chapters:', error);
    }
  };

  const handleCreateLessonPlan = async () => {
    if (!selectedChapter || !selectedTemplate || !lessonTitle || selectedObjectives.length === 0) {
      return;
    }

    const createData: CreateLessonPlanRequest = {
      subject: selectedSubject,
      class_level: selectedClass,
      chapter: selectedChapter.chapter_title,
      title: lessonTitle,
      objectives: selectedObjectives,
      template_type: selectedTemplate as any,
      estimated_duration: estimatedDuration
    };

    try {
      setCreating(true);
      const newPlan = await teacherAPI.createLessonPlan(createData);
      setLessonPlans([newPlan, ...lessonPlans]);
      
      // Reset form
      setLessonTitle('');
      setSelectedObjectives([]);
      setEstimatedDuration(50);
      setSelectedTemplate('');
      setSelectedChapter(null);
      
      // Show preview of created plan
      setSelectedPlan(newPlan);
      setShowPreview(true);
    } catch (error) {
      console.error('Failed to create lesson plan:', error);
    } finally {
      setCreating(false);
    }
  };

  const toggleObjective = (objective: string) => {
    setSelectedObjectives(prev => 
      prev.includes(objective) 
        ? prev.filter(obj => obj !== objective)
        : [...prev, objective]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading NCERT Generator...</span>
        </div>
      </div>
    );
  }

  if (!teacherProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-6 w-6" />
          <span>Failed to load teacher profile</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span>NCERT Lesson Planner</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Create curriculum-aligned lesson plans using NCERT chapters and proven teaching templates
            </p>
          </div>
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            {teacherProfile.subjects.length} Subjects • {teacherProfile.classes.length} Classes
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Lesson Plan Creator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <span>Create New Lesson Plan</span>
              </CardTitle>
              <CardDescription>
                Select NCERT chapter and teaching template to generate your lesson plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject and Class Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
                
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
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
              </div>

              {/* Chapter Selection */}
              {chapters.length > 0 && (
                <div className="space-y-2">
                  <Label>NCERT Chapter</Label>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedChapter?.id === chapter.id
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedChapter(chapter)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              Chapter {chapter.chapter_number}: {chapter.chapter_title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {chapter.learning_objectives.length} learning objectives
                              {chapter.estimated_duration && ` • ${chapter.estimated_duration} hours`}
                            </p>
                          </div>
                          {selectedChapter?.id === chapter.id && (
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              {selectedChapter && (
                <div className="space-y-2">
                  <Label>Learning Objectives</Label>
                  <div className="space-y-2">
                    {selectedChapter.learning_objectives.map((objective, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`objective-${index}`}
                          checked={selectedObjectives.includes(objective)}
                          onChange={() => toggleObjective(objective)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor={`objective-${index}`} className="text-sm text-gray-700">
                          {objective}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedObjectives.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {selectedObjectives.length} objectives selected
                    </p>
                  )}
                </div>
              )}

              {/* Template Selection */}
              {selectedChapter && selectedObjectives.length > 0 && (
                <div className="space-y-2">
                  <Label>Teaching Template</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {templates
                      .filter(template => 
                        template.subject_compatibility.includes(selectedSubject) ||
                        template.subject_compatibility.includes('all')
                      )
                      .map((template) => (
                        <div
                          key={template.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedTemplate === template.template_type
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedTemplate(template.template_type)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            {selectedTemplate === template.template_type && (
                              <CheckCircle className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{template.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {template.structure.slice(0, 3).map((phase) => (
                              <Badge key={phase} variant="secondary" className="text-xs">
                                {phase}
                              </Badge>
                            ))}
                            {template.structure.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.structure.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Lesson Details */}
              {selectedTemplate && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lesson-title">Lesson Title</Label>
                    <Input
                      id="lesson-title"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      placeholder="Enter lesson title..."
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                    <Select value={estimatedDuration.toString()} onValueChange={(value) => setEstimatedDuration(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="35">35 minutes</SelectItem>
                        <SelectItem value="50">50 minutes</SelectItem>
                        <SelectItem value="70">70 minutes (Double period)</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleCreateLessonPlan}
                    disabled={!lessonTitle || creating}
                    className="w-full"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Lesson Plan...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Lesson Plan
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Templates & Recent Plans */}
        <div className="space-y-6">
          {/* Template Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Teaching Templates</span>
              </CardTitle>
              <CardDescription>Proven pedagogical approaches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.slice(0, 4).map((template) => (
                  <div key={template.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {template.structure.length} phases
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {template.subject_compatibility.length} subjects
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Lesson Plans */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Recent Plans</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lessonPlans.length > 0 ? (
                <div className="space-y-3">
                  {lessonPlans.slice(0, 5).map((plan) => (
                    <div
                      key={plan.id}
                      className="p-3 border rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowPreview(true);
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 truncate">
                          {plan.title}
                        </h4>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-600">
                        {SUBJECTS[plan.subject as keyof typeof SUBJECTS]} • Class {plan.class_level}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {plan.template_type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(plan.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No lesson plans created yet</p>
                  <p className="text-xs text-gray-400">Create your first plan to see it here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>Planning Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Lesson Plans Created</span>
                  <span className="font-semibold text-gray-900">{lessonPlans.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subjects Covered</span>
                  <span className="font-semibold text-gray-900">{teacherProfile.subjects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Classes Assigned</span>
                  <span className="font-semibold text-gray-900">{teacherProfile.classes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Available Templates</span>
                  <span className="font-semibold text-gray-900">{templates.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Plan Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Lesson Plan Preview</span>
            </DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  {SUBJECTS[selectedPlan.subject as keyof typeof SUBJECTS]} • Class {selectedPlan.class_level} • {selectedPlan.chapter}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6">
              {/* Lesson Plan Header */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">{selectedPlan.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Subject:</span> {SUBJECTS[selectedPlan.subject as keyof typeof SUBJECTS]}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Class:</span> {selectedPlan.class_level}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Chapter:</span> {selectedPlan.chapter}
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Duration:</span> {selectedPlan.estimated_duration} minutes
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Learning Objectives
                </h4>
                <ul className="space-y-1">
                  {selectedPlan.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lesson Structure */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Lesson Structure ({selectedPlan.template_type})
                </h4>
                <div className="space-y-4">
                  {selectedPlan.content.sections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{section.name}</h5>
                        {section.duration && (
                          <Badge variant="outline" className="text-xs">
                            {section.duration} min
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-gray-600 mb-1">Activities:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {section.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                        {section.resources && (
                          <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">Resources:</p>
                            <div className="flex flex-wrap gap-1">
                              {section.resources.map((resource, resIndex) => (
                                <Badge key={resIndex} variant="secondary" className="text-xs">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {selectedPlan.resources && selectedPlan.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Required Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.resources.map((resource, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

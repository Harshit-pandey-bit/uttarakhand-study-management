'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen,
  Lightbulb,
  Copy, 
  Download, 
  Share, 
  RefreshCw, 
  Brain,
  Clock,
  Target,
  Users,
  Settings,
  History,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  PlayCircle,
  FileText,
  Calendar,
  Award,
  Activity
} from 'lucide-react';

// Lesson Planner Form Data Interface
interface LessonPlanForm {
  subject: string;
  class: string;
  topic: string;
  duration: string;
  objectives: string;
  priorKnowledge: string;
  learningStyle: string;
  assessmentType: string;
  resources: string;
}

// Recent Lesson Plans Data
const recentLessonPlans = [
  {
    id: 1,
    title: "Introduction to Acids and Bases",
    subject: "Chemistry",
    class: "9th A",
    createdAt: "1 day ago",
    duration: "45 minutes",
    activities: 4
  },
  {
    id: 2,
    title: "Photosynthesis Process",
    subject: "Biology",
    class: "10th B",
    createdAt: "3 days ago",
    duration: "60 minutes",
    activities: 5
  },
  {
    id: 3,
    title: "Quadratic Equations - Graphical Method",
    subject: "Mathematics",
    class: "10th A",
    createdAt: "5 days ago",
    duration: "50 minutes",
    activities: 3
  }
];

// Lesson Plan Templates
const lessonTemplates = [
  {
    id: 1,
    name: "5E Model",
    description: "Engage, Explore, Explain, Elaborate, Evaluate",
    duration: "45-60 minutes",
    bestFor: "Science concepts"
  },
  {
    id: 2,
    name: "Direct Instruction",
    description: "Teacher-led structured learning",
    duration: "30-45 minutes", 
    bestFor: "Skill building"
  },
  {
    id: 3,
    name: "Problem-Based Learning",
    description: "Real-world problem solving approach",
    duration: "60-90 minutes",
    bestFor: "Mathematics, Science"
  },
  {
    id: 4,
    name: "Flipped Classroom",
    description: "Pre-learning with in-class application",
    duration: "45-50 minutes",
    bestFor: "All subjects"
  }
];

// Lesson Planner Page Component
export default function LessonPlannerPage() {
  const [formData, setFormData] = useState<LessonPlanForm>({
    subject: '',
    class: '',
    topic: '',
    duration: '45',
    objectives: '',
    priorKnowledge: '',
    learningStyle: '',
    assessmentType: '',
    resources: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('custom');
  const [plannerStats] = useState({
    lessonsCreated: 8,
    timeSaved: 15,
    averageRating: 4.9
  });

  const handleGenerateLesson = async () => {
    setIsGenerating(true);
    
    // Simulate AI lesson plan generation
    setTimeout(() => {
      const generatedPlan = `
# Lesson Plan: ${formData.topic}

**Subject:** ${formData.subject} | **Class:** ${formData.class} | **Duration:** ${formData.duration} minutes

---

## Learning Objectives
By the end of this lesson, students will be able to:
- Understand the fundamental concepts of ${formData.topic}
- Identify real-world applications and examples
- Demonstrate understanding through practical activities
- Apply knowledge to solve related problems

## Prior Knowledge Required
${formData.priorKnowledge || '- Basic understanding of the subject fundamentals\n- Familiarity with related concepts from previous lessons'}

---

## Lesson Structure

### 1. Introduction & Hook (8 minutes)
**Opening Activity:** "Mystery Box Challenge"
- Show students everyday items related to the topic
- Ask: "What do these items have in common?"
- Create curiosity and connect to prior experiences

**Learning Objectives Sharing:**
- Clearly state what students will learn today
- Explain why this knowledge is important
- Connect to upcoming assessments and real-world applications

### 2. Main Content Delivery (${Math.round(parseInt(formData.duration) * 0.5)} minutes)

#### Part A: Core Concepts (${Math.round(parseInt(formData.duration) * 0.25)} minutes)
**Concept Introduction:**
- Define key terms with student-friendly language
- Use visual aids, diagrams, and real examples
- Interactive questioning to check understanding
- Connect to students' everyday experiences

**Guided Practice:**
- Work through examples together
- Think-aloud strategy for problem-solving
- Encourage student questions and discussions

#### Part B: Deep Dive & Applications (${Math.round(parseInt(formData.duration) * 0.25)} minutes)
**Real-World Connections:**
- Show how concepts apply in daily life
- Discuss career connections and future relevance
- Use multimedia resources (videos, simulations)

**Interactive Demonstration:**
- Hands-on experiment or activity
- Students observe and record findings
- Connect observations to theoretical concepts

### 3. Student Activity & Practice (${Math.round(parseInt(formData.duration) * 0.3)} minutes)

**Collaborative Learning Activity:** "${formData.topic} Investigation"
- Students work in groups of 3-4
- Each group tackles a different aspect of the topic
- Provide structured worksheet for guidance
- Circulate and provide individual support

**Activity Structure:**
1. **Explore Phase (5 minutes):** Students investigate given materials
2. **Discuss Phase (5 minutes):** Groups discuss findings
3. **Present Phase (${Math.round(parseInt(formData.duration) * 0.3) - 10} minutes):** Each group shares discoveries

### 4. Consolidation & Assessment (7 minutes)

**Quick Review:**
- Recap key concepts learned
- Address any misconceptions
- Connect to lesson objectives

**Formative Assessment:**
${formData.assessmentType === 'quiz' ? 
'- Quick 5-question quiz using response cards\n- Immediate feedback and clarification' :
formData.assessmentType === 'discussion' ?
'- Whole class discussion with guiding questions\n- Peer teaching and explanation' :
'- Exit ticket with 2 key learnings and 1 question\n- Thumbs up/down confidence check'}

### 5. Closure & Preview (2 minutes)
- Summarize main learning points
- Preview next lesson connection
- Assign relevant homework/extension activity

---

## Assessment Strategies

**Formative Assessment (During Lesson):**
- Questioning and observation during activities
- Group work monitoring and feedback
- Quick comprehension checks

**Summative Assessment (End of Lesson):**
- ${formData.assessmentType || 'Exit ticket with key concepts'}
- Student self-reflection on learning objectives
- Peer assessment of group presentations

---

## Resources Needed

**Physical Materials:**
${formData.resources || '- Whiteboard and markers\n- Printed worksheets\n- Basic laboratory/activity materials'}

**Digital Resources:**
- Presentation slides with visuals
- Interactive simulations (if available)
- Video clips for concept reinforcement
- Online assessment tools

**Backup Materials:**
- Alternative activities for different learning speeds
- Extra practice problems for fast finishers
- Simplified explanations for struggling learners

---

## Differentiation Strategies

**For Advanced Learners:**
- Extension questions with higher-order thinking
- Leadership roles in group activities
- Research assignment for deeper exploration

**For Struggling Learners:**
- Simplified vocabulary and step-by-step guidance
- Visual aids and hands-on manipulatives
- Peer support and collaborative learning

**For Different Learning Styles:**
- **Visual:** Diagrams, charts, and graphic organizers
- **Auditory:** Discussions, explanations, and verbal instructions
- **Kinesthetic:** Hands-on activities and movement-based learning

---

## Homework/Extension Activities

**For All Students:**
- Complete practice worksheet (10-15 minutes)
- Find one real-world example of today's concept
- Prepare for next lesson by reading textbook pages [X-Y]

**Optional Extensions:**
- Research project on related career opportunities
- Create a poster explaining the concept to younger students
- Interview family members about their experiences with the topic

---

## Safety Considerations
${formData.subject === 'Science' ? 
'- Ensure proper handling of all materials\n- Review safety procedures before activities\n- Have first aid kit accessible\n- Adult supervision for all experiments' :
'- Ensure clear pathways for movement\n- Safe arrangement of desks for group work\n- Clear instructions for all activities'}

---

## Reflection & Next Steps

**Teacher Reflection Questions:**
1. Did students achieve the learning objectives?
2. Which activities were most/least effective?
3. What would I change for next time?
4. Which students need additional support?

**Next Lesson Preparation:**
- Review assessment results to identify learning gaps
- Plan remediation activities for struggling students
- Prepare advanced activities for fast learners
- Connect to upcoming curriculum requirements

---

**Assessment Rubric:**
- **Excellent (4):** Full understanding, applies concepts independently
- **Good (3):** Good understanding, applies with minimal guidance  
- **Satisfactory (2):** Basic understanding, needs some support
- **Needs Improvement (1):** Limited understanding, requires significant help

---

*Generated by UK-GSMP AI Lesson Planner*
*Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
*Template Used: ${selectedTemplate === 'custom' ? 'Custom Structure' : selectedTemplate}*
      `;
      
      setGeneratedLesson(generatedPlan);
      setIsGenerating(false);
    }, 3500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLesson);
  };

  const downloadAsPDF = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLesson], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.subject}_LessonPlan_${formData.topic}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-emerald-500" />
            Lesson Planner
          </h1>
          <p className="text-gray-600 mt-2">
            Create comprehensive lesson plans with pedagogical best practices and AI assistance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
            {plannerStats.lessonsCreated} lessons created
          </Badge>
          <Badge variant="secondary" className="bg-violet-100 text-violet-700">
            {plannerStats.timeSaved}h saved
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{plannerStats.lessonsCreated}</div>
            <div className="text-sm text-gray-600">Lessons Created</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-violet-600">{plannerStats.timeSaved}h</div>
            <div className="text-sm text-gray-600">Time Saved</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{plannerStats.averageRating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        <Card className="border-emerald-100 shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-rose-600">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Planning Form - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Plan Configuration */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <Settings className="h-5 w-5 mr-2 text-emerald-500" />
                Lesson Plan Configuration
              </h3>
              <p className="text-sm text-gray-600">
                Configure your lesson parameters for AI-powered plan generation
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Social Science">Social Science</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6th">Class 6</SelectItem>
                      <SelectItem value="7th">Class 7</SelectItem>
                      <SelectItem value="8th">Class 8</SelectItem>
                      <SelectItem value="9th">Class 9</SelectItem>
                      <SelectItem value="10th">Class 10</SelectItem>
                      <SelectItem value="11th">Class 11</SelectItem>
                      <SelectItem value="12th">Class 12</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Lesson Topic (e.g., Introduction to Acids and Bases)"
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={formData.learningStyle} onValueChange={(value) => setFormData({...formData, learningStyle: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Learning Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mixed">Mixed (Visual/Auditory/Kinesthetic)</SelectItem>
                      <SelectItem value="visual">Visual Learners</SelectItem>
                      <SelectItem value="auditory">Auditory Learners</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic Learners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives
                  </label>
                  <Textarea
                    placeholder="What should students learn/be able to do by the end of this lesson?"
                    value={formData.objectives}
                    onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                    rows={3}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prior Knowledge Required
                  </label>
                  <Textarea
                    placeholder="What should students already know before this lesson?"
                    value={formData.priorKnowledge}
                    onChange={(e) => setFormData({...formData, priorKnowledge: e.target.value})}
                    rows={2}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assessment Type
                    </label>
                    <Select value={formData.assessmentType} onValueChange={(value) => setFormData({...formData, assessmentType: value})}>
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Select Assessment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quiz">Quick Quiz</SelectItem>
                        <SelectItem value="discussion">Discussion-Based</SelectItem>
                        <SelectItem value="exit-ticket">Exit Ticket</SelectItem>
                        <SelectItem value="practical">Practical Activity</SelectItem>
                        <SelectItem value="presentation">Student Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template (Optional)
                    </label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Choose Template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom Structure</SelectItem>
                        <SelectItem value="5e-model">5E Model</SelectItem>
                        <SelectItem value="direct-instruction">Direct Instruction</SelectItem>
                        <SelectItem value="problem-based">Problem-Based Learning</SelectItem>
                        <SelectItem value="flipped">Flipped Classroom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Resources (Optional)
                  </label>
                  <Input
                    placeholder="e.g., Lab equipment, projector, textbooks, internet access"
                    value={formData.resources}
                    onChange={(e) => setFormData({...formData, resources: e.target.value})}
                    className="border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateLesson} 
                disabled={isGenerating || !formData.subject || !formData.class || !formData.topic}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Creating Lesson Plan...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Lesson Plan Templates */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-500" />
                Lesson Templates
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lessonTemplates.map((template) => (
                  <div key={template.id} className="p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {template.duration}
                          </span>
                          <span className="flex items-center">
                            <Target className="h-3 w-3 mr-1" />
                            {template.bestFor}
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                        onClick={() => setSelectedTemplate(template.name.toLowerCase().replace(/\s+/g, '-'))}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Lesson Plans */}
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center">
                <History className="h-5 w-5 mr-2 text-violet-500" />
                Recent Lesson Plans
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLessonPlans.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{lesson.title}</h4>
                      <p className="text-xs text-gray-600">
                        {lesson.subject} • {lesson.class} • {lesson.createdAt}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                          {lesson.duration}
                        </Badge>
                        <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
                          {lesson.activities} activities
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-100">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Lesson Plan - Right Side */}
        <div className="lg:col-span-3">
          <Card className="border-emerald-100 shadow-sm h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <PlayCircle className="h-5 w-5 mr-2 text-emerald-500" />
                  Generated Lesson Plan
                </h3>
                {generatedLesson && (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={copyToClipboard}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={downloadAsPDF}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                )}
              </div>
              {generatedLesson && (
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {formData.duration} minutes
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-1" />
                    {formData.assessmentType || 'Assessment included'}
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    Multi-activity format
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedLesson ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                  <div className="max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 leading-relaxed">
                      {generatedLesson}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <div className="mb-6">
                    <Sparkles className="h-16 w-16 mx-auto text-emerald-300 mb-4" />
                    <Brain className="h-12 w-12 mx-auto text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Ready to Create Your Lesson Plan
                  </h4>
                  <p className="text-sm mb-4">
                    Fill in the configuration form and click "Generate Lesson Plan" to create<br />
                    a comprehensive lesson plan with pedagogical best practices.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto text-xs">
                    <div className="flex items-center justify-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>Structured Format</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>Assessment Ready</span>
                    </div>
                    <div className="flex items-center justify-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                      <span>Differentiated</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Teaching Tips */}
      <Card className="border-emerald-100 shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center">
            <Award className="h-5 w-5 mr-2 text-amber-500" />
            Effective Lesson Planning Tips
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Clear Objectives</h4>
              <p className="text-sm text-gray-600">
                Start with specific, measurable learning objectives that guide your entire lesson
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="h-6 w-6 text-violet-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Active Learning</h4>
              <p className="text-sm text-gray-600">
                Include hands-on activities and student interactions throughout the lesson
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Know Your Students</h4>
              <p className="text-sm text-gray-600">
                Plan for different learning styles and ability levels in your classroom
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

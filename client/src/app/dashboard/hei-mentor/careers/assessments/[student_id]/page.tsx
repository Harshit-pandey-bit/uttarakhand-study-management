// src/app/dashboard/hei-mentor/careers/assessments/[student_id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  User,
  BrainCircuit,
  Target,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  Download,
  Edit,
  Star,
  Award,
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  Plus,
  Send,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Eye,
  BarChart3
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';

// Detailed student career profile interfaces
interface DetailedStudentProfile {
  student_id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  class_level: string;
  date_of_birth: string;
  guardian_name: string;
  guardian_contact: string;
  academic_performance: {
    overall_grade: string;
    favorite_subjects: string[];
    challenging_subjects: string[];
    extracurricular_activities: string[];
  };
  career_assessment: CareerAssessmentDetails;
  counseling_history: CounselingSession[];
  career_exploration_activities: CareerActivity[];
  notes_and_observations: MentorNote[];
}

interface CareerAssessmentDetails {
  assessment_date: string;
  completion_status: 'completed' | 'in_progress' | 'pending';
  holland_code: string;
  holland_code_breakdown: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  personality_type: string;
  personality_traits: string[];
  primary_interests: string[];
  aptitude_scores: DetailedAptitudeScore[];
  work_values: WorkValue[];
  career_recommendations: DetailedCareerRecommendation[];
  learning_style: string;
  preferred_work_environment: string[];
}

interface DetailedAptitudeScore {
  category: string;
  score: number;
  percentile: number;
  description: string;
  strengths: string[];
  areas_for_improvement: string[];
}

interface WorkValue {
  value: string;
  importance_level: 'high' | 'medium' | 'low';
  description: string;
}

interface DetailedCareerRecommendation {
  career_title: string;
  match_percentage: number;
  industry: string;
  job_description: string;
  avg_salary_range: {
    entry_level: number;
    mid_level: number;
    senior_level: number;
  };
  growth_outlook: 'high' | 'medium' | 'low';
  education_requirements: string[];
  key_skills: string[];
  work_environment: string;
  career_progression: string[];
  related_careers: string[];
  preparation_steps: string[];
}

interface CounselingSession {
  session_id: string;
  date: string;
  duration_minutes: number;
  session_type: 'initial' | 'follow_up' | 'career_planning' | 'college_prep';
  topics_discussed: string[];
  key_insights: string[];
  action_items: ActionItem[];
  next_session_date?: string;
  session_notes: string;
  student_feedback?: string;
}

interface ActionItem {
  id: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface CareerActivity {
  activity_id: string;
  activity_type: 'industry_visit' | 'job_shadow' | 'internship' | 'career_fair' | 'guest_speaker' | 'online_course';
  title: string;
  description: string;
  date: string;
  duration_hours: number;
  organization: string;
  key_learnings: string[];
  reflection_notes: string;
  rating: number;
  recommended_next_steps: string[];
}

interface MentorNote {
  note_id: string;
  date: string;
  category: 'observation' | 'goal_setting' | 'progress_update' | 'concern' | 'achievement';
  title: string;
  content: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  tags: string[];
}

export default function StudentCareerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const student_id = params?.student_id as string;
  
  const [loading, setLoading] = useState<boolean>(true);
  const [student, setStudent] = useState<DetailedStudentProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'recommendations' | 'counseling' | 'activities' | 'notes'>('overview');
  const [showScheduleDialog, setShowScheduleDialog] = useState<boolean>(false);
  const [showNoteDialog, setShowNoteDialog] = useState<boolean>(false);
  const [newNote, setNewNote] = useState<{ category: string; title: string; content: string }>({
    category: 'observation',
    title: '',
    content: ''
  });

  useEffect(() => {
    if (student_id) {
      fetchStudentDetails();
    }
  }, [student_id]);

  const fetchStudentDetails = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Mock detailed student data
      const mockStudent: DetailedStudentProfile = {
        student_id: 'std_001',
        student_name: 'Arjun Sharma',
        student_email: 'arjun.sharma@school.edu',
        student_phone: '+91 9876543210',
        class_level: '12',
        date_of_birth: '2007-03-15',
        guardian_name: 'Mrs. Sunita Sharma',
        guardian_contact: '+91 9876543211',
        academic_performance: {
          overall_grade: 'A',
          favorite_subjects: ['Computer Science', 'Mathematics', 'Physics'],
          challenging_subjects: ['English Literature', 'History'],
          extracurricular_activities: ['Coding Club', 'Robotics Team', 'Math Olympiad']
        },
        career_assessment: {
          assessment_date: '2025-09-15T10:30:00Z',
          completion_status: 'completed',
          holland_code: 'RIE',
          holland_code_breakdown: {
            realistic: 85,
            investigative: 92,
            artistic: 35,
            social: 45,
            enterprising: 60,
            conventional: 55
          },
          personality_type: 'INTJ',
          personality_traits: ['Analytical', 'Independent', 'Strategic', 'Detail-oriented', 'Innovative'],
          primary_interests: ['Technology', 'Engineering', 'Problem Solving', 'Innovation', 'Research'],
          aptitude_scores: [
            {
              category: 'Logical Reasoning',
              score: 89,
              percentile: 85,
              description: 'Strong analytical thinking and problem-solving abilities',
              strengths: ['Pattern recognition', 'Deductive reasoning', 'Critical analysis'],
              areas_for_improvement: ['Speed in complex calculations', 'Presentation of logical arguments']
            },
            {
              category: 'Quantitative Ability',
              score: 82,
              percentile: 78,
              description: 'Good mathematical and numerical skills',
              strengths: ['Algebra', 'Geometry', 'Data interpretation'],
              areas_for_improvement: ['Mental math speed', 'Advanced statistics']
            },
            {
              category: 'Verbal Ability',
              score: 74,
              percentile: 65,
              description: 'Average communication and language skills',
              strengths: ['Technical writing', 'Vocabulary'],
              areas_for_improvement: ['Public speaking', 'Creative writing']
            },
            {
              category: 'Spatial Ability',
              score: 88,
              percentile: 82,
              description: 'Excellent 3D visualization and spatial reasoning',
              strengths: ['3D modeling', 'Engineering drawings', 'Geometric patterns'],
              areas_for_improvement: ['Complex spatial rotations']
            }
          ],
          work_values: [
            { value: 'Innovation', importance_level: 'high', description: 'Creating new solutions and technologies' },
            { value: 'Independence', importance_level: 'high', description: 'Working autonomously with minimal supervision' },
            { value: 'Intellectual Challenge', importance_level: 'high', description: 'Engaging in complex problem-solving' },
            { value: 'Financial Security', importance_level: 'medium', description: 'Stable and competitive compensation' },
            { value: 'Work-Life Balance', importance_level: 'medium', description: 'Flexible working arrangements' }
          ],
          career_recommendations: [
            {
              career_title: 'Software Engineer',
              match_percentage: 92,
              industry: 'Technology',
              job_description: 'Design, develop, and maintain software applications and systems using various programming languages and technologies.',
              avg_salary_range: {
                entry_level: 600000,
                mid_level: 1200000,
                senior_level: 2500000
              },
              growth_outlook: 'high',
              education_requirements: ['Bachelor\'s in Computer Science/Software Engineering', 'Strong programming skills', 'Understanding of software development lifecycle'],
              key_skills: ['Programming (Python, Java, JavaScript)', 'Problem Solving', 'System Design', 'Database Management', 'Version Control (Git)'],
              work_environment: 'Collaborative office environment with flexible remote work options',
              career_progression: ['Junior Developer', 'Software Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
              related_careers: ['Data Scientist', 'DevOps Engineer', 'Full-stack Developer', 'Mobile App Developer'],
              preparation_steps: [
                'Master at least 2-3 programming languages',
                'Build a portfolio of personal projects',
                'Contribute to open-source projects',
                'Pursue internships at tech companies',
                'Develop strong problem-solving skills through coding challenges'
              ]
            },
            {
              career_title: 'Data Scientist',
              match_percentage: 88,
              industry: 'Technology/Analytics',
              job_description: 'Analyze complex datasets to extract insights and build predictive models that drive business decisions.',
              avg_salary_range: {
                entry_level: 800000,
                mid_level: 1400000,
                senior_level: 2800000
              },
              growth_outlook: 'high',
              education_requirements: ['Bachelor\'s in CS/Statistics/Mathematics', 'Master\'s preferred', 'Strong statistical background'],
              key_skills: ['Statistics', 'Machine Learning', 'Python/R', 'Data Visualization', 'SQL', 'Business Acumen'],
              work_environment: 'Research-oriented with mix of independent and collaborative work',
              career_progression: ['Junior Data Analyst', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Head of Data Science'],
              related_careers: ['Machine Learning Engineer', 'Business Analyst', 'Research Scientist', 'AI Engineer'],
              preparation_steps: [
                'Learn statistics and probability theory',
                'Master Python/R and data science libraries',
                'Complete online courses in machine learning',
                'Work on data science projects and competitions',
                'Develop domain expertise in specific industries'
              ]
            }
          ],
          learning_style: 'Visual-Kinesthetic',
          preferred_work_environment: ['Technology-focused', 'Innovation-driven', 'Collaborative', 'Flexible hours']
        },
        counseling_history: [
          {
            session_id: 'cs_001',
            date: '2025-09-20T14:00:00Z',
            duration_minutes: 45,
            session_type: 'initial',
            topics_discussed: ['Assessment results review', 'Career interests exploration', 'Academic strengths analysis'],
            key_insights: ['Strong technical aptitude', 'Preference for analytical work', 'Interest in emerging technologies'],
            action_items: [
              {
                id: 'ai_001',
                description: 'Research computer science programs at top universities',
                due_date: '2025-10-05T00:00:00Z',
                status: 'completed',
                priority: 'high'
              },
              {
                id: 'ai_002',
                description: 'Complete online Python programming course',
                due_date: '2025-10-15T00:00:00Z',
                status: 'in_progress',
                priority: 'medium'
              }
            ],
            next_session_date: '2025-10-20T14:00:00Z',
            session_notes: 'Student shows strong alignment with technology careers. Recommended exploring both software engineering and data science paths.',
            student_feedback: 'Very helpful session. Clear about next steps to explore CS programs.'
          }
        ],
        career_exploration_activities: [
          {
            activity_id: 'act_001',
            activity_type: 'industry_visit',
            title: 'Tech Company Visit - InnovateIT Solutions',
            description: 'Visited software development company to understand day-to-day operations',
            date: '2025-09-25T09:00:00Z',
            duration_hours: 4,
            organization: 'InnovateIT Solutions',
            key_learnings: ['Agile development process', 'Team collaboration tools', 'Career progression paths'],
            reflection_notes: 'Exciting to see real software development in action. Interested in full-stack development role.',
            rating: 5,
            recommended_next_steps: ['Apply for summer internship', 'Learn more about web development frameworks']
          }
        ],
        notes_and_observations: [
          {
            note_id: 'note_001',
            date: '2025-09-30T10:00:00Z',
            category: 'observation',
            title: 'Strong Programming Interest',
            content: 'Student has been consistently working on personal coding projects. Shows initiative in learning new technologies.',
            follow_up_required: true,
            follow_up_date: '2025-10-15T00:00:00Z',
            tags: ['programming', 'self-motivated', 'technical skills']
          }
        ]
      };

      setStudent(mockStudent);
      
    } catch (error) {
      console.error('Failed to fetch student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSession = (): void => {
    // Implement session scheduling logic
    setShowScheduleDialog(false);
  };

  const handleAddNote = (): void => {
    // Implement add note logic
    setShowNoteDialog(false);
    setNewNote({ category: 'observation', title: '', content: '' });
  };

  const formatSalary = (salary: number): string => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}L`;
    } else if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(0)}K`;
    }
    return `₹${salary}`;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-red-100 text-red-800',
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getGrowthOutlookColor = (outlook: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    return colors[outlook] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Student not found</h3>
        <p className="text-gray-600">The requested student profile could not be found.</p>
        <Link href="/dashboard/hei-mentor/careers/assessments">
          <Button className="mt-4">Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/hei-mentor/careers/assessments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.student_name}</h1>
            <p className="text-gray-600">Class {student.class_level} • Career Profile & Assessment Details</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Counseling Session</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Session Type</Label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option value="follow_up">Follow-up Session</option>
                    <option value="career_planning">Career Planning</option>
                    <option value="college_prep">College Preparation</option>
                  </select>
                </div>
                <div>
                  <Label>Date & Time</Label>
                  <Input type="datetime-local" className="mt-1" />
                </div>
                <div>
                  <Label>Duration (minutes)</Label>
                  <Input type="number" placeholder="45" className="mt-1" />
                </div>
                <Button onClick={handleScheduleSession} className="w-full">
                  Schedule Session
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
        </div>
      </div>

      {/* Student Basic Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{student.student_name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {student.student_email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {student.student_phone}
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Class {student.class_level} • Grade {student.academic_performance.overall_grade}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Guardian: {student.guardian_name}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(student.career_assessment.completion_status)}>
                Assessment {student.career_assessment.completion_status}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                Last Updated: {new Date(student.career_assessment.assessment_date).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="recommendations">Careers</TabsTrigger>
          <TabsTrigger value="counseling">Counseling</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Academic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Academic Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Favorite Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.academic_performance.favorite_subjects.map((subject: string) => (
                      <Badge key={subject} className="bg-green-100 text-green-800">{subject}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Challenging Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.academic_performance.challenging_subjects.map((subject: string) => (
                      <Badge key={subject} className="bg-red-100 text-red-800">{subject}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Extracurricular Activities:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.academic_performance.extracurricular_activities.map((activity: string) => (
                      <Badge key={activity} variant="outline">{activity}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Assessment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BrainCircuit className="h-5 w-5 mr-2" />
                  Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-800">Holland Code</p>
                    <p className="text-xl font-bold text-blue-900">{student.career_assessment.holland_code}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-sm font-medium text-purple-800">Personality</p>
                    <p className="text-xl font-bold text-purple-900">{student.career_assessment.personality_type}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Primary Interests:</p>
                  <div className="flex flex-wrap gap-1">
                    {student.career_assessment.primary_interests.map((interest: string) => (
                      <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Learning Style:</p>
                  <Badge className="bg-orange-100 text-orange-800">{student.career_assessment.learning_style}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Career Recommendations Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Top Career Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.career_assessment.career_recommendations.slice(0, 2).map((career: DetailedCareerRecommendation) => (
                  <div key={career.career_title} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{career.career_title}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getGrowthOutlookColor(career.growth_outlook)}>
                          {career.growth_outlook} growth
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {formatSalary(career.avg_salary_range.mid_level)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Progress value={career.match_percentage} className="w-24 h-2" />
                        <span className="text-sm text-gray-600">{career.match_percentage}% match</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6">
          {/* Holland Code Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Holland Code Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(student.career_assessment.holland_code_breakdown).map(([type, score]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-800">{type.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="font-medium capitalize">{type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={score} className="w-32 h-2" />
                      <span className="text-sm text-gray-600 w-10">{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Aptitude Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Aptitude Assessment Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {student.career_assessment.aptitude_scores.map((aptitude: DetailedAptitudeScore) => (
                  <div key={aptitude.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{aptitude.category}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-blue-600">{aptitude.score}</span>
                        <span className="text-sm text-gray-600">({aptitude.percentile}th percentile)</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{aptitude.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-800 mb-2">Strengths:</p>
                        <ul className="text-sm text-green-700 space-y-1">
                          {aptitude.strengths.map((strength: string, index: number) => (
                            <li key={index}>• {strength}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-800 mb-2">Areas for Improvement:</p>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {aptitude.areas_for_improvement.map((area: string, index: number) => (
                            <li key={index}>• {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Work Values */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Work Values & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {student.career_assessment.work_values.map((value: WorkValue) => (
                  <div key={value.value} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{value.value}</h4>
                      <Badge className={getStatusColor(value.importance_level)}>
                        {value.importance_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Career Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {student.career_assessment.career_recommendations.map((career: DetailedCareerRecommendation) => (
            <Card key={career.career_title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {career.career_title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getGrowthOutlookColor(career.growth_outlook)}>
                      {career.growth_outlook} growth
                    </Badge>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{career.match_percentage}%</p>
                      <p className="text-xs text-gray-600">match</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Description */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Job Description:</h4>
                  <p className="text-gray-700">{career.job_description}</p>
                </div>

                {/* Salary Information */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-green-800">Entry Level</p>
                    <p className="text-lg font-bold text-green-900">
                      {formatSalary(career.avg_salary_range.entry_level)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-blue-800">Mid Level</p>
                    <p className="text-lg font-bold text-blue-900">
                      {formatSalary(career.avg_salary_range.mid_level)}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-purple-800">Senior Level</p>
                    <p className="text-lg font-bold text-purple-900">
                      {formatSalary(career.avg_salary_range.senior_level)}
                    </p>
                  </div>
                </div>

                {/* Education Requirements */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Education Requirements:</h4>
                  <ul className="space-y-1">
                    {career.education_requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Skills */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Skills Required:</h4>
                  <div className="flex flex-wrap gap-2">
                    {career.key_skills.map((skill: string) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                </div>

                {/* Career Progression */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Career Progression Path:</h4>
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    {career.career_progression.map((step: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                          {step}
                        </div>
                        {index < career.career_progression.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation Steps */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Preparation Steps:</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {career.preparation_steps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start text-blue-800">
                          <span className="font-bold mr-2">{index + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Counseling Tab */}
        <TabsContent value="counseling" className="space-y-6">
          {/* Counseling History */}
          {student.counseling_history.map((session: CounselingSession) => (
            <Card key={session.session_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    {session.session_type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Session
                  </CardTitle>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(session.date).toLocaleDateString('en-IN')}</p>
                    <p className="text-xs text-gray-600">{session.duration_minutes} minutes</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Topics Discussed */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Topics Discussed:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.topics_discussed.map((topic: string) => (
                      <Badge key={topic} variant="outline">{topic}</Badge>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Insights:</h4>
                  <ul className="space-y-1">
                    {session.key_insights.map((insight: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Action Items:</h4>
                  <div className="space-y-2">
                    {session.action_items.map((item: ActionItem) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className={`h-4 w-4 ${item.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}>
                            {item.description}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(item.priority)}>{item.priority}</Badge>
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Notes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Session Notes:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700">{session.session_notes}</p>
                  </div>
                </div>

                {/* Student Feedback */}
                {session.student_feedback && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Student Feedback:</h4>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-blue-800 italic">"{session.student_feedback}"</p>
                    </div>
                  </div>
                )}

                {/* Next Session */}
                {session.next_session_date && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        Next session scheduled: {new Date(session.next_session_date).toLocaleDateString('en-IN')} at {new Date(session.next_session_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities" className="space-y-6">
          {student.career_exploration_activities.map((activity: CareerActivity) => (
            <Card key={activity.activity_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    {activity.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {activity.activity_type.replace('_', ' ')}
                    </Badge>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < activity.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(activity.date).toLocaleDateString('en-IN')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {activity.duration_hours} hours
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {activity.organization}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description:</h4>
                  <p className="text-gray-700">{activity.description}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Learnings:</h4>
                  <ul className="space-y-1">
                    {activity.key_learnings.map((learning: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Student Reflection:</h4>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 italic">"{activity.reflection_notes}"</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Next Steps:</h4>
                  <ul className="space-y-1">
                    {activity.recommended_next_steps.map((step: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="font-bold mr-2">{index + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-6">
          {/* Add Note Button */}
          <div className="flex justify-end">
            <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Mentor Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <select 
                      value={newNote.category}
                      onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="observation">Observation</option>
                      <option value="goal_setting">Goal Setting</option>
                      <option value="progress_update">Progress Update</option>
                      <option value="concern">Concern</option>
                      <option value="achievement">Achievement</option>
                    </select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input 
                      value={newNote.title}
                      onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief title for the note"
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea 
                      value={newNote.content}
                      onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Detailed observations or notes"
                      rows={4}
                      className="mt-1" 
                    />
                  </div>
                  <Button onClick={handleAddNote} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Notes List */}
          {student.notes_and_observations.map((note: MentorNote) => (
            <Card key={note.note_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    {note.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {note.category.replace('_', ' ')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {new Date(note.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{note.content}</p>
                
                {note.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {note.follow_up_required && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Follow-up required by: {note.follow_up_date ? new Date(note.follow_up_date).toLocaleDateString('en-IN') : 'Date TBD'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// src/app/dashboard/hei-mentor/careers/insights/page.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Users,
  Briefcase,
  Globe,
  Lightbulb,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Building,
  MapPin,
  Clock,
  Brain,
  Smartphone,
  Shield,
  Leaf,
  HeartHandshake,
  Code,
  Stethoscope,
  Calculator,
  Palette,
  Wrench,
  Download,
  RefreshCw
} from 'lucide-react';

// Static data interfaces
interface IndustryTrend {
  industry: string;
  growth_rate: number;
  trend_direction: 'up' | 'down' | 'stable';
  job_openings: number;
  avg_salary: number;
  key_skills: string[];
  emerging_roles: string[];
  market_size: string;
  icon: React.ReactNode;
  description: string;
}

interface HotSkill {
  skill: string;
  demand_increase: number;
  avg_salary_boost: number;
  industries: string[];
  learning_resources: number;
  certification_value: 'high' | 'medium' | 'low';
  category: 'technical' | 'soft' | 'domain';
}

interface FutureJob {
  title: string;
  emergence_timeline: string;
  salary_range: { min: number; max: number };
  required_skills: string[];
  industries: string[];
  automation_risk: 'low' | 'medium' | 'high';
  growth_potential: number;
  description: string;
}

interface MarketInsight {
  title: string;
  category: 'salary_trends' | 'hiring_patterns' | 'skill_gaps' | 'remote_work';
  impact_level: 'high' | 'medium' | 'low';
  timeframe: string;
  key_points: string[];
  recommendation: string;
  source: string;
  date: string;
}

export default function CareerInsightsPage() {
  // Static industry trends data
  const industryTrends: IndustryTrend[] = [
    {
      industry: 'Technology & AI',
      growth_rate: 23.5,
      trend_direction: 'up',
      job_openings: 2400000,
      avg_salary: 1500000,
      key_skills: ['Python', 'Machine Learning', 'Cloud Computing', 'Data Science', 'DevOps'],
      emerging_roles: ['AI Engineer', 'ML Ops Engineer', 'Prompt Engineer', 'AI Ethics Specialist'],
      market_size: '₹8.4L Cr',
      icon: <Code className="h-6 w-6" />,
      description: 'Explosive growth in AI, machine learning, and automation technologies driving unprecedented demand for tech talent.'
    },
    {
      industry: 'Healthcare & Biotech',
      growth_rate: 18.2,
      trend_direction: 'up',
      job_openings: 1800000,
      avg_salary: 1200000,
      key_skills: ['Telemedicine', 'Health Informatics', 'Biotechnology', 'Medical Devices', 'Digital Health'],
      emerging_roles: ['Telehealth Coordinator', 'Bioinformatics Specialist', 'Medical AI Specialist', 'Health Data Analyst'],
      market_size: '₹6.2L Cr',
      icon: <Stethoscope className="h-6 w-6" />,
      description: 'Post-pandemic healthcare transformation and aging population driving massive healthcare innovation.'
    },
    {
      industry: 'Renewable Energy',
      growth_rate: 15.8,
      trend_direction: 'up',
      job_openings: 950000,
      avg_salary: 900000,
      key_skills: ['Solar Technology', 'Wind Energy', 'Energy Storage', 'Grid Management', 'Sustainability'],
      emerging_roles: ['Energy Storage Engineer', 'Smart Grid Specialist', 'Carbon Credit Analyst', 'Renewable Project Manager'],
      market_size: '₹4.1L Cr',
      icon: <Leaf className="h-6 w-6" />,
      description: 'India\'s commitment to net-zero emissions by 2070 creating massive opportunities in clean energy sector.'
    },
    {
      industry: 'Fintech & Digital Banking',
      growth_rate: 21.3,
      trend_direction: 'up',
      job_openings: 1200000,
      avg_salary: 1300000,
      key_skills: ['Blockchain', 'Digital Payments', 'RegTech', 'Cybersecurity', 'API Development'],
      emerging_roles: ['Blockchain Developer', 'Digital Banking Specialist', 'Crypto Analyst', 'RegTech Consultant'],
      market_size: '₹3.8L Cr',
      icon: <Calculator className="h-6 w-6" />,
      description: 'Digital India initiative and UPI revolution transforming financial services landscape.'
    },
    {
      industry: 'Cybersecurity',
      growth_rate: 19.7,
      trend_direction: 'up',
      job_openings: 800000,
      avg_salary: 1400000,
      key_skills: ['Ethical Hacking', 'Cloud Security', 'Zero Trust', 'Incident Response', 'Compliance'],
      emerging_roles: ['Cloud Security Architect', 'Zero Trust Specialist', 'Cyber Threat Hunter', 'Security Automation Engineer'],
      market_size: '₹2.9L Cr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Rising cyber threats and digital transformation making cybersecurity critical for all organizations.'
    },
    {
      industry: 'E-commerce & Logistics',
      growth_rate: 16.4,
      trend_direction: 'up',
      job_openings: 1500000,
      avg_salary: 800000,
      key_skills: ['Supply Chain', 'Last Mile Delivery', 'Warehouse Automation', 'Customer Experience', 'Analytics'],
      emerging_roles: ['Drone Delivery Specialist', 'Supply Chain Analyst', 'Customer Success Manager', 'Logistics Automation Engineer'],
      market_size: '₹5.7L Cr',
      icon: <Building className="h-6 w-6" />,
      description: 'E-commerce boom and changing consumer behavior driving logistics and supply chain innovation.'
    }
  ];

  // Hot skills data
  const hotSkills: HotSkill[] = [
    {
      skill: 'Artificial Intelligence & Machine Learning',
      demand_increase: 76,
      avg_salary_boost: 45,
      industries: ['Technology', 'Healthcare', 'Finance', 'Automotive'],
      learning_resources: 2400,
      certification_value: 'high',
      category: 'technical'
    },
    {
      skill: 'Cloud Computing (AWS/Azure/GCP)',
      demand_increase: 68,
      avg_salary_boost: 38,
      industries: ['Technology', 'Enterprise', 'Startups', 'Government'],
      learning_resources: 1800,
      certification_value: 'high',
      category: 'technical'
    },
    {
      skill: 'Data Science & Analytics',
      demand_increase: 64,
      avg_salary_boost: 42,
      industries: ['E-commerce', 'Finance', 'Healthcare', 'Marketing'],
      learning_resources: 2100,
      certification_value: 'high',
      category: 'technical'
    },
    {
      skill: 'Cybersecurity',
      demand_increase: 59,
      avg_salary_boost: 40,
      industries: ['Banking', 'Government', 'Healthcare', 'Technology'],
      learning_resources: 1500,
      certification_value: 'high',
      category: 'technical'
    },
    {
      skill: 'Product Management',
      demand_increase: 52,
      avg_salary_boost: 35,
      industries: ['Technology', 'Startups', 'E-commerce', 'SaaS'],
      learning_resources: 900,
      certification_value: 'medium',
      category: 'domain'
    },
    {
      skill: 'UI/UX Design',
      demand_increase: 48,
      avg_salary_boost: 30,
      industries: ['Technology', 'E-commerce', 'Media', 'Gaming'],
      learning_resources: 1200,
      certification_value: 'medium',
      category: 'technical'
    },
    {
      skill: 'Digital Marketing & SEO',
      demand_increase: 44,
      avg_salary_boost: 28,
      industries: ['E-commerce', 'Media', 'Startups', 'Agency'],
      learning_resources: 1600,
      certification_value: 'medium',
      category: 'domain'
    },
    {
      skill: 'Emotional Intelligence',
      demand_increase: 41,
      avg_salary_boost: 25,
      industries: ['Management', 'Sales', 'HR', 'Consulting'],
      learning_resources: 800,
      certification_value: 'low',
      category: 'soft'
    }
  ];

  // Future jobs data
  const futureJobs: FutureJob[] = [
    {
      title: 'AI Ethics Consultant',
      emergence_timeline: '2025-2027',
      salary_range: { min: 1200000, max: 2500000 },
      required_skills: ['AI/ML', 'Ethics', 'Policy', 'Risk Assessment', 'Communication'],
      industries: ['Technology', 'Healthcare', 'Finance', 'Government'],
      automation_risk: 'low',
      growth_potential: 89,
      description: 'Ensure AI systems are developed and deployed ethically, addressing bias, privacy, and societal impact.'
    },
    {
      title: 'Metaverse Experience Designer',
      emergence_timeline: '2025-2028',
      salary_range: { min: 1000000, max: 2200000 },
      required_skills: ['3D Design', 'VR/AR', 'User Experience', 'Game Design', 'Psychology'],
      industries: ['Gaming', 'E-commerce', 'Education', 'Real Estate'],
      automation_risk: 'low',
      growth_potential: 78,
      description: 'Create immersive virtual experiences and environments for the metaverse ecosystem.'
    },
    {
      title: 'Quantum Computing Engineer',
      emergence_timeline: '2026-2030',
      salary_range: { min: 1500000, max: 3000000 },
      required_skills: ['Quantum Physics', 'Programming', 'Mathematics', 'Research', 'Problem Solving'],
      industries: ['Technology', 'Research', 'Defense', 'Finance'],
      automation_risk: 'low',
      growth_potential: 95,
      description: 'Develop quantum computing systems and algorithms for complex computational problems.'
    },
    {
      title: 'Carbon Credit Specialist',
      emergence_timeline: '2024-2026',
      salary_range: { min: 800000, max: 1800000 },
      required_skills: ['Environmental Science', 'Finance', 'Project Management', 'Sustainability', 'Analysis'],
      industries: ['Energy', 'Manufacturing', 'Consulting', 'Government'],
      automation_risk: 'medium',
      growth_potential: 72,
      description: 'Manage carbon credit programs and help organizations achieve net-zero emissions goals.'
    },
    {
      title: 'Drone Traffic Controller',
      emergence_timeline: '2025-2027',
      salary_range: { min: 700000, max: 1500000 },
      required_skills: ['Aviation', 'Drone Technology', 'Air Traffic Management', 'Safety', 'Communication'],
      industries: ['Logistics', 'Aviation', 'Government', 'Emergency Services'],
      automation_risk: 'medium',
      growth_potential: 68,
      description: 'Manage and coordinate drone traffic in urban airspace for delivery and transport services.'
    },
    {
      title: 'Digital Wellness Coach',
      emergence_timeline: '2024-2025',
      salary_range: { min: 600000, max: 1400000 },
      required_skills: ['Psychology', 'Digital Health', 'Counseling', 'Technology', 'Wellness'],
      industries: ['Healthcare', 'Technology', 'Wellness', 'Corporate'],
      automation_risk: 'low',
      growth_potential: 61,
      description: 'Help individuals maintain healthy relationships with technology and digital devices.'
    }
  ];

  // Market insights data
  const marketInsights: MarketInsight[] = [
    {
      title: 'Remote Work Becomes Permanent Standard',
      category: 'remote_work',
      impact_level: 'high',
      timeframe: '2024-2025',
      key_points: [
        '78% of Indian companies now offer permanent remote work options',
        'Salary premiums for remote-first skills increased by 23%',
        'Digital collaboration tools market grew by 340%',
        'Work-life balance now top priority for 67% of professionals'
      ],
      recommendation: 'Students should develop strong digital communication and self-management skills.',
      source: 'NASSCOM Future of Work Study 2024',
      date: '2024-09-15'
    },
    {
      title: 'AI Skills Premium Reaches All-Time High',
      category: 'salary_trends',
      impact_level: 'high',
      timeframe: '2024-2026',
      key_points: [
        'AI-skilled professionals earn 45-60% more than peers',
        'Entry-level AI roles starting at ₹12-15 LPA',
        'Senior AI experts commanding ₹50+ LPA packages',
        'Non-tech roles requiring AI literacy increasing by 200%'
      ],
      recommendation: 'All students should gain basic AI literacy regardless of their primary field.',
      source: 'TechGig Salary Survey 2024',
      date: '2024-08-22'
    },
    {
      title: 'Green Jobs Revolution in Full Swing',
      category: 'hiring_patterns',
      impact_level: 'high',
      timeframe: '2024-2030',
      key_points: [
        '2.5 million new green jobs expected by 2030',
        'Renewable energy hiring up 156% year-over-year',
        'ESG (Environmental, Social, Governance) roles growing rapidly',
        'Traditional industries adding sustainability positions'
      ],
      recommendation: 'Students should consider sustainability certifications and environmental awareness.',
      source: 'Ministry of New & Renewable Energy Report',
      date: '2024-07-10'
    },
    {
      title: 'Critical Shortage in Cybersecurity Talent',
      category: 'skill_gaps',
      impact_level: 'high',
      timeframe: '2024-2027',
      key_points: [
        '3.5 million cybersecurity jobs remain unfilled globally',
        'India faces shortage of 1 million cybersecurity professionals',
        'Cybersecurity roles offer 40%+ salary premiums',
        'Government mandating cybersecurity certifications for critical sectors'
      ],
      recommendation: 'Excellent opportunity for students to enter high-demand, recession-proof field.',
      source: 'Data Security Council of India Report',
      date: '2024-06-18'
    }
  ];

  const formatSalary = (salary: number): string => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}L`;
    } else if (salary >= 100000) {
      return `₹${(salary / 100000).toFixed(0)}K`;
    }
    return `₹${salary}`;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-600" />;
      default: return <BarChart3 className="h-5 w-5 text-blue-600" />;
    }
  };

  const getImpactColor = (level: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getCertificationColor = (value: string): string => {
    const colors: Record<string, string> = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return colors[value] || 'bg-gray-100 text-gray-800';
  };

  const getAutomationRiskColor = (risk: string): string => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Industry Insights & Trends</h1>
          <p className="text-gray-600">Latest career trends, job market data, and industry forecasts for 2024-2025</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Last Updated: Oct 2024
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Job Market Growth</p>
                <p className="text-2xl font-bold text-green-600">+18.5%</p>
                <p className="text-xs text-gray-500">vs last year</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">New Job Openings</p>
                <p className="text-2xl font-bold text-blue-600">9.6M+</p>
                <p className="text-xs text-gray-500">this quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Salary Increase</p>
                <p className="text-2xl font-bold text-purple-600">+23%</p>
                <p className="text-xs text-gray-500">for tech roles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Emerging Roles</p>
                <p className="text-2xl font-bold text-orange-600">150+</p>
                <p className="text-xs text-gray-500">new job titles</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="industry-trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="industry-trends">Industry Trends</TabsTrigger>
          <TabsTrigger value="hot-skills">Hot Skills</TabsTrigger>
          <TabsTrigger value="future-jobs">Future Jobs</TabsTrigger>
          <TabsTrigger value="market-insights">Market Insights</TabsTrigger>
        </TabsList>

        {/* Industry Trends Tab */}
        <TabsContent value="industry-trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {industryTrends.map((trend: IndustryTrend, index: number) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        {trend.icon}
                      </div>
                      {trend.industry}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(trend.trend_direction)}
                      <span className={`text-lg font-bold ${trend.trend_direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.growth_rate}%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 text-sm">{trend.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Job Openings</p>
                      <p className="font-bold text-blue-600">
                        {(trend.job_openings / 1000000).toFixed(1)}M+
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Salary</p>
                      <p className="font-bold text-green-600">
                        {formatSalary(trend.avg_salary)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Market Size</p>
                      <p className="font-bold text-purple-600">{trend.market_size}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Growth Rate</p>
                      <div className="flex items-center gap-1">
                        <Progress value={trend.growth_rate} className="w-12 h-2" />
                        <span className="text-xs">{trend.growth_rate}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Skills in Demand:</p>
                    <div className="flex flex-wrap gap-1">
                      {trend.key_skills.slice(0, 5).map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Emerging Roles:</p>
                    <div className="space-y-1">
                      {trend.emerging_roles.slice(0, 3).map((role: string) => (
                        <div key={role} className="flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="text-gray-700">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Hot Skills Tab */}
        <TabsContent value="hot-skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {hotSkills.map((skill: HotSkill, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{skill.skill}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getCertificationColor(skill.certification_value)}>
                        {skill.certification_value} value
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-green-800">Demand Increase</p>
                      <div className="flex items-center justify-center gap-1">
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                        <span className="text-xl font-bold text-green-900">{skill.demand_increase}%</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-blue-800">Salary Boost</p>
                      <div className="flex items-center justify-center gap-1">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-xl font-bold text-blue-900">{skill.avg_salary_boost}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">High Demand Industries:</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.industries.map((industry: string) => (
                        <Badge key={industry} variant="outline" className="text-xs">{industry}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-600">Learning Resources Available</p>
                      <p className="font-bold text-orange-600">{skill.learning_resources.toLocaleString()}+</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Future Jobs Tab */}
        <TabsContent value="future-jobs" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {futureJobs.map((job: FutureJob, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <p className="text-sm text-gray-600">Emerging: {job.emergence_timeline}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge className={getAutomationRiskColor(job.automation_risk)}>
                          {job.automation_risk} automation risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Growth: {job.growth_potential}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{job.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800 mb-1">Salary Range</p>
                      <p className="font-bold text-green-900">
                        {formatSalary(job.salary_range.min)} - {formatSalary(job.salary_range.max)}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800 mb-1">Growth Potential</p>
                      <div className="flex items-center gap-2">
                        <Progress value={job.growth_potential} className="flex-1 h-2" />
                        <span className="text-sm font-bold text-blue-900">{job.growth_potential}%</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-800 mb-1">Automation Risk</p>
                      <Badge className={getAutomationRiskColor(job.automation_risk)}>
                        {job.automation_risk}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.map((skill: string) => (
                        <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Industries:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.industries.map((industry: string) => (
                        <Badge key={industry} className="bg-gray-100 text-gray-800 text-xs">{industry}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="market-insights" className="space-y-6">
          {marketInsights.map((insight: MarketInsight, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <Lightbulb className="h-5 w-5 text-orange-600" />
                    </div>
                    {insight.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(insight.impact_level)}>
                      {insight.impact_level} impact
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {insight.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Timeframe</p>
                    <p className="font-medium">{insight.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Source</p>
                    <p className="font-medium">{insight.source}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Published</p>
                    <p className="font-medium">{new Date(insight.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Key Points:</p>
                  <ul className="space-y-2">
                    {insight.key_points.map((point: string, pointIndex: number) => (
                      <li key={pointIndex} className="flex items-start text-sm">
                        <Target className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Career Guidance Recommendation:</p>
                      <p className="text-sm text-blue-800">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

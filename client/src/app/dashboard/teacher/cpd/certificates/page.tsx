'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Download, 
  Share2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  FileText,
  ExternalLink,
  Trophy,
  Shield,
  Globe,
  Bookmark,
  TrendingUp,
  Target,
  Users,
  Mail,
  Copy,
  QrCode,
  Verified,
  GraduationCap,
  BookOpen,
  Brain
} from 'lucide-react';

// Certificate Types
interface Certificate {
  id: string;
  title: string;
  course: string;
  provider: string;
  type: 'completion' | 'achievement' | 'participation' | 'excellence' | 'digital-badge';
  category: 'diksha' | 'nishtha' | 'cpd' | 'subject-specific' | 'leadership' | 'technology';
  issueDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending-renewal' | 'revoked';
  credentialId: string;
  verificationUrl: string;
  skills: string[];
  hours: number;
  grade?: string;
  score?: number;
  maxScore?: number;
  downloadUrl: string;
  shareUrl: string;
  badgeImage?: string;
  description: string;
  instructor?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  featured: boolean;
}

interface CertificateStats {
  totalCertificates: number;
  validCertificates: number;
  expiringSoon: number;
  digitalBadges: number;
  totalHours: number;
  averageScore: number;
  categories: {
    diksha: number;
    nishtha: number;
    cpd: number;
    subjectSpecific: number;
    leadership: number;
    technology: number;
  };
}

// Sample Certificate Data
const certificateStats: CertificateStats = {
  totalCertificates: 24,
  validCertificates: 22,
  expiringSoon: 2,
  digitalBadges: 18,
  totalHours: 284,
  averageScore: 87.3,
  categories: {
    diksha: 8,
    nishtha: 6,
    cpd: 4,
    subjectSpecific: 3,
    leadership: 2,
    technology: 1
  }
};

const certificates: Certificate[] = [
  {
    id: '1',
    title: 'NISHTHA - Foundational Literacy and Numeracy',
    course: 'NISHTHA 3.0 FLN Module 1-12',
    provider: 'Ministry of Education, Govt of India',
    type: 'completion',
    category: 'nishtha',
    issueDate: '2025-03-15',
    status: 'valid',
    credentialId: 'NISHTHA-FLN-2025-001847',
    verificationUrl: 'https://diksha.gov.in/verify/NISHTHA-FLN-2025-001847',
    skills: ['Foundational Literacy', 'Numeracy Skills', 'Primary Teaching'],
    hours: 48,
    grade: 'A+',
    score: 94,
    maxScore: 100,
    downloadUrl: '/certificates/nishtha-fln-cert.pdf',
    shareUrl: 'https://diksha.gov.in/share/cert/001847',
    badgeImage: '/badges/nishtha-fln.png',
    description: 'Successfully completed comprehensive training on Foundational Literacy and Numeracy for primary education.',
    instructor: 'NCERT Faculty Team',
    level: 'intermediate',
    featured: true
  },
  {
    id: '2',
    title: 'Digital Tools for Classroom Management',
    course: 'ICT Integration in Teaching-Learning',
    provider: 'DIKSHA - NCERT',
    type: 'achievement',
    category: 'technology',
    issueDate: '2025-02-28',
    expiryDate: '2027-02-28',
    status: 'valid',
    credentialId: 'DIKSHA-ICT-2025-008234',
    verificationUrl: 'https://diksha.gov.in/verify/DIKSHA-ICT-2025-008234',
    skills: ['Digital Literacy', 'Classroom Technology', 'ICT Integration'],
    hours: 25,
    grade: 'A',
    score: 89,
    maxScore: 100,
    downloadUrl: '/certificates/ict-integration-cert.pdf',
    shareUrl: 'https://diksha.gov.in/share/cert/008234',
    badgeImage: '/badges/ict-integration.png',
    description: 'Demonstrated proficiency in integrating digital tools for effective classroom management and teaching.',
    instructor: 'Dr. Priya Sharma',
    level: 'intermediate',
    featured: true
  },
  {
    id: '3',
    title: 'School Leadership Excellence',
    course: 'Educational Leadership and Management',
    provider: 'NIEPA - National Institute of Educational Planning',
    type: 'excellence',
    category: 'leadership',
    issueDate: '2025-01-20',
    status: 'valid',
    credentialId: 'NIEPA-LEAD-2025-004521',
    verificationUrl: 'https://niepa.ac.in/verify/004521',
    skills: ['Educational Leadership', 'School Management', 'Strategic Planning'],
    hours: 60,
    grade: 'A+',
    score: 96,
    maxScore: 100,
    downloadUrl: '/certificates/leadership-excellence-cert.pdf',
    shareUrl: 'https://niepa.ac.in/share/cert/004521',
    badgeImage: '/badges/leadership-excellence.png',
    description: 'Recognized for exceptional performance in educational leadership and school management principles.',
    instructor: 'Prof. Rajesh Kumar',
    level: 'advanced',
    featured: true
  },
  {
    id: '4',
    title: 'Mathematics Pedagogy - Secondary Level',
    course: 'Effective Mathematics Teaching Strategies',
    provider: 'CBSE - Central Board of Secondary Education',
    type: 'completion',
    category: 'subject-specific',
    issueDate: '2024-12-10',
    expiryDate: '2026-12-10',
    status: 'valid',
    credentialId: 'CBSE-MATH-2024-007845',
    verificationUrl: 'https://cbse.gov.in/verify/007845',
    skills: ['Mathematics Teaching', 'Pedagogical Skills', 'Secondary Education'],
    hours: 35,
    grade: 'A',
    score: 88,
    maxScore: 100,
    downloadUrl: '/certificates/math-pedagogy-cert.pdf',
    shareUrl: 'https://cbse.gov.in/share/cert/007845',
    badgeImage: '/badges/math-pedagogy.png',
    description: 'Completed advanced training in mathematics pedagogy for secondary level teaching.',
    instructor: 'Dr. Anita Verma',
    level: 'advanced',
    featured: false
  },
  {
    id: '5',
    title: 'Inclusive Education Practices',
    course: 'Creating Inclusive Learning Environments',
    provider: 'NCERT - National Council of Educational Research',
    type: 'digital-badge',
    category: 'cpd',
    issueDate: '2024-11-15',
    status: 'valid',
    credentialId: 'NCERT-INC-2024-009876',
    verificationUrl: 'https://ncert.nic.in/verify/009876',
    skills: ['Inclusive Education', 'Special Needs', 'Differentiated Learning'],
    hours: 28,
    grade: 'B+',
    score: 85,
    maxScore: 100,
    downloadUrl: '/certificates/inclusive-education-badge.pdf',
    shareUrl: 'https://ncert.nic.in/share/badge/009876',
    badgeImage: '/badges/inclusive-education.png',
    description: 'Digital badge earned for implementing inclusive education practices in diverse classroom settings.',
    instructor: 'Ms. Kavita Singh',
    level: 'intermediate',
    featured: false
  },
  {
    id: '6',
    title: 'Art Integrated Learning',
    course: 'Creative Arts in Education',
    provider: 'DIKSHA - Ministry of Education',
    type: 'participation',
    category: 'cpd',
    issueDate: '2024-10-08',
    status: 'valid',
    credentialId: 'DIKSHA-ART-2024-003421',
    verificationUrl: 'https://diksha.gov.in/verify/DIKSHA-ART-2024-003421',
    skills: ['Art Integration', 'Creative Teaching', 'Interdisciplinary Learning'],
    hours: 20,
    score: 92,
    maxScore: 100,
    downloadUrl: '/certificates/art-integrated-cert.pdf',
    shareUrl: 'https://diksha.gov.in/share/cert/003421',
    badgeImage: '/badges/art-integrated.png',
    description: 'Successfully participated in comprehensive art integrated learning methodology training.',
    instructor: 'Prof. Meera Joshi',
    level: 'beginner',
    featured: false
  }
];

// Certificate Card Component
interface CertificateCardProps {
  certificate: Certificate;
  onView: (certificate: Certificate) => void;
  onDownload: (certificate: Certificate) => void;
  onShare: (certificate: Certificate) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ 
  certificate, 
  onView, 
  onDownload, 
  onShare 
}) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'pending-renewal': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'revoked': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'completion': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'achievement': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'excellence': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'participation': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'digital-badge': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'diksha': return <BookOpen className="h-4 w-4" />;
      case 'nishtha': return <GraduationCap className="h-4 w-4" />;
      case 'cpd': return <TrendingUp className="h-4 w-4" />;
      case 'subject-specific': return <Brain className="h-4 w-4" />;
      case 'leadership': return <Users className="h-4 w-4" />;
      case 'technology': return <Shield className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpiringSoon = certificate.expiryDate && 
    new Date(certificate.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

  return (
    <Card className={`border-2 hover:shadow-lg transition-all duration-300 group ${
      certificate.featured ? 'border-gold-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 
      'border-purple-100 hover:border-purple-200'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className="relative">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                certificate.featured ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 
                'bg-gradient-to-br from-purple-400 to-indigo-500'
              }`}>
                <Award className="h-8 w-8 text-white" />
              </div>
              {certificate.featured && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                  <Star className="h-3 w-3 fill-current" />
                </div>
              )}
              {isExpiringSoon && (
                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1">
                  <Clock className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {certificate.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{certificate.provider}</p>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className={`text-xs ${getTypeStyle(certificate.type)}`}>
                  {certificate.type.replace('-', ' ')}
                </Badge>
                <Badge className={`text-xs ${getStatusStyle(certificate.status)}`}>
                  {certificate.status}
                </Badge>
                {certificate.type === 'digital-badge' && (
                  <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Digital Badge
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{certificate.description}</p>

        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-purple-400" />
            <span>Issued {formatDate(certificate.issueDate)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-purple-400" />
            <span>{certificate.hours} hours</span>
          </div>
          {certificate.score && (
            <div className="flex items-center text-gray-600">
              <Target className="h-4 w-4 mr-2 text-purple-400" />
              <span>{certificate.score}/{certificate.maxScore} ({Math.round((certificate.score / certificate.maxScore!) * 100)}%)</span>
            </div>
          )}
          {certificate.grade && (
            <div className="flex items-center text-gray-600">
              <Trophy className="h-4 w-4 mr-2 text-purple-400" />
              <span>Grade: {certificate.grade}</span>
            </div>
          )}
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1">
          {certificate.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {certificate.skills.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{certificate.skills.length - 3} more
            </Badge>
          )}
        </div>

        {/* Expiry Warning */}
        {isExpiringSoon && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-sm text-red-800">
                <span className="font-medium">Expires soon:</span> {formatDate(certificate.expiryDate!)}
              </p>
            </div>
          </div>
        )}

        {/* Credential ID */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Verified className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600 font-mono">{certificate.credentialId}</span>
            </div>
            <Button size="sm" variant="ghost" className="p-1 h-auto">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => onView(certificate)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => onDownload(certificate)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
            onClick={() => onShare(certificate)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Verification Link */}
        <div className="pt-2 border-t">
          <Button 
            size="sm" 
            variant="link" 
            className="text-xs p-0 h-auto text-purple-600 hover:text-purple-800"
            onClick={() => window.open(certificate.verificationUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Verify Certificate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Certificate Detail Modal Component
interface CertificateDetailModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CertificateDetailModal: React.FC<CertificateDetailModalProps> = ({ certificate, isOpen, onClose }) => {
  if (!isOpen || !certificate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900">Certificate Details</h2>
          <Button variant="outline" onClick={onClose}>
            <Award className="h-4 w-4 mr-2" />
            Close
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-8 text-center">
            <Award className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{certificate.title}</h3>
            <p className="text-lg text-gray-700 mb-4">{certificate.course}</p>
            <p className="text-purple-700 font-semibold">{certificate.provider}</p>
            
            {certificate.score && (
              <div className="mt-6 inline-block bg-white rounded-lg px-6 py-3 border border-purple-200">
                <p className="text-sm text-gray-600">Final Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {certificate.score}/{certificate.maxScore} ({Math.round((certificate.score / certificate.maxScore!) * 100)}%)
                </p>
                {certificate.grade && (
                  <p className="text-lg font-semibold text-gray-800 mt-1">Grade: {certificate.grade}</p>
                )}
              </div>
            )}
          </div>

          {/* Certificate Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold">Certificate Information</h4>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Issue Date:</span>
                    <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                  </div>
                  {certificate.expiryDate && (
                    <div>
                      <span className="text-gray-600">Expiry Date:</span>
                      <p className="font-medium">{new Date(certificate.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{certificate.hours} hours</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Level:</span>
                    <p className="font-medium capitalize">{certificate.level}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-600 text-sm">Credential ID:</span>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{certificate.credentialId}</p>
                </div>

                {certificate.instructor && (
                  <div>
                    <span className="text-gray-600 text-sm">Instructor:</span>
                    <p className="font-medium">{certificate.instructor}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h4 className="text-lg font-semibold">Skills & Competencies</h4>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {certificate.skills.map((skill, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-purple-800">{certificate.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4 pt-6 border-t">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Certificate
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Verify Online
            </Button>
            <Button variant="outline">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Certificates Page Component
export default function CertificatesPage() {
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(certificates);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter certificates
  React.useEffect(() => {
    let filtered = certificates;

    if (searchTerm) {
      filtered = filtered.filter(cert => 
        cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(cert => cert.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(cert => cert.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(cert => cert.type === typeFilter);
    }

    setFilteredCertificates(filtered);
  }, [searchTerm, categoryFilter, statusFilter, typeFilter]);

  const handleView = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsDetailOpen(true);
  };

  const handleDownload = (certificate: Certificate) => {
    // Implement download logic
    console.log('Downloading certificate:', certificate.title);
  };

  const handleShare = (certificate: Certificate) => {
    // Implement share logic
    navigator.share({
      title: certificate.title,
      text: `Check out my certificate: ${certificate.title}`,
      url: certificate.shareUrl
    }).catch(() => {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(certificate.shareUrl);
    });
  };

  const featuredCertificates = certificates.filter(cert => cert.featured);
  const expiringSoon = certificates.filter(cert => 
    cert.expiryDate && new Date(cert.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Award className="h-8 w-8 mr-3 text-purple-500" />
            Professional Certificates
          </h1>
          <p className="text-gray-600 mt-2">
            Your comprehensive collection of earned certificates and digital badges
          </p>
        </div>
        <div className="hidden lg:flex items-center space-x-3">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <Mail className="h-4 w-4 mr-2" />
            Email All
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Globe className="h-4 w-4 mr-2" />
            Public Profile
          </Button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card className="lg:col-span-2 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{certificateStats.totalCertificates}</p>
                <p className="text-xs text-gray-500 mt-1">{certificateStats.digitalBadges} digital badges</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{certificateStats.validCertificates}</div>
            <div className="text-sm text-gray-600 mt-1">Valid</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{certificateStats.expiringSoon}</div>
            <div className="text-sm text-gray-600 mt-1">Expiring Soon</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{certificateStats.totalHours}</div>
            <div className="text-sm text-gray-600 mt-1">Total Hours</div>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{certificateStats.averageScore}%</div>
            <div className="text-sm text-gray-600 mt-1">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-purple-50 border border-purple-200">
          <TabsTrigger 
            value="all" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Award className="h-4 w-4 mr-2" />
            All Certificates
          </TabsTrigger>
          <TabsTrigger 
            value="featured" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Star className="h-4 w-4 mr-2" />
            Featured ({featuredCertificates.length})
          </TabsTrigger>
          <TabsTrigger 
            value="expiring" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Clock className="h-4 w-4 mr-2" />
            Expiring ({expiringSoon.length})
          </TabsTrigger>
          <TabsTrigger 
            value="badges" 
            className="data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            Digital Badges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Filters */}
          <Card className="border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">Filter Certificates</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200 focus:border-purple-400"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="diksha">DIKSHA</SelectItem>
                    <SelectItem value="nishtha">NISHTHA</SelectItem>
                    <SelectItem value="cpd">CPD Programs</SelectItem>
                    <SelectItem value="subject-specific">Subject Specific</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="completion">Completion</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="excellence">Excellence</SelectItem>
                    <SelectItem value="participation">Participation</SelectItem>
                    <SelectItem value="digital-badge">Digital Badge</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-purple-200 focus:border-purple-400">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="pending-renewal">Pending Renewal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Certificates Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                All Certificates ({filteredCertificates.length})
              </h2>
            </div>
            
            {filteredCertificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map(certificate => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                    onView={handleView}
                    onDownload={handleDownload}
                    onShare={handleShare}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria or filters
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCertificates.map(certificate => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={handleView}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-6">
          {expiringSoon.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expiringSoon.map(certificate => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onView={handleView}
                  onDownload={handleDownload}
                  onShare={handleShare}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No certificates expiring soon</h3>
                <p className="text-gray-600">
                  All your certificates are up to date!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.filter(cert => cert.type === 'digital-badge').map(certificate => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={handleView}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Certificate Detail Modal */}
      <CertificateDetailModal
        certificate={selectedCertificate}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}

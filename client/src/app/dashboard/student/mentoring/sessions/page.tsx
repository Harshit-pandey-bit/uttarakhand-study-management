'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Clock,
  Users,
  Star,
  Video,
  MessageCircle,
  MoreHorizontal,
  ArrowLeft,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Import API client and types
import { mentoringAPI } from '@/lib/api/mentoringClient';
import { 
  Session, 
  SessionList,
  SessionStatus, 
  SessionType,
  SessionFeedback,
  SessionFilters,
  UpdateSession
} from '@/types/mentoring';

export default function SessionsPage() {
  // State management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<SessionStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<SessionType | 'all'>('all');
  
  // Feedback modal
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [feedbackData, setFeedbackData] = useState<SessionFeedback>({
    rating: 5,
    comment: ''
  });

  // Load sessions
  useEffect(() => {
    loadSessions();
  }, [currentPage, activeTab, statusFilter, typeFilter, searchTerm]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: SessionFilters = {};
      
      // Set status filter based on active tab
      if (activeTab === 'upcoming') {
        filters.status = SessionStatus.SCHEDULED;
      } else if (activeTab === 'completed') {
        filters.status = SessionStatus.COMPLETED;
      } else if (activeTab === 'cancelled') {
        filters.status = SessionStatus.CANCELLED;
      }

      // Add additional filters
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }

      const response = await mentoringAPI.getSessions(filters, currentPage, 10);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data) {
        setSessions(response.data.sessions);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getSessionStatusColor = (status: SessionStatus) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatSessionTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Session actions
  const handleJoinSession = async (sessionId: string) => {
    try {
      const response = await mentoringAPI.joinSession(sessionId);
      if (response.data?.meetingLink) {
        window.open(response.data.meetingLink, '_blank');
      }
    } catch (err) {
      console.error('Failed to join session:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return;
    
    try {
      const response = await mentoringAPI.deleteSession(sessionId);
      if (response.data?.success) {
        await loadSessions(); // Reload sessions
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSession) return;

    try {
      const response = await mentoringAPI.submitSessionFeedback(selectedSession.id, feedbackData);
      if (response.data?.success) {
        setShowFeedbackModal(false);
        setSelectedSession(null);
        await loadSessions(); // Reload sessions
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // Filter sessions by search term
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentoring Sessions</h1>
          <p className="text-gray-600 mt-1">Manage your mentoring sessions</p>
        </div>
        <Link href="/dashboard/student/mentoring/sessions/schedule">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sessions, mentors, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SessionStatus | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as SessionType | 'all')}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="one_on_one">One-on-One</SelectItem>
                <SelectItem value="group">Group</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="doubt_session">Doubt Session</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            "px-6 py-2",
            activeTab === 'upcoming' && "bg-white shadow-sm"
          )}
        >
          Upcoming ({sessions.filter(s => s.status === 'scheduled').length})
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('completed')}
          className={cn(
            "px-6 py-2",
            activeTab === 'completed' && "bg-white shadow-sm"
          )}
        >
          Completed ({sessions.filter(s => s.status === 'completed').length})
        </Button>
        <Button
          variant={activeTab === 'cancelled' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('cancelled')}
          className={cn(
            "px-6 py-2",
            activeTab === 'cancelled' && "bg-white shadow-sm"
          )}
        >
          Cancelled ({sessions.filter(s => s.status === 'cancelled').length})
        </Button>
      </div>

      {/* Sessions List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Loading sessions...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="text-red-800 font-medium">Unable to load sessions</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <Button 
                    onClick={loadSessions} 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 border-red-200 hover:bg-red-50"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {activeTab === 'upcoming' && "Schedule your first mentoring session to get started"}
                {activeTab === 'completed' && "Complete some sessions to see them here"}
                {activeTab === 'cancelled' && "Cancelled sessions will appear here"}
              </h3>
              {activeTab === 'upcoming' && (
                <Link href="/dashboard/student/mentoring/sessions/schedule">
                  <Button className="mt-4">Schedule Your First Session</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Session Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg">{session.title}</h3>
                        <Badge className={cn("text-xs", getSessionStatusColor(session.status))}>
                          {session.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {session.sessionType.replace('_', ' ')}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4">{session.description}</p>

                      {/* Session Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatSessionTime(session.sessionDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <span>with {session.mentor.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-gray-400" />
                          <span>{session.subject}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{session.duration} minutes</span>
                        </div>
                      </div>

                      {/* Mentor Info */}
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={session.mentor.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {session.mentor.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{session.mentor.name}</p>
                          <p className="text-xs text-gray-500">{session.mentor.designation}</p>
                        </div>
                      </div>

                      {/* Feedback (for completed sessions) */}
                      {session.status === 'completed' && session.feedback && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{session.feedback.rating}/5</span>
                          </div>
                          <p className="text-sm text-gray-600">{session.feedback.comment}</p>
                        </div>
                      )}

                      {/* Session Notes */}
                      {session.sessionNotes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-sm mb-2">Session Notes:</h4>
                          <p className="text-sm text-gray-600">{session.sessionNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-6">
                      {session.status === 'scheduled' && session.canJoin && (
                        <Button
                          onClick={() => handleJoinSession(session.id)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Join
                        </Button>
                      )}
                      
                      {session.status === 'completed' && !session.feedback && (
                        <Button
                          onClick={() => {
                            setSelectedSession(session);
                            setShowFeedbackModal(true);
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          Rate
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {session.status === 'scheduled' && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Session
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteSession(session.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Session
                              </DropdownMenuItem>
                            </>
                          )}
                          {session.recordingUrl && (
                            <DropdownMenuItem>
                              <Video className="mr-2 h-4 w-4" />
                              View Recording
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Your Session</DialogTitle>
            <DialogDescription>
              How was your session with {selectedSession?.mentor.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant="ghost"
                    size="sm"
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating }))}
                  >
                    <Star
                      className={cn(
                        "h-6 w-6",
                        rating <= feedbackData.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Comment</label>
              <Textarea
                placeholder="Share your feedback about the session..."
                value={feedbackData.comment}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, comment: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

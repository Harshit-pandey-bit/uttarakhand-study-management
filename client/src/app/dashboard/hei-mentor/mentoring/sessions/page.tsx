// src/app/dashboard/hei-mentor/mentoring/sessions/page.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Clock, 
  Users, 
  Video,
  Plus,
  Search,
  Filter,
  MapPin,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

import { heiMentorAPI } from '@/lib/api/hei-mentor-client';
import type { MentoringSession, SessionFilters } from '@/types/hei-mentor';

const SESSION_STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

const SESSION_TYPE_LABELS = {
  one_on_one: '1-on-1',
  group: 'Group',
  workshop: 'Workshop'
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<MentoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SessionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const sessionsPerPage = 10;

  useEffect(() => {
    fetchSessions();
  }, [currentPage, filters]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await heiMentorAPI.getSessions(filters, currentPage, sessionsPerPage);
      setSessions(response.sessions);
      setTotalSessions(response.total);
      setHasMore(response.hasMore);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Sessions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    if (value === 'all') {
      // Remove filter when "All" is selected
      const newFilters = { ...filters };
      delete newFilters[key as keyof SessionFilters];
      setFilters(newFilters);
    } else {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({
      ...prev,
      search: searchTerm || undefined
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const getStatusBadgeColor = (status: string) => {
    return SESSION_STATUS_COLORS[status as keyof typeof SESSION_STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredSessions = sessions.filter(session =>
    searchTerm === '' || 
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && currentPage === 1) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mentoring Sessions</h1>
          <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={() => fetchSessions()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mentoring Sessions</h1>
          <p className="text-gray-600">Manage and track your mentoring sessions</p>
        </div>
        <Link href="/dashboard/hei-mentor/mentoring/sessions/schedule">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search sessions by title or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" variant="outline">
                Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter - Fixed */}
              <Select 
                value={filters.status || 'all'} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Session Type Filter - Fixed */}
              <Select 
                value={filters.session_type || 'all'} 
                onValueChange={(value) => handleFilterChange('session_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="one_on_one">1-on-1</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>

              {/* Subject Filter */}
              <Input
                placeholder="Subject filter"
                value={filters.subject || ''}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
              />

              {/* Clear Button */}
              <Button
                type="button"
                variant="outline"
                onClick={clearFilters}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const { date, time } = formatDateTime(session.session_date);
            
            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {session.title}
                        </h3>
                        <Badge className={getStatusBadgeColor(session.status)}>
                          {session.status}
                        </Badge>
                        <Badge variant="outline">
                          {SESSION_TYPE_LABELS[session.session_type as keyof typeof SESSION_TYPE_LABELS]}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{session.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {date}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {time} ({session.duration}min)
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {session.max_participants} max
                        </div>
                        {session.subject && (
                          <div className="flex items-center">
                            <span className="font-medium">{session.subject}</span>
                          </div>
                        )}
                        {session.meeting_room && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {session.meeting_room}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {session.meeting_link && session.status === 'scheduled' && (
                        <a href={session.meeting_link} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </a>
                      )}
                      
                      <Link href={`/dashboard/hei-mentor/mentoring/sessions/${session.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      
                      {session.status === 'scheduled' && (
                        <Link href={`/dashboard/hei-mentor/mentoring/sessions/${session.id}/edit`}>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || Object.keys(filters).length > 0
                ? "No sessions match your current filters."
                : "You haven't scheduled any mentoring sessions yet."}
            </p>
            <Link href="/dashboard/hei-mentor/mentoring/sessions/schedule">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Your First Session
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalSessions > sessionsPerPage && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(totalSessions / sessionsPerPage)}
          </span>
          
          <Button
            variant="outline"
            disabled={!hasMore}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

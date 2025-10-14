'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { teacherAPI } from '@/lib/teacher-client';
import { Announcement } from '@/types/teacher-types';
import { Loader2, AlertTriangle } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teacherAPI.getAnnouncements({});
        setAnnouncements(data);
      } catch {
        setError('Failed to load announcements.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Announcements</h1>

      {loading && (
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Loader2 className="animate-spin" />
          Loading announcements...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertTriangle />
          {error}
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <p className="text-gray-600">No announcements to display.</p>
      )}

      <div className="space-y-4">
        {announcements.map((ann) => (
          <Card key={ann.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{ann.title}</CardTitle>
                <Badge style={{ backgroundColor: ann.badge_color, color: 'white' }} className="capitalize text-xs px-2 py-1 rounded">
                  {ann.badge_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p>{ann.description}</p>
              <p className="mt-2 text-sm text-gray-600">
                By {ann.author_name} on {new Date(ann.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

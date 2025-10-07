'use client';

import { useState, useEffect } from 'react';
import { Plus, Send, Calendar, Users, AlertCircle, Trash2, Pin } from 'lucide-react';
import { HEIAdminAPIClient } from '@/lib/api/hei-admin-client';
import { Announcement, CreateAnnouncement } from '@/types/hei-admin-types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const client = new HEIAdminAPIClient();

  useEffect(() => {
    loadAnnouncements();
  }, [currentPage]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.getAnnouncements(currentPage, 10);
      
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        const data = response.data.data || response.data;
        const total = response.data.totalPages || 1;
        
        setAnnouncements(Array.isArray(data) ? data : []);
        setTotalPages(total);
      } else {
        setError(response.error || 'Failed to load announcements');
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setError('An error occurred while loading announcements');
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await client.deleteAnnouncement(announcementId);
      if (response.success) {
        loadAnnouncements();
      } else {
        alert('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('An error occurred while deleting the announcement');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
      case 'normal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const lowerPriority = priority.toLowerCase();
    if (lowerPriority === 'urgent' || lowerPriority === 'critical' || lowerPriority === 'high') {
      return <AlertCircle className="w-4 h-4" />;
    }
    return null;
  };

  const getBadgeStyle = (badgeColor: string) => {
    return {
      backgroundColor: badgeColor || '#6366f1',
      color: '#ffffff',
    };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600 mt-1">Create and manage announcements for mentors and schools</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Announcement
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      {/* Announcements List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : !announcements || announcements.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No announcements yet</h3>
          <p className="text-gray-600 mb-4">Create your first announcement to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Announcement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{announcement.title}</h3>
                    
                    {/* Badge Type */}
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={getBadgeStyle(announcement.badgeColor)}
                    >
                      {announcement.badgeType}
                    </span>

                    {/* Priority Badge */}
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(announcement.priority)}`}
                    >
                      {getPriorityIcon(announcement.priority)}
                      {announcement.priority.toUpperCase()}
                    </span>

                    {/* Pinned Badge */}
                    {announcement.isPinned && (
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <Pin className="w-3 h-3" />
                        PINNED
                      </span>
                    )}

                    {/* New Badge */}
                    {announcement.isNew && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{announcement.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">By {announcement.authorName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="capitalize">{announcement.authorRole.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <CreateAnnouncementModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadAnnouncements();
          }}
        />
      )}
    </div>
  );
}

// Create Announcement Modal Component
function CreateAnnouncementModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<Partial<CreateAnnouncement>>({
    title: '',
    description: '',
    badgeType: 'general', // ✅ FIXED: Use 'general' (only valid enum value)
    badgeColor: '#6366f1',
    priority: 'medium',
    targetAudience: [],
    isPinned: false,
  });
  const [loading, setLoading] = useState(false);

  const client = new HEIAdminAPIClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetAudience || formData.targetAudience.length === 0) {
      alert('Please select at least one target audience');
      return;
    }

    setLoading(true);

    try {
      const response = await client.createAnnouncement(formData as CreateAnnouncement);
      if (response.success) {
        onSuccess();
      } else {
        alert(response.error || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('An error occurred while creating the announcement');
    } finally {
      setLoading(false);
    }
  };

  const toggleAudience = (audience: string) => {
    setFormData((prev) => ({
      ...prev,
      targetAudience: prev.targetAudience?.includes(audience)
        ? prev.targetAudience.filter((a) => a !== audience)
        : [...(prev.targetAudience || []), audience],
    }));
  };

  // ✅ FIXED: Only use 'general' badge type (matches DB enum)
  const badgeTypes = ['general'];
  
  const badgeColors = [
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Announcement</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter announcement title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter announcement description"
            />
          </div>

          {/* Badge Type - Hidden since only 'general' is valid */}
          <input type="hidden" name="badgeType" value="general" />

          {/* Badge Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Badge Color
            </label>
            <div className="flex gap-2">
              {badgeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, badgeColor: color.value })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.badgeColor === color.value
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience *
            </label>
            <div className="space-y-2">
              {['hei_mentor', 'school_admin', 'teacher', 'student'].map((audience) => (
                <label key={audience} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.targetAudience?.includes(audience) || false}
                    onChange={() => toggleAudience(audience)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 capitalize">
                    {audience.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pin Announcement */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned || false}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Pin this announcement</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.targetAudience?.length}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

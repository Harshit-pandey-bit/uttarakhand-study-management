// components/assignments/AssignmentAttachments.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Paperclip,
  Download,
  FileText,
  Image,
  FileType,
  ExternalLink,
  File,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { AssignmentAttachmentDto } from '@/types/api';

interface AssignmentAttachmentsProps {
  assignmentId: string;
}

export default function AssignmentAttachments({ assignmentId }: AssignmentAttachmentsProps) {
  const [attachments, setAttachments] = useState<AssignmentAttachmentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAttachments();
  }, [assignmentId]);

  const loadAttachments = async () => {
    try {
      const response = await apiClient.getAssignmentAttachments(assignmentId);
      if (response.data && !response.error) {
        const newAttachments = response.data
        setAttachments(prev => [newAttachments]);
      }
    } catch (error) {
      console.error('Failed to load attachments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (attachment: AssignmentAttachmentDto) => {
    setDownloadingFiles(prev => new Set([...prev, attachment.id]));
    
    try {
      // Create download link
      const link = document.createElement('a');
      link.href = attachment.downloadUrl;
      link.download = attachment.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachment.id);
        return newSet;
      });
    }
  };

  const getFileIcon = (fileType: string | undefined | null) => {
  // Add null/undefined check and provide fallback
    if (!fileType) return <File className="h-5 w-5 text-gray-500" />;
    
    // Convert to lowercase for case-insensitive comparison
    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileType className="h-5 w-5 text-blue-500" />;
    if (type.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
};

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Paperclip className="h-5 w-5" />
            <span>Assignment Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading attachments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Paperclip className="h-5 w-5" />
            <span>Assignment Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No additional resources provided</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Paperclip className="h-5 w-5 text-blue-600" />
          <span>Assignment Resources</span>
          <Badge variant="secondary">{attachments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getFileIcon(attachment.fileType)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{attachment.filename}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatFileSize(attachment.fileSize)}</span>
                    <span>•</span>
                    <span>Uploaded {new Date(attachment.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  disabled={downloadingFiles.has(attachment.id)}
                >
                  {downloadingFiles.has(attachment.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(attachment.downloadUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

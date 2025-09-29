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
  const [loading, setLoading] = useState(true);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAttachments();
  }, [assignmentId]);

  const loadAttachments = async () => {
    try {
      const response = await apiClient.getAssignmentAttachments(assignmentId);
      if (response.data && !response.error) {
        const newAttachments = response.data
        setAttachments(prev => [...prev, newAttachments]);
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
    if (!fileType) return <File className="h-6 w-6 text-gray-500" />;

    // Convert to lowercase for case-insensitive comparison
    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="h-6 w-6 text-blue-500" />;
    if (type.includes('image')) return <Image className="h-6 w-6 text-green-500" />;
    return <File className="h-6 w-6 text-gray-500" />;
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
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Paperclip className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl">Assignment Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center space-x-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading resources...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attachments.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Paperclip className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl">Assignment Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Paperclip className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500">No additional resources provided</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Paperclip className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl">Assignment Resources</span>
          </div>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            {attachments.length} {attachments.length === 1 ? 'file' : 'files'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {attachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  {getFileIcon(attachment.fileType)}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">{attachment.filename}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <span className="font-medium">{formatFileSize(attachment.fileSize)}</span>
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
                  className="border-gray-300 hover:border-gray-400"
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
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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

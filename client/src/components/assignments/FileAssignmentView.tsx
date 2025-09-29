'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Upload,
  CheckCircle,
  ExternalLink,
  File,
  Send,
  Image,
  FileType,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api/client';
import {
  AssignmentDto,
  AssignmentStatus,
  AssignmentAttachmentDto,
  FileUploadResponseDto,
  SubmitAssignmentDto
} from '@/types/api';

interface FileAssignmentViewProps {
  assignment: AssignmentDto;
  onSubmissionComplete: () => void;
}

export default function FileAssignmentView({ 
  assignment, 
  onSubmissionComplete 
}: FileAssignmentViewProps) {
  const { user } = useAuth();

  // State management
  const [attachments, setAttachments] = useState<AssignmentAttachmentDto[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  useEffect(() => {
    loadAssignmentResources();
  }, [assignment.id]);

  const loadAssignmentResources = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAssignmentAttachments(assignment.id);
      if (response.data && !response.error) {
        // Handle single attachment or array of attachments
        const attachmentData = Array.isArray(response.data) ? response.data : [response.data];
        setAttachments(attachmentData);
      } else {
        setAttachments([]);
      }
    } catch (error) {
      console.error('Failed to load assignment resources:', error);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (attachment: AssignmentAttachmentDto) => {
    setDownloading(prev => new Set([...prev, attachment.id]));
    
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
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachment.id);
        return newSet;
      });
    }
  };

  const getFileIcon = (attachment: AssignmentAttachmentDto) => {
    // First try to use fileType if available
    if (attachment.fileType) {
      const type = attachment.fileType.toLowerCase();
      if (type.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
      if (type.includes('word') || type.includes('document')) return <FileType className="h-5 w-5 text-blue-500" />;
      if (type.includes('image')) return <Image className="h-5 w-5 text-green-500" />;
    }

    // Fallback to filename extension
    const filename = attachment.filename || '';
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    
    switch (extension) {
      case 'pdf': 
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileType className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUploadedFiles: FileUploadResponseDto[] = [];

      for (const file of Array.from(files)) {
        // Validate file type (PDF, images, docs)
        const validTypes = [
          'application/pdf', 
          'image/jpeg', 
          'image/png', 
          'image/gif',
          'image/bmp',
          'application/msword', 
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!validTypes.includes(file.type)) {
          alert(`File ${file.name} is not a supported format. Please upload PDF, images, or Word documents.`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`File ${file.name} is too large. Maximum size is 10MB.`);
          continue;
        }

        // Use the API client's uploadAssignmentFile method
        const response = await apiClient.uploadAssignmentFile(file, assignment.id);
        
        if (response.error) {
          throw new Error(`Failed to upload ${file.name}: ${response.error}`);
        }

        if (response.data) {
          newUploadedFiles.push(response.data);
        }
      }

      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload some files. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedFile = async (fileUrl: string, fileName: string) => {
    try {
      // Extract file path from URL for deletion
      const filePath = fileUrl.split('/').slice(-3).join('/');
      const response = await apiClient.deleteAssignmentFile(filePath);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setUploadedFiles(prev => prev.filter(f => f.fileUrl !== fileUrl));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to remove file. Please try again.');
    }
  };

  const handleSubmitAssignment = async () => {
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const submitData: SubmitAssignmentDto = {
        assignmentId: assignment.id,
        fileUrls: uploadedFiles.map(f => f.fileUrl)
      };

      const response = await apiClient.submitAssignment(submitData);

      if (response.error) {
        throw new Error(response.error);
      }

      onSubmissionComplete();
      alert('Assignment submitted successfully!');

    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Check if assignment is already submitted
  if (assignment.status === AssignmentStatus.SUBMITTED || assignment.status === AssignmentStatus.GRADED) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Submitted</h2>
          <p className="text-gray-600 mb-4">
            Your assignment has been submitted successfully.
          </p>
          {assignment.score !== undefined && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {assignment.score}/{assignment.totalMarks}
                </p>
                <p className="text-sm text-green-600">
                  {((assignment.score / assignment.totalMarks) * 100).toFixed(1)}%
                </p>
                {assignment.grade && (
                  <p className="text-lg font-medium text-green-700 mt-1">
                    Grade: {assignment.grade}
                  </p>
                )}
              </div>
              {assignment.feedback && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Teacher Feedback</h4>
                  <p className="text-sm text-green-700">{assignment.feedback}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Assignment Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How to Complete This Assignment:</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="inline-block w-6 h-6 text-center text-xs font-bold bg-blue-200 rounded-full mt-0.5">1</span>
                <span>Download any assignment materials provided below</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="inline-block w-6 h-6 text-center text-xs font-bold bg-blue-200 rounded-full mt-0.5">2</span>
                <span>Solve the questions on paper or create your solution digitally</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="inline-block w-6 h-6 text-center text-xs font-bold bg-blue-200 rounded-full mt-0.5">3</span>
                <span>Scan/photograph your work or save as PDF if created digitally</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="inline-block w-6 h-6 text-center text-xs font-bold bg-blue-200 rounded-full mt-0.5">4</span>
                <span>Upload your solution file(s) below and submit</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-green-600" />
            <span>Assignment Materials</span>
            <Badge variant="secondary">{attachments.length} files</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading materials...</span>
            </div>
          ) : attachments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No additional materials provided</p>
            </div>
          ) : (
            <div className="space-y-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(attachment)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{attachment.filename}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{formatFileSize(attachment.fileSize || 0)}</span>
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
                      disabled={downloading.has(attachment.id)}
                    >
                      {downloading.has(attachment.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Download
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
          )}
        </CardContent>
      </Card>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-purple-600" />
            <span>Submit Your Solution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : uploading
                ? 'border-gray-200 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-3">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                <p className="text-lg font-medium text-gray-700">Uploading files...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    {dragActive ? 'Drop files here' : 'Upload your solution files'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag & drop or click to browse
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploading}
                >
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500">
                  Supports PDF, images (JPG, PNG, GIF, BMP), and Word documents up to 10MB each
                </p>
              </div>
            )}
          </div>

          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.filename}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUploadedFile(file.fileUrl, file.filename)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {uploadedFiles.length > 0 && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={handleSubmitAssignment}
                disabled={submitting || uploadedFiles.length === 0}
                className="bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Assignment...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

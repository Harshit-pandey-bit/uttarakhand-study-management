// components/assignments/FileUploadZone.tsx
'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  FileType
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { FileUploadResponseDto } from '@/types/api';

interface FileUploadZoneProps {
  assignmentId?: string;
  onFilesUploaded: (files: FileUploadResponseDto[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
  existingFiles?: FileUploadResponseDto[];
}

export default function FileUploadZone({
  assignmentId,
  onFilesUploaded,
  maxFiles = 5,
  maxSize = 10,
  disabled = false,
  existingFiles = []
}: FileUploadZoneProps) {
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponseDto[]>(existingFiles);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;

    setUploading(true);
    const newUploadedFiles: FileUploadResponseDto[] = [];

    try {
      for (const file of acceptedFiles) {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        // Upload single file
        const response = await apiClient.uploadAssignmentFile(file, assignmentId);
        
        if (response.error) {
          throw new Error(`Failed to upload ${file.name}: ${response.error}`);
        }

        if (response.data) {
          newUploadedFiles.push(response.data);
        }
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      }

      const allFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(allFiles);
      onFilesUploaded(allFiles);

    } catch (error) {
      console.error('Upload error:', error);
      // Handle error - show toast notification
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [assignmentId, disabled, uploadedFiles, onFilesUploaded]);

  const removeFile = async (fileUrl: string, fileName: string) => {
    try {
      // Extract file path from URL for deletion
      const filePath = fileUrl.split('/').slice(-3).join('/');
      await apiClient.deleteAssignmentFile(filePath);
      
      const updatedFiles = uploadedFiles.filter(f => f.fileUrl !== fileUrl);
      setUploadedFiles(updatedFiles);
      onFilesUploaded(updatedFiles);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: disabled || uploading || uploadedFiles.length >= maxFiles,
    maxFiles: maxFiles - uploadedFiles.length,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx': return <FileType className="h-4 w-4 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <Image className="h-4 w-4 text-green-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {uploadedFiles.length < maxFiles && (
        <Card className={`border-2 border-dashed transition-colors ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : disabled 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`text-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <input {...getInputProps()} />
              <Upload className={`mx-auto h-12 w-12 mb-4 ${
                disabled ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? 'Drop files here' : 'Upload assignment files'}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag & drop files here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Supports PDF, DOC, DOCX, JPG, PNG up to {maxSize}MB each. Max {maxFiles} files.
              </p>
              {!disabled && (
                <Button type="button" variant="outline" className="mt-4" disabled={uploading}>
                  Choose Files
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.filename)}
                    <div>
                      <p className="font-medium text-gray-900">{file.filename}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.fileUrl, file.filename)}
                      disabled={disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Uploading...</h4>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{filename}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  const [uploading, setUploading] = useState(false);
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
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <Image className="h-5 w-5 text-green-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Upload Zone */}
      {uploadedFiles.length < maxFiles && (
        <Card className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50 shadow-lg' 
            : disabled 
              ? 'border-gray-200 bg-gray-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
        }`}>
          <CardContent 
            {...getRootProps()} 
            className="p-12 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center space-y-6">
              <div className={`p-6 rounded-full transition-colors duration-300 ${
                isDragActive 
                  ? 'bg-blue-100' 
                  : disabled 
                    ? 'bg-gray-100' 
                    : 'bg-gray-100 group-hover:bg-gray-200'
              }`}>
                <Upload className={`h-12 w-12 ${
                  isDragActive 
                    ? 'text-blue-500' 
                    : disabled 
                      ? 'text-gray-400' 
                      : 'text-gray-500'
                }`} />
              </div>
              
              <div className="space-y-3 text-center">
                <h3 className={`text-2xl font-bold ${
                  isDragActive ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {isDragActive ? 'Drop files here' : 'Upload assignment files'}
                </h3>
                
                <p className="text-gray-500 text-lg max-w-md">
                  Drag & drop files here, or click to browse
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">PDF</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">DOC</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">DOCX</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">JPG</Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">PNG</Badge>
                </div>
                
                <p className="text-sm text-gray-400">
                  Up to {maxSize}MB each • Maximum {maxFiles} files
                </p>
              </div>

              {!disabled && (
                <Button 
                  type="button" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Choose Files
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                Uploaded Files
              </h4>
              <Badge className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                {uploadedFiles.length}/{maxFiles} files
              </Badge>
            </div>
            
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getFileIcon(file.filename)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded {new Date(file.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.fileUrl, file.filename)}
                    disabled={disabled}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <Card className="border-0 shadow-md bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <h4 className="text-xl font-bold text-blue-800">Uploading files...</h4>
            </div>
            
            <div className="space-y-4">
              {Object.entries(uploadProgress).map(([filename, progress]) => (
                <div key={filename} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-blue-700">{filename}</span>
                    <span className="text-blue-600">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-blue-100" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

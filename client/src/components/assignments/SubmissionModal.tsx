// components/assignments/SubmissionModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Send, X } from 'lucide-react';
import { AssignmentDto, FileUploadResponseDto, SubmissionFormat } from '@/types/api';
import { apiClient } from '@/lib/api/client';
import FileUploadZone from './FileUploadZone';
import AssignmentAttachments from './AssignmentAttachments';

interface SubmissionModalProps {
  assignment: AssignmentDto;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function SubmissionModal({
  assignment,
  isOpen,
  onClose,
  onSubmitted
}: SubmissionModalProps) {
  const [submissionText, setSubmissionText] = useState<string>('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponseDto[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('resources');

  const handleSubmit = async () => {
    if (!submissionText && uploadedFiles.length === 0) {
      return; // Show validation error
    }

    setSubmitting(true);
    try {
      const response = await apiClient.submitAssignment({
        assignmentId: assignment.id,
        fileUrls: uploadedFiles.map(f => f.fileUrl),
        submissionText: submissionText.trim() || undefined
      });

      if (response.error) {
        throw new Error(response.error);
      }

      onSubmitted();
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
      // Show error toast
    } finally {
      setSubmitting(false);
    }
  };

  const supportsFiles = assignment.submissionFormat.some(format => 
    [SubmissionFormat.PDF, SubmissionFormat.DOC, SubmissionFormat.IMAGE].includes(format)
  );

  const supportsText = assignment.submissionFormat.includes(SubmissionFormat.TEXT);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{assignment.title}</DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge>{assignment.subject}</Badge>
                <Badge variant="outline">Due: {new Date(assignment.dueDate).toLocaleDateString()}</Badge>
                <Badge variant="outline">{assignment.totalMarks} marks</Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="submission">Submit Work</TabsTrigger>
            <TabsTrigger value="questions">Questions ({assignment.questions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Assignment Instructions</h3>
              <p className="text-blue-800">{assignment.description}</p>
              {assignment.teacherNotes && (
                <div className="mt-3 pt-3 border-t border-blue-300">
                  <p className="text-sm text-blue-700">{assignment.teacherNotes}</p>
                </div>
              )}
            </div>

            <AssignmentAttachments assignmentId={assignment.id} />
          </TabsContent>

          <TabsContent value="submission" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Submit Your Work</h3>
                <div className="flex space-x-1">
                  {assignment.submissionFormat.map(format => (
                    <Badge key={format} variant="outline" className="text-xs">
                      {format.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {supportsFiles && (
                <div>
                  <h4 className="font-medium mb-2">File Upload</h4>
                  <FileUploadZone
                    assignmentId={assignment.id}
                    onFilesUploaded={setUploadedFiles}
                    maxFiles={5}
                    maxSize={10}
                  />
                </div>
              )}

              {supportsText && (
                <div>
                  <h4 className="font-medium mb-2">Text Submission</h4>
                  <Textarea
                    placeholder="Type your answer here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    rows={8}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting || (!submissionText && uploadedFiles.length === 0)}
                >
                  {submitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment Questions</h3>
              {assignment.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Question {question.questionNumber}
                    </span>
                    <Badge variant="outline">{question.marks} marks</Badge>
                  </div>
                  <p className="text-gray-900 mb-2">{question.question}</p>
                  {question.options && question.options.length > 0 && (
                    <div className="space-y-1">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="text-sm text-gray-700">
                          {String.fromCharCode(97 + optIndex)}) {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

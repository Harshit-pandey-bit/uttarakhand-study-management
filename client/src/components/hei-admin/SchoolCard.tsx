'use client';

import { School, Users, MapPin, Phone, Mail, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SchoolCardProps {
  school: {
    id: string;
    name: string;
    location: string;
    establishedYear: number;
    studentCount: number;
    principalName: string;
    contactEmail: string;
    contactPhone: string;
    partnershipStatus: 'active' | 'inactive' | 'pending';
    partnershipDate?: string;
    programs: string[];
    image?: string;
  };
  onRemove?: (schoolId: string) => void;
}

export default function SchoolCard({ school, onRemove }: SchoolCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* School Image */}
      <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
        <School className="h-16 w-16 text-white opacity-80" />
      </div>

      <div className="p-6">
        {/* Header with Status */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {school.name}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(school.partnershipStatus)}`}>
            {school.partnershipStatus.charAt(0).toUpperCase() + school.partnershipStatus.slice(1)}
          </span>
        </div>

        {/* School Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{school.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            <span>{school.studentCount} Students</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Est. {school.establishedYear}</span>
          </div>

          {school.partnershipDate && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Partnership: {new Date(school.partnershipDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Principal Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-900">Principal: {school.principalName}</p>
        </div>

        {/* Contact Info */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{school.contactEmail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{school.contactPhone}</span>
          </div>
        </div>

        {/* Programs */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Programs:</p>
          <div className="flex flex-wrap gap-1">
            {school.programs.map((program, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {program}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View Details
          </Button>
          {onRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(school.id)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

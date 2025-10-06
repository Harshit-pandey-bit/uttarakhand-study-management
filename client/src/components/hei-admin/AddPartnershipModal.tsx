'use client';

import { useState } from 'react';
import { X, Search, School, MapPin, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface School {
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
}

interface AddPartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
  onAddPartnership: (schoolId: string) => void;
}

export default function AddPartnershipModal({ 
  isOpen, 
  onClose, 
  schools, 
  onAddPartnership 
}: AddPartnershipModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  if (!isOpen) return null;

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.principalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || school.location.includes(selectedLocation);
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(schools.map(school => school.location.split(', ')[1]))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Partnership
              </h2>
              <p className="text-sm text-gray-600">
                Select from available schools to create partnerships
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search schools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredSchools.length} of {schools.length} available schools
          </div>
        </div>

        {/* Schools List */}
        <div className="overflow-y-auto max-h-96">
          {filteredSchools.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <School className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Schools Found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or location filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSchools.map((school) => (
                <div key={school.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                          <School className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {school.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {school.location}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {school.studentCount} students
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Principal: {school.principalName}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">Programs:</span>
                              {school.programs.slice(0, 3).map((program, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                                >
                                  {program}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => onAddPartnership(school.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-4"
                    >
                      Add Partnership
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

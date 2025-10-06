'use client';

import SchoolCard from './SchoolCard';

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

interface PartnershipGridProps {
  schools: School[];
  onRemovePartnership: (schoolId: string) => void;
}

export default function PartnershipGrid({ schools, onRemovePartnership }: PartnershipGridProps) {
  if (schools.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Partnerships Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building educational partnerships by adding schools to your network.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Current Partnerships ({schools.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            school={school}
            onRemove={onRemovePartnership}
          />
        ))}
      </div>
    </div>
  );
}

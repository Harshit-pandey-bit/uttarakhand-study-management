'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, School, Users, MapPin, Phone, Mail } from 'lucide-react';
import SchoolCard from '@/components/hei-admin/SchoolCard';
import AddPartnershipModal from '@/components/hei-admin/AddPartnershipModal';
import PartnershipGrid from '@/components/hei-admin/PartnershipGrid';

// Types for TypeScript
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

export default function PartnershipPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [unlinkedSchools, setUnlinkedSchools] = useState<School[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration
  useEffect(() => {
    // Simulate API fetch for partnered schools
    const partneredSchools: School[] = [
      {
        id: '1',
        name: 'Green Valley High School',
        location: 'Mumbai, Maharashtra',
        establishedYear: 1995,
        studentCount: 1200,
        principalName: 'Dr. Priya Sharma',
        contactEmail: 'principal@greenvalley.edu',
        contactPhone: '+91-9876543210',
        partnershipStatus: 'active',
        partnershipDate: '2023-06-15',
        programs: ['Science', 'Mathematics', 'Arts'],
        image: '/api/placeholder/300/200'
      },
      {
        id: '2',
        name: 'Blue Ridge International School',
        location: 'Delhi, NCR',
        establishedYear: 2001,
        studentCount: 800,
        principalName: 'Mr. Rajesh Kumar',
        contactEmail: 'admin@blueridge.edu',
        contactPhone: '+91-9876543211',
        partnershipStatus: 'active',
        partnershipDate: '2023-08-20',
        programs: ['Commerce', 'Science'],
        image: '/api/placeholder/300/200'
      },
      {
        id: '3',
        name: 'Sunrise Academy',
        location: 'Bangalore, Karnataka',
        establishedYear: 1988,
        studentCount: 1500,
        principalName: 'Ms. Anjali Nair',
        contactEmail: 'contact@sunriseacademy.edu',
        contactPhone: '+91-9876543212',
        partnershipStatus: 'pending',
        partnershipDate: '2024-01-10',
        programs: ['Arts', 'Commerce'],
        image: '/api/placeholder/300/200'
      }
    ];

    // Simulate API fetch for unlinked schools
    const availableSchools: School[] = [
      {
        id: '4',
        name: 'Golden Gate School',
        location: 'Chennai, Tamil Nadu',
        establishedYear: 1990,
        studentCount: 900,
        principalName: 'Dr. Meera Krishnan',
        contactEmail: 'info@goldengate.edu',
        contactPhone: '+91-9876543213',
        partnershipStatus: 'inactive',
        programs: ['Science', 'Arts'],
        image: '/api/placeholder/300/200'
      },
      {
        id: '5',
        name: 'Silver Oak International',
        location: 'Pune, Maharashtra',
        establishedYear: 2005,
        studentCount: 600,
        principalName: 'Mr. Vikram Singh',
        contactEmail: 'admin@silveroaK.edu',
        contactPhone: '+91-9876543214',
        partnershipStatus: 'inactive',
        programs: ['Commerce', 'Mathematics'],
        image: '/api/placeholder/300/200'
      },
      {
        id: '6',
        name: 'Crystal Public School',
        location: 'Hyderabad, Telangana',
        establishedYear: 1985,
        studentCount: 1100,
        principalName: 'Mrs. Lakshmi Reddy',
        contactEmail: 'crystal@crystalschool.edu',
        contactPhone: '+91-9876543215',
        partnershipStatus: 'inactive',
        programs: ['Science', 'Arts', 'Commerce'],
        image: '/api/placeholder/300/200'
      }
    ];

    setTimeout(() => {
      setSchools(partneredSchools);
      setUnlinkedSchools(availableSchools);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddPartnership = (schoolId: string) => {
    const schoolToAdd = unlinkedSchools.find(school => school.id === schoolId);
    if (schoolToAdd) {
      const newPartnership = {
        ...schoolToAdd,
        partnershipStatus: 'pending' as const,
        partnershipDate: new Date().toISOString().split('T')[0]
      };
      
      setSchools([...schools, newPartnership]);
      setUnlinkedSchools(unlinkedSchools.filter(school => school.id !== schoolId));
      setIsModalOpen(false);
    }
  };

  const handleRemovePartnership = (schoolId: string) => {
    const schoolToRemove = schools.find(school => school.id === schoolId);
    if (schoolToRemove) {
      const removedSchool = {
        ...schoolToRemove,
        partnershipStatus: 'inactive' as const,
        partnershipDate: undefined
      };
      
      setUnlinkedSchools([...unlinkedSchools, removedSchool]);
      setSchools(schools.filter(school => school.id !== schoolId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <School className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">School Partnerships</h1>
                <p className="text-gray-600">
                  Manage your educational institution partnerships
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Partnership</span>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active Partnerships</h3>
                <p className="text-3xl font-bold text-green-600">
                  {schools.filter(school => school.partnershipStatus === 'active').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {schools.filter(school => school.partnershipStatus === 'pending').length}
                </p>
              </div>
              <MapPin className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Available Schools</h3>
                <p className="text-3xl font-bold text-blue-600">{unlinkedSchools.length}</p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Partnership Grid */}
        <PartnershipGrid 
          schools={schools} 
          onRemovePartnership={handleRemovePartnership}
        />

        {/* Add Partnership Modal */}
        <AddPartnershipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          schools={unlinkedSchools}
          onAddPartnership={handleAddPartnership}
        />
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Menu, 
  GraduationCap, 
  Settings, 
  LogOut,
  Wifi,
  WifiOff
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: string;
  };
  onMenuClick: () => void;
  isMobile: boolean;
}

export function DashboardHeader({ user, onMenuClick, isMobile }: DashboardHeaderProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications] = useState(3); // Mock notification count
  const router = useRouter();

  const handleLogout = () => {
    apiClient.logout();
    router.push('/auth/login');
  };

  const getRoleColor = (role: string) => {
    const colors = {
      student: 'bg-indigo-100 text-indigo-800',
      teacher: 'bg-purple-100 text-purple-800',
      'hei-mentor': 'bg-teal-100 text-teal-800',
      'hei-admin': 'bg-orange-100 text-orange-800',
      'school-admin': 'bg-rose-100 text-rose-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: 'Student',
      teacher: 'Teacher',
      'hei-mentor': 'HEI Mentor',
      'hei-admin': 'HEI Admin',
      'school-admin': 'School Admin',
    };
    return labels[role as keyof typeof labels] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 lg:px-6">
        <div className="flex justify-between items-center py-3">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900">EduBridge</h1>
                <p className="text-xs text-gray-500">Government School Mentoring</p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Network Status (Mobile) */}
            {isMobile && (
              <div className="flex items-center space-x-1">
                {isOnline ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                      {user.full_name}
                    </p>
                    <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

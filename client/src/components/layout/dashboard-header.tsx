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
  WifiOff,
  ChevronDown,
  Sparkles
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
      student: 'from-indigo-500 to-purple-500',
      teacher: 'from-purple-500 to-pink-500',
      'hei-mentor': 'from-teal-500 to-cyan-500',
      'hei-admin': 'from-orange-500 to-red-500',
      'school-admin': 'from-rose-500 to-pink-500',
    };
    return colors[role as keyof typeof colors] || 'from-gray-500 to-gray-600';
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
    <header className="relative bg-white/98 backdrop-blur-xl border-b border-gray-100/60 sticky top-0 z-50 shadow-sm">
      {/* Compact decorative gradient top border */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getRoleColor(user.role)}`} />
      
      <div className="w-full px-3 lg:px-4">
        <div className="flex justify-between items-center py-2">
          {/* Compact Left Section */}
          <div className="flex items-center space-x-3">
            {/* Compact mobile menu button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="p-2 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group"
              >
                <Menu className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </Button>
            )}
            
            {/* Compact brand section */}
            <div className="flex items-center space-x-2 group cursor-default">
              {/* Smaller logo */}
              <div className="relative">
                <div className={`w-8 h-8 bg-gradient-to-br ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                  <GraduationCap className="h-4 w-4 text-white" />
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-50" />
                </div>
                {/* Compact online status */}
                {isOnline && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Compact brand text */}
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  UK-GSMP
                </h1>
              </div>
            </div>
          </div>

          {/* Compact Right Section */}
          <div className="flex items-center space-x-1">
            {/* Compact network status */}
            {isMobile && (
              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                isOnline 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {isOnline ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
              </div>
            )}

            {/* Compact notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group"
            >
              <Bell className="h-4 w-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
              {notifications > 0 && (
                <>
                  {/* Compact notification badge */}
                  <div className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {notifications}
                  </div>
                </>
              )}
            </Button>

            {/* Compact User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100/70 transition-all duration-200 group relative"
                >
                  {/* Compact Avatar */}
                  <div className="relative">
                    <Avatar className="h-7 w-7 ring-1 ring-gray-200 shadow-sm transition-all duration-200 group-hover:ring-2 group-hover:ring-gray-300">
                      <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(user.role)} text-white font-semibold text-xs`}>
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {/* Compact online status */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white" />
                  </div>
                  
                  {/* Compact user info - only show on larger screens */}
                  <div className="hidden md:flex flex-col items-start">
                    <p className="text-xs font-semibold text-gray-900 truncate max-w-20">
                      {user.full_name}
                    </p>
                    <Badge className={`text-xs px-1.5 py-0.5 rounded-md font-medium bg-gradient-to-r ${getRoleColor(user.role)} text-white`}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </div>
                  
                  {/* Compact chevron */}
                  <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              
              {/* Compact Dropdown */}
              <DropdownMenuContent 
                align="end" 
                className="w-48 rounded-xl border-0 shadow-lg bg-white/98 backdrop-blur-xl p-1"
              >
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 ring-1 ring-gray-100">
                      <AvatarFallback className={`bg-gradient-to-br ${getRoleColor(user.role)} text-white font-semibold text-xs`}>
                        {user.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900 truncate">{user.full_name}</span>
                      <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="my-1 bg-gray-100" />
                
                <DropdownMenuItem className="rounded-lg mx-0.5 px-3 py-2 cursor-pointer transition-all duration-150 hover:bg-gray-50 group text-sm">
                  <Settings className="mr-2 h-3 w-3 text-gray-500 group-hover:text-gray-700 transition-colors" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="rounded-lg mx-0.5 px-3 py-2 cursor-pointer transition-all duration-150 hover:bg-red-50 text-red-600 group text-sm"
                >
                  <LogOut className="mr-2 h-3 w-3 group-hover:scale-105 transition-transform" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

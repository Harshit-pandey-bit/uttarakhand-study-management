'use client'
import React, { useState } from 'react';
import ProjectCard,{ MilestoneStatus } from './active/ProjectCard';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dummy data for active projects (can be replaced by API data later)


const ProjectsPage = () => {
  const router=useRouter()


  return (
   router.push('projects/active')
  )
};

export default ProjectsPage;

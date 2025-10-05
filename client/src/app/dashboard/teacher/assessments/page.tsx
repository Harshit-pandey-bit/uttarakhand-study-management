// assesment/page.tsx - Formative Only
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Presentation, Plus, Search, Calendar, Clock, 
  CheckCircle2, AlertCircle, Edit,
  Eye, Trash2, BarChart3, TrendingUp,
  FileText, Target, Lightbulb, Activity, X,
  PieChart, TrendingDown, AlertTriangle
} from 'lucide-react';
import { useRouter } from 'next/navigation';



export default function FormativeAssessmentsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/teacher/assessments/formative');
  }, [router]);

  return null;
}
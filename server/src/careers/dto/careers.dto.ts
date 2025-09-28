// server/src/careers/dto/careers.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsBoolean, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum DemandLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum DifficultyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export class SuccessStoryDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Priya Sharma' })
  name: string;

  @ApiProperty({ example: 'Dehradun, Uttarakhand' })
  location: string;

  @ApiProperty({ example: 'Born in a small village near Tehri...' })
  background: string;

  @ApiProperty({ example: 'Started with basic computer course...' })
  journey: string;

  @ApiProperty({ example: 'Wanted to use technology to solve problems...' })
  inspiration: string;

  @ApiProperty({ example: 'Senior Software Engineer at Microsoft' })
  currentRole: string;

  @ApiProperty({ example: 'Built apps used by millions globally' })
  achievement: string;

  @ApiProperty({ example: 'Hard work and curiosity can take you anywhere!' })
  quote: string;
}

export class DayInLifeDto {
  @ApiProperty({ example: 'Start day with coffee, check emails, daily standup meeting' })
  morning: string;

  @ApiProperty({ example: 'Code development, debugging, team collaboration' })
  afternoon: string;

  @ApiProperty({ example: 'Code review, planning for next day, learning new technologies' })
  evening: string;

  @ApiProperty({ example: 'Debugging complex issues, meeting tight deadlines' })
  challenges: string;
}

export class PathwayRouteDto {
  @ApiProperty({ example: 'Traditional Route' })
  route: string;

  @ApiProperty({ type: [String], example: ['12th Science', 'BTech', 'Internships', 'Job'] })
  steps: string[];

  @ApiProperty({ example: '4-6 years' })
  duration: string;

  @ApiProperty({ example: 'Intermediate' })
  difficulty: string;
}

export class CareerDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Software Engineer' })
  title: string;

  @ApiProperty({ example: 'software-engineer' })
  slug: string;

  @ApiProperty({ example: '👨‍💻' })
  emoji: string;

  @ApiProperty({ example: 'Design and develop software applications...' })
  description: string;

  @ApiProperty({ example: 'Technology' })
  category: string;

  @ApiProperty({ example: '₹8-25 LPA' })
  salaryRange: string;

  @ApiProperty({ enum: DemandLevel })
  demandLevel: DemandLevel;

  @ApiProperty({ example: `Bachelor''s in Computer Science` })
  educationLevel: string;

  @ApiProperty({ type: [String] })
  skills: string[];

  @ApiProperty({ example: 'Office or Remote work environment' })
  workEnvironment: string;

  @ApiProperty({ example: 'Code development, debugging, testing...' })
  typicalDay: string;

  @ApiProperty({ type: [String] })
  pros: string[];

  @ApiProperty({ type: [String] })
  cons: string[];

  @ApiProperty({ type: [String] })
  famousPersons: string[];

  @ApiProperty({ example: '12th Science → BTech → Internships → Job' })
  pathway: string;

  @ApiProperty({ example: 'India has over 4.3 million software developers!' })
  inspiringFact: string;

  @ApiProperty({ example: 'IIT Roorkee and Graphic Era offer excellent programs' })
  localConnection: string;

  @ApiProperty({ type: [String] })
  nextSteps: string[];

  @ApiProperty({ type: [SuccessStoryDto] })
  successStories: SuccessStoryDto[];

  @ApiProperty({ type: DayInLifeDto })
  dayInLife: DayInLifeDto;

  @ApiProperty({ type: [PathwayRouteDto] })
  pathways: PathwayRouteDto[];

  @ApiProperty({ example: true })
  isFeatured: boolean;
}

export class FeaturedCareerDto {
  @ApiProperty({ example: 'Software Engineer' })
  title: string;

  @ApiProperty({ example: 'Design and develop software applications' })
  description: string;

  @ApiProperty({ example: '👨‍💻' })
  icon: string;

  @ApiProperty({ example: 'Technology' })
  category: string;

  @ApiProperty({ enum: DemandLevel })
  demandLevel: DemandLevel;

  @ApiProperty({ example: `Bachelor''s Degree` })
  education: string;

  @ApiProperty({ type: [String] })
  famousPersons: string[];

  @ApiProperty({ example: '12th Science → BTech → Job' })
  pathway: string;

  @ApiProperty({ example: 'India is the second-largest tech talent pool!' })
  inspiringFact: string;

  @ApiProperty({ type: [String] })
  skills: string[];
}

export class PathwayStageDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Foundation (12th Grade)' })
  title: string;

  @ApiProperty({ example: '2 years' })
  duration: string;

  @ApiProperty({ example: 'Build strong foundation in mathematics and science' })
  description: string;

  @ApiProperty({ type: [String] })
  requirements: string[];

  @ApiProperty({ type: [String] })
  keySubjects: string[];

  @ApiProperty({ type: [String] })
  examinations: string[];

  @ApiProperty({ type: [String] })
  skillsToGain: string[];

  @ApiProperty({ type: [String] })
  nextOptions: string[];
}

export class AlternativeRouteDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Bootcamp Route' })
  routeName: string;

  @ApiProperty({ example: 'Fast-track coding bootcamp approach' })
  description: string;

  @ApiProperty({ example: '6-12 months' })
  duration: string;

  @ApiProperty({ type: [String] })
  advantages: string[];

  @ApiProperty({ type: [String] })
  challenges: string[];
}

export class LocalOpportunityDto {
  @ApiProperty({ example: 'University' })
  type: string;

  @ApiProperty({ example: 'IIT Roorkee' })
  institution: string;

  @ApiProperty({ example: 'Roorkee' })
  location: string;

  @ApiProperty({ type: [String] })
  programs: string[];

  @ApiProperty({ example: 'JEE Advanced qualified' })
  admissionCriteria: string;

  @ApiProperty({ required: false })
  website?: string;

  @ApiProperty({ required: false })
  contact?: string;
}

export class PathwayMilestoneDto {
  @ApiProperty({ example: 'Graduation' })
  stage: string;

  @ApiProperty({ example: `Complete Bachelor''s degree` })
  achievement: string;

  @ApiProperty({ example: '4 years' })
  timeframe: string;

  @ApiProperty({ example: 'Foundation for technical career' })
  importance: string;
}

export class CareerPathwayDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'Software Engineer' })
  careerTitle: string;

  @ApiProperty({ example: 'Technology' })
  category: string;

  @ApiProperty({ example: '4-6 years' })
  estimatedDuration: string;

  @ApiProperty({ enum: DifficultyLevel })
  difficultyLevel: DifficultyLevel;

  @ApiProperty({ type: [PathwayStageDto] })
  stages: PathwayStageDto[];

  @ApiProperty({ type: [AlternativeRouteDto] })
  alternativeRoutes: AlternativeRouteDto[];

  @ApiProperty({ type: [LocalOpportunityDto] })
  localOpportunities: LocalOpportunityDto[];

  @ApiProperty({ type: [PathwayMilestoneDto] })
  milestones: PathwayMilestoneDto[];
}

export class InspirationalQuoteDto {
  @ApiProperty({ example: 'c8f4d2e1-8b5a-4c3d-9e2f-1a6b7c8d9e0f' })
  id: string;

  @ApiProperty({ example: 'The future belongs to those who believe in the beauty of their dreams' })
  text: string;

  @ApiProperty({ example: 'Eleanor Roosevelt' })
  author: string;

  @ApiProperty({ example: 'Dreams' })
  category?: string;
}

export class CareerProgressDto {
  @ApiProperty()
  hollandCodeResults: {
    hasCompletedTest: boolean;
    recommendedCareers: string[];
    personalityType?: string;
    completionDate?: string;
  };

  @ApiProperty()
  progressStats: {
    assessmentCompleted: boolean;
    careersExplored: number;
    pathwaysViewed: number;
    totalProgress: number;
  };
}

export class StudentActivityDto {
  @ApiProperty({ 
    enum: ['career_explored', 'pathway_viewed', 'test_completed', 'story_read'],
    example: 'career_explored'
  })
  activityType: string;

  @ApiProperty({ example: 'software-engineer' })
  resourceId: string;

  @ApiProperty({ required: false })
  metadata?: object;
}

import { LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  courseId: string;
  creditUnit: number;
  grade: string;
  gradePoint: number;
}

export interface CourseOption {
  id: string;
  name: string;
  code: string;
  creditUnit: number;
}

export interface GraduationStatus {
  status: string;
  color: string;
  description: string;
  icon: LucideIcon;
}

export interface SavedResult {
  id: string;
  matricNumber: string;
  courses: Course[];
  gpa: number;
  date: string;
  graduationStatus: Omit<GraduationStatus, 'icon'>;
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

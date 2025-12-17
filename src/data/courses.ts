import { CourseOption, Grade } from '../types';

export const AVAILABLE_COURSES: CourseOption[] = [
  // Compulsory Courses
  { id: 'mit801', name: 'Introduction to Information Technology', code: 'MIT 801', creditUnit: 3 },
  { id: 'mit802', name: 'Introduction to Database Management', code: 'MIT 802', creditUnit: 3 },
  { id: 'mit803', name: 'Programming Languages', code: 'MIT 803', creditUnit: 3 },
  { id: 'mit804', name: 'Object-Oriented Programming', code: 'MIT 804', creditUnit: 3 },
  { id: 'mit805', name: 'Computer Systems and Organization', code: 'MIT 805', creditUnit: 3 },
  { id: 'mit806', name: 'IT and LAW', code: 'MIT 806', creditUnit: 3 },
  { id: 'mit808', name: 'Concepts and Application of E-Business', code: 'MIT 808', creditUnit: 2 },
  { id: 'mit811', name: 'Analysis and Design of Business Information Systems', code: 'MIT 811', creditUnit: 3 },
  { id: 'mit812', name: 'Computer Networks and Communication Protocol', code: 'MIT 812', creditUnit: 3 },
  { id: 'mit815', name: 'Internet Programming and Applications', code: 'MIT 815', creditUnit: 3 },
  { id: 'mit821', name: 'Software Systems', code: 'MIT 821', creditUnit: 3 },
  { id: 'mit824', name: 'Seminar on Current Topics in IT', code: 'MIT 824', creditUnit: 3 },
  { id: 'mit899', name: 'Project', code: 'MIT 899', creditUnit: 6 },
  // Elective Courses
  { id: 'mit807', name: 'AI and its Business Application', code: 'MIT 807', creditUnit: 3 },
  { id: 'mit809', name: 'Elements of Scientific Computing', code: 'MIT 809', creditUnit: 3 },
  { id: 'mit813', name: 'Advanced Database Management Systems', code: 'MIT 813', creditUnit: 3 },
  { id: 'mit814', name: 'Human Computer Interactions', code: 'MIT 814', creditUnit: 3 },
  { id: 'mit816', name: 'Data Warehousing & Business Intelligence', code: 'MIT 816', creditUnit: 3 },
  { id: 'mit817', name: 'Software Engineering', code: 'MIT 817', creditUnit: 3 },
  { id: 'mit822', name: 'Operating Systems', code: 'MIT 822', creditUnit: 3 },
  { id: 'mit823', name: 'Office Automation & Project Management', code: 'MIT 823', creditUnit: 3 },
];

export const COMPULSORY_COURSE_IDS = [
  'mit801', 'mit802', 'mit803', 'mit804', 'mit805', 'mit806',
  'mit808', 'mit811', 'mit812', 'mit815', 'mit821', 'mit824', 'mit899'
];

export const GRADE_SYSTEM: Record<Grade, number> = {
  'A': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 0
};

export const GRADE_COLORS: Record<Grade, string> = {
  'A': 'from-emerald-400 to-emerald-600',
  'B': 'from-blue-400 to-blue-600',
  'C': 'from-cyan-400 to-cyan-600',
  'D': 'from-amber-400 to-amber-600',
  'E': 'from-orange-400 to-orange-600',
  'F': 'from-red-400 to-red-600'
};

export const GRADES: Grade[] = ['A', 'B', 'C', 'D', 'E', 'F'];

export const getCourseById = (courseId: string): CourseOption | undefined => {
  return AVAILABLE_COURSES.find(course => course.id === courseId);
};

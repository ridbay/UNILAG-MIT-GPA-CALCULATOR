import jsPDF from 'jspdf';
import { Course } from '../types';
import { getCourseById } from '../data/courses';

interface ExportData {
  matricNumber: string;
  courses: Course[];
  gpa: number;
  gpaClass: string;
  totalUnitsTaken: number;
  totalUnitsPassed: number;
  totalGradePoints: number;
  graduationStatus: {
    status: string;
    description: string;
  };
}

export function exportToPDF(data: ExportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Helper function to center text
  const centerText = (text: string, y: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Header
  doc.setFillColor(16, 185, 129); // Emerald-500
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  centerText('UNIVERSITY OF LAGOS', yPos, 16);
  yPos += 8;
  centerText('Master of Information Technology Programme', yPos, 12);
  yPos += 8;
  centerText('GPA RESULT SUMMARY', yPos, 14);
  
  yPos = 55;
  doc.setTextColor(0, 0, 0);

  // Student Info Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'F');
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, yPos, pageWidth - 2 * margin, 25, 'S');
  
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Matriculation Number: ${data.matricNumber}`, margin + 5, yPos);
  doc.text(`Date Generated: ${new Date().toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })}`, pageWidth - margin - 60, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.text(`GPA: ${data.gpa.toFixed(2)} (${data.gpaClass})`, margin + 5, yPos);
  doc.text(`Status: ${data.graduationStatus.status}`, pageWidth - margin - 60, yPos);

  yPos += 20;

  // Summary Stats
  doc.setFillColor(16, 185, 129);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('SUMMARY', margin + 5, yPos + 6);
  
  yPos += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  
  const statsY = yPos;
  const colWidth = (pageWidth - 2 * margin) / 4;
  
  const stats = [
    { label: 'Total Courses', value: data.courses.length.toString() },
    { label: 'Units Taken', value: data.totalUnitsTaken.toString() },
    { label: 'Units Passed', value: data.totalUnitsPassed.toString() },
    { label: 'Grade Points', value: data.totalGradePoints.toFixed(0) }
  ];
  
  stats.forEach((stat, index) => {
    const x = margin + (index * colWidth);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(stat.label, x, statsY);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(stat.value, x, statsY + 7);
  });

  yPos += 20;

  // Course Table Header
  doc.setFillColor(16, 185, 129);
  doc.setTextColor(255, 255, 255);
  doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  
  const col1 = margin + 3;
  const col2 = margin + 25;
  const col3 = pageWidth - margin - 65;
  const col4 = pageWidth - margin - 50;
  const col5 = pageWidth - margin - 35;
  const col6 = pageWidth - margin - 15;
  
  doc.text('S/N', col1, yPos + 6);
  doc.text('Course', col2, yPos + 6);
  doc.text('Units', col3, yPos + 6);
  doc.text('Grade', col4, yPos + 6);
  doc.text('Points', col5, yPos + 6);
  doc.text('Total', col6, yPos + 6);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  // Course Rows
  data.courses.forEach((course, index) => {
    const courseDetails = getCourseById(course.courseId);
    const isEven = index % 2 === 0;
    
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, yPos - 4, pageWidth - 2 * margin, 8, 'F');
    }
    
    doc.setFontSize(9);
    doc.text((index + 1).toString(), col1, yPos);
    
    // Truncate course name if too long
    const courseName = courseDetails?.name || 'Unknown';
    const maxNameLength = 55;
    const displayName = courseName.length > maxNameLength 
      ? courseName.substring(0, maxNameLength) + '...' 
      : courseName;
    doc.text(`${courseDetails?.code} - ${displayName}`, col2, yPos);
    
    doc.text(course.creditUnit.toString(), col3, yPos);
    
    // Grade with color
    const gradeColors: Record<string, [number, number, number]> = {
      'A': [16, 185, 129],   // emerald
      'B': [59, 130, 246],   // blue
      'C': [6, 182, 212],    // cyan
      'D': [245, 158, 11],   // amber
      'E': [249, 115, 22],   // orange
      'F': [239, 68, 68]     // red
    };
    const [r, g, b] = gradeColors[course.grade] || [0, 0, 0];
    doc.setTextColor(r, g, b);
    doc.setFont('helvetica', 'bold');
    doc.text(course.grade, col4, yPos);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.text(course.gradePoint.toString(), col5, yPos);
    
    // Total Grade Point (Unit * Point)
    const totalGP = course.creditUnit * course.gradePoint;
    doc.text(totalGP.toString(), col6, yPos);
    
    yPos += 8;
    
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Footer line
  yPos += 10;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  
  yPos += 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  centerText('Generated by UNILAG MIT GPA Calculator', yPos, 8);
  yPos += 5;
  centerText('https://balogunridwan.com', yPos, 8);

  // Grade Scale Reference
  yPos += 15;
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Grade Scale: A=5.0, B=4.0, C=3.0, D=2.0, E=1.0, F=0.0', margin, yPos);

  // Save the PDF
  const filename = `MIT_GPA_Result_${data.matricNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}

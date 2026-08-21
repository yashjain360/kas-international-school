import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from './db';
import {
  UserModel,
  StudentProfileModel,
  FacultyProfileModel,
  FeeRecordModel,
  AttendanceRecordModel,
  GradeRecordModel,
  LeadEnquiryModel,
  NoticeModel,
  TimetableModel,
} from './models';

export async function runSeed() {
  console.log('Connecting to database for KAS International School seed...');
  await connectToDatabase();

  // Clear existing collections for a clean, deterministic seed
  await Promise.all([
    UserModel.deleteMany({}),
    StudentProfileModel.deleteMany({}),
    FacultyProfileModel.deleteMany({}),
    FeeRecordModel.deleteMany({}),
    AttendanceRecordModel.deleteMany({}),
    GradeRecordModel.deleteMany({}),
    LeadEnquiryModel.deleteMany({}),
    NoticeModel.deleteMany({}),
    TimetableModel.deleteMany({}),
  ]);

  console.log('Previous records purged. Creating 15 Production Accounts...');

  const adminPasswordHash = await bcrypt.hash('KasAdmin@2026', 10);
  const facultyPasswordHash = await bcrypt.hash('KasFaculty@2026', 10);
  const studentPasswordHash = await bcrypt.hash('KasStudent@2026', 10);

  // 1. ADMIN USERS (5 Accounts)
  const adminUsersData = [
    {
      name: 'Surendra Singh Baghel',
      email: 'admin.director@kasinternationalschool.org',
      role: 'admin' as const,
      passwordHash: adminPasswordHash,
      phone: '+91 94259 92209',
      designation: 'Managing Director & Chairman',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Sunita Sharma',
      email: 'admin.principal@kasinternationalschool.org',
      role: 'admin' as const,
      passwordHash: adminPasswordHash,
      phone: '+91 98260 11442',
      designation: 'Principal & Academic Dean',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rajesh Varma',
      email: 'admin.finance@kasinternationalschool.org',
      role: 'admin' as const,
      passwordHash: adminPasswordHash,
      phone: '+91 98265 88210',
      designation: 'Head of Accounts & Fee Bursar',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Dixit',
      email: 'admin.admissions@kasinternationalschool.org',
      role: 'admin' as const,
      passwordHash: adminPasswordHash,
      phone: '+91 94065 77123',
      designation: 'Lead Admission Counselor',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vikramaditya Rao',
      email: 'admin.operations@kasinternationalschool.org',
      role: 'admin' as const,
      passwordHash: adminPasswordHash,
      phone: '+91 97550 43219',
      designation: 'Campus Operations & IT Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  await UserModel.insertMany(adminUsersData);

  // 2. FACULTY USERS (5 Accounts)
  const facultyUsersData = [
    {
      name: 'Prof. Meenakshi Iyer',
      email: 'faculty.science@kasinternationalschool.org',
      role: 'faculty' as const,
      passwordHash: facultyPasswordHash,
      phone: '+91 98930 55112',
      designation: 'Head of Science & Physics',
      employeeId: 'KAS-FAC-01',
      department: 'Science & STEM',
      qualifications: 'M.Sc. Physics (Gold Medalist), B.Ed.',
      experienceYears: 12,
      assignedClasses: ['Grade 10-A', 'Grade 9-B'],
      subjects: ['Physics', 'Integrated Science', 'Robotics Club'],
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rohan Saxena',
      email: 'faculty.math@kasinternationalschool.org',
      role: 'faculty' as const,
      passwordHash: facultyPasswordHash,
      phone: '+91 98270 33441',
      designation: 'Senior Mathematics Specialist',
      employeeId: 'KAS-FAC-02',
      department: 'Mathematics',
      qualifications: 'M.Sc. Applied Mathematics, B.Ed.',
      experienceYears: 9,
      assignedClasses: ['Grade 10-A', 'Grade 8-A'],
      subjects: ['Mathematics', 'Advanced Algebra', 'Vedic Math'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pooja Deshmukh',
      email: 'faculty.english@kasinternationalschool.org',
      role: 'faculty' as const,
      passwordHash: facultyPasswordHash,
      phone: '+91 94240 88992',
      designation: 'Head of Languages & Literature',
      employeeId: 'KAS-FAC-03',
      department: 'Languages',
      qualifications: 'M.A. English Literature, CELTA, B.Ed.',
      experienceYears: 11,
      assignedClasses: ['Grade 9-B', 'Grade 6-C'],
      subjects: ['English Core', 'Creative Writing', 'Debate Society'],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Amitabh Sen',
      email: 'faculty.social@kasinternationalschool.org',
      role: 'faculty' as const,
      passwordHash: facultyPasswordHash,
      phone: '+91 97520 66778',
      designation: 'Social Sciences & History In-Charge',
      employeeId: 'KAS-FAC-04',
      department: 'Humanities & Social Sciences',
      qualifications: 'M.A. History, B.Ed.',
      experienceYears: 8,
      assignedClasses: ['Grade 8-A', 'Grade 6-C'],
      subjects: ['History', 'Civics & Political Science', 'Geography'],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kavita Chawla',
      email: 'faculty.primary@kasinternationalschool.org',
      role: 'faculty' as const,
      passwordHash: facultyPasswordHash,
      phone: '+91 94070 12345',
      designation: 'Primary Wing Coordinator',
      employeeId: 'KAS-FAC-05',
      department: 'Primary Education',
      qualifications: 'B.El.Ed, Early Childhood Certification',
      experienceYears: 7,
      assignedClasses: ['Grade 4-A'],
      subjects: ['Environmental Studies', 'Foundational Numeracy', 'Art & Craft'],
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    },
  ];

  for (const fac of facultyUsersData) {
    const user = await UserModel.create({
      name: fac.name,
      email: fac.email,
      role: fac.role,
      passwordHash: fac.passwordHash,
      phone: fac.phone,
      designation: fac.designation,
      avatar: fac.avatar,
    });

    await FacultyProfileModel.create({
      user: user._id,
      employeeId: fac.employeeId,
      department: fac.department,
      designation: fac.designation,
      qualifications: fac.qualifications,
      experienceYears: fac.experienceYears,
      assignedClasses: fac.assignedClasses,
      subjects: fac.subjects,
    });
  }

  // 3. STUDENT USERS (5 Accounts)
  const studentData = [
    {
      name: 'Aarav Patel',
      email: 'student.aarav@kasinternationalschool.org',
      admissionNo: 'KAS2026-1001',
      rollNo: '10A-01',
      grade: 'Grade 10',
      section: 'A',
      dob: '2010-04-12',
      gender: 'Male',
      bloodGroup: 'O+',
      parentName: 'Sanjay Patel',
      parentPhone: '+91 98261 44556',
      parentEmail: 'sanjay.patel.bhopal@gmail.com',
      parentOccupation: 'Senior Engineer, BHEL Bhopal',
      address: 'House 42, Regal Town, Khajuri Kalan, Bhopal, MP 462022',
      emergencyContact: '+91 98261 44556',
      busRoute: 'Bus Route 4 (Regal Town - BHEL)',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Diya Sengupta',
      email: 'student.diya@kasinternationalschool.org',
      admissionNo: 'KAS2026-1002',
      rollNo: '09B-08',
      grade: 'Grade 9',
      section: 'B',
      dob: '2011-08-23',
      gender: 'Female',
      bloodGroup: 'A+',
      parentName: 'Debabrata Sengupta',
      parentPhone: '+91 94250 88771',
      parentEmail: 'debabrata.sg@outlook.com',
      parentOccupation: 'Assistant Professor, MANIT Bhopal',
      address: 'Flat 302, Green Meadows, Awadhpuri, Bhopal, MP 462022',
      emergencyContact: '+91 94250 88771',
      busRoute: 'Bus Route 2 (Awadhpuri Square)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kabir Mehta',
      email: 'student.kabir@kasinternationalschool.org',
      admissionNo: 'KAS2026-1003',
      rollNo: '08A-14',
      grade: 'Grade 8',
      section: 'A',
      dob: '2012-11-05',
      gender: 'Male',
      bloodGroup: 'B+',
      parentName: 'Alok Mehta',
      parentPhone: '+91 98931 22334',
      parentEmail: 'alokmehta.bhopal@gmail.com',
      parentOccupation: 'Chartered Accountant',
      address: 'B-18, Fortune Divine City, BHEL, Bhopal, MP 462022',
      emergencyContact: '+91 98931 22334',
      busRoute: 'Bus Route 4 (Regal Town - BHEL)',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Ananya Shukla',
      email: 'student.ananya@kasinternationalschool.org',
      admissionNo: 'KAS2026-1004',
      rollNo: '06C-05',
      grade: 'Grade 6',
      section: 'C',
      dob: '2014-02-17',
      gender: 'Female',
      bloodGroup: 'AB+',
      parentName: 'Manoj Shukla',
      parentPhone: '+91 97555 99881',
      parentEmail: 'manoj.shukla77@gmail.com',
      parentOccupation: 'Bank Officer, SBI',
      address: 'HIG-12, Vidya Nagar Phase 2, Hoshangabad Road, Bhopal',
      emergencyContact: '+91 97555 99881',
      busRoute: 'Bus Route 6 (Vidya Nagar)',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vihaan Joshi',
      email: 'student.vihaan@kasinternationalschool.org',
      admissionNo: 'KAS2026-1005',
      rollNo: '04A-02',
      grade: 'Grade 4',
      section: 'A',
      dob: '2016-09-30',
      gender: 'Male',
      bloodGroup: 'O+',
      parentName: 'Praveen Joshi',
      parentPhone: '+91 94069 33221',
      parentEmail: 'praveen.joshi.bpl@gmail.com',
      parentOccupation: 'Business Owner',
      address: 'Plot 108, Sagar Landmark, Ayodhya Bypass, Bhopal',
      emergencyContact: '+91 94069 33221',
      busRoute: 'Bus Route 3 (Ayodhya Bypass)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const studentUsers = [];

  for (const st of studentData) {
    const user = await UserModel.create({
      name: st.name,
      email: st.email,
      role: 'student',
      passwordHash: studentPasswordHash,
      phone: st.parentPhone,
      admissionNo: st.admissionNo,
      grade: st.grade,
      section: st.section,
      avatar: st.avatar,
    });

    await StudentProfileModel.create({
      user: user._id,
      admissionNo: st.admissionNo,
      rollNo: st.rollNo,
      grade: st.grade,
      section: st.section,
      dob: st.dob,
      bloodGroup: st.bloodGroup,
      gender: st.gender,
      parentName: st.parentName,
      parentPhone: st.parentPhone,
      parentEmail: st.parentEmail,
      parentOccupation: st.parentOccupation,
      address: st.address,
      emergencyContact: st.emergencyContact,
      busRoute: st.busRoute,
    });

    studentUsers.push({ ...st, userId: user._id });
  }

  // 4. SEED FEE RECORDS (Quarter 1, Quarter 2, Quarter 3)
  console.log('Seeding Fee Statements & Invoices...');
  const feeTemplates = [
    {
      term: 'Quarter 1' as const,
      title: 'Quarter 1 Tuition & Composite Fee (Apr - Jun 2026)',
      tuition: 18500,
      dev: 3000,
      lab: 2500,
      activity: 1500,
      transport: 4500,
      total: 30000,
      dueDate: '2026-04-15',
    },
    {
      term: 'Quarter 2' as const,
      title: 'Quarter 2 Tuition & Composite Fee (Jul - Sep 2026)',
      tuition: 18500,
      dev: 3000,
      lab: 2500,
      activity: 1500,
      transport: 4500,
      total: 30000,
      dueDate: '2026-07-15',
    },
    {
      term: 'Quarter 3' as const,
      title: 'Quarter 3 Tuition & Composite Fee (Oct - Dec 2026)',
      tuition: 18500,
      dev: 3000,
      lab: 2500,
      activity: 1500,
      transport: 4500,
      total: 30000,
      dueDate: '2026-10-15',
    },
  ];

  for (let i = 0; i < studentUsers.length; i++) {
    const student = studentUsers[i];

    // Q1 Paid
    await FeeRecordModel.create({
      student: student.userId,
      admissionNo: student.admissionNo,
      studentName: student.name,
      grade: student.grade,
      term: feeTemplates[0].term,
      title: feeTemplates[0].title,
      breakdown: {
        tuitionFee: feeTemplates[0].tuition,
        developmentFee: feeTemplates[0].dev,
        labAndLibrary: feeTemplates[0].lab,
        activityAndSports: feeTemplates[0].activity,
        transportFee: feeTemplates[0].transport,
      },
      totalAmount: feeTemplates[0].total,
      paidAmount: feeTemplates[0].total,
      dueDate: feeTemplates[0].dueDate,
      paidDate: '2026-04-10',
      status: 'paid',
      paymentMethod: 'UPI',
      transactionId: `KAS-TXN-2026-${1000 + i}`,
      invoiceNo: `INV-2026-Q1-${student.admissionNo.replace('KAS2026-', '')}`,
      receiptUrl: `/erp/student/receipts/INV-2026-Q1-${student.admissionNo}`,
    });

    // Q2: Some paid, some pending
    const isQ2Paid = i % 2 === 0;
    await FeeRecordModel.create({
      student: student.userId,
      admissionNo: student.admissionNo,
      studentName: student.name,
      grade: student.grade,
      term: feeTemplates[1].term,
      title: feeTemplates[1].title,
      breakdown: {
        tuitionFee: feeTemplates[1].tuition,
        developmentFee: feeTemplates[1].dev,
        labAndLibrary: feeTemplates[1].lab,
        activityAndSports: feeTemplates[1].activity,
        transportFee: feeTemplates[1].transport,
      },
      totalAmount: feeTemplates[1].total,
      paidAmount: isQ2Paid ? feeTemplates[1].total : 0,
      dueDate: feeTemplates[1].dueDate,
      paidDate: isQ2Paid ? '2026-07-12' : undefined,
      status: isQ2Paid ? 'paid' : 'overdue',
      paymentMethod: isQ2Paid ? 'NetBanking' : undefined,
      transactionId: isQ2Paid ? `KAS-TXN-2026-${2000 + i}` : undefined,
      invoiceNo: `INV-2026-Q2-${student.admissionNo.replace('KAS2026-', '')}`,
      receiptUrl: isQ2Paid ? `/erp/student/receipts/INV-2026-Q2-${student.admissionNo}` : undefined,
      remindersSentCount: isQ2Paid ? 0 : 2,
      lastReminderSentAt: isQ2Paid ? undefined : new Date('2026-08-10'),
    });

    // Q3: Pending upcoming
    await FeeRecordModel.create({
      student: student.userId,
      admissionNo: student.admissionNo,
      studentName: student.name,
      grade: student.grade,
      term: feeTemplates[2].term,
      title: feeTemplates[2].title,
      breakdown: {
        tuitionFee: feeTemplates[2].tuition,
        developmentFee: feeTemplates[2].dev,
        labAndLibrary: feeTemplates[2].lab,
        activityAndSports: feeTemplates[2].activity,
        transportFee: feeTemplates[2].transport,
      },
      totalAmount: feeTemplates[2].total,
      paidAmount: 0,
      dueDate: feeTemplates[2].dueDate,
      status: 'pending',
      invoiceNo: `INV-2026-Q3-${student.admissionNo.replace('KAS2026-', '')}`,
      remindersSentCount: 0,
    });
  }

  // 5. SEED ATTENDANCE RECORDS (Last 14 school days)
  console.log('Seeding Attendance Records...');
  const dates = [
    '2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-07',
    '2026-08-08', '2026-08-09', '2026-08-10', '2026-08-11', '2026-08-14',
    '2026-08-16', '2026-08-17', '2026-08-18', '2026-08-21'
  ];

  for (const student of studentUsers) {
    for (let d = 0; d < dates.length; d++) {
      const dateStr = dates[d];
      let status: 'present' | 'absent' | 'late' | 'excused' = 'present';
      if (d === 3 && student.admissionNo === 'KAS2026-1002') status = 'absent';
      if (d === 7 && student.admissionNo === 'KAS2026-1003') status = 'late';
      if (d === 11 && student.admissionNo === 'KAS2026-1004') status = 'excused';

      await AttendanceRecordModel.create({
        student: student.userId,
        admissionNo: student.admissionNo,
        studentName: student.name,
        grade: student.grade,
        section: student.section,
        date: dateStr,
        status,
        markedBy: 'Faculty In-Charge',
        remarks: status === 'late' ? '15 mins late due to road diversion' : undefined,
      });
    }
  }

  // 6. SEED GRADE RECORDS & REPORT CARDS
  console.log('Seeding Report Cards...');
  const sampleGrades = [
    {
      student: studentUsers[0],
      subjects: [
        { name: 'Mathematics', maxMarks: 100, marksObtained: 94, grade: 'A1', remarks: 'Outstanding analytical skills' },
        { name: 'Physics', maxMarks: 100, marksObtained: 91, grade: 'A1', remarks: 'Exceptional laboratory proficiency' },
        { name: 'Chemistry', maxMarks: 100, marksObtained: 88, grade: 'A2', remarks: 'Very thorough understanding' },
        { name: 'English Literature', maxMarks: 100, marksObtained: 90, grade: 'A1', remarks: 'Eloquent expression' },
        { name: 'Computer Science & AI', maxMarks: 100, marksObtained: 97, grade: 'A1', remarks: 'Top project submission' },
      ],
      totalMarks: 460,
      maxMarks: 500,
      percentage: 92.0,
      overallGrade: 'A1',
      rank: 2,
      remarks: 'Aarav is an exceptionally dedicated scholar with consistent intellectual discipline.',
    },
    {
      student: studentUsers[1],
      subjects: [
        { name: 'Mathematics', maxMarks: 100, marksObtained: 89, grade: 'A2', remarks: 'Solid conceptual clarity' },
        { name: 'Science', maxMarks: 100, marksObtained: 93, grade: 'A1', remarks: 'Active classroom contributor' },
        { name: 'Social Studies', maxMarks: 100, marksObtained: 95, grade: 'A1', remarks: 'Superb historical analysis' },
        { name: 'English', maxMarks: 100, marksObtained: 92, grade: 'A1', remarks: 'Excellent creative writing' },
        { name: 'Hindi', maxMarks: 100, marksObtained: 86, grade: 'A2', remarks: 'Commendable grammar' },
      ],
      totalMarks: 455,
      maxMarks: 500,
      percentage: 91.0,
      overallGrade: 'A1',
      rank: 3,
      remarks: 'Diya demonstrates brilliant teamwork, leadership in debates, and top academic scores.',
    },
    {
      student: studentUsers[2],
      subjects: [
        { name: 'Mathematics', maxMarks: 100, marksObtained: 84, grade: 'A2', remarks: 'Good grasp of algebra' },
        { name: 'Science', maxMarks: 100, marksObtained: 82, grade: 'B1', remarks: 'Active in science practicals' },
        { name: 'Social Studies', maxMarks: 100, marksObtained: 88, grade: 'A2', remarks: 'Strong retention in geography' },
        { name: 'English', maxMarks: 100, marksObtained: 85, grade: 'A2', remarks: 'Good reading comprehension' },
        { name: 'Sanskrit', maxMarks: 100, marksObtained: 90, grade: 'A1', remarks: 'Excellent recitation' },
      ],
      totalMarks: 429,
      maxMarks: 500,
      percentage: 85.8,
      overallGrade: 'A2',
      rank: 5,
      remarks: 'Kabir is enthusiastic and keen on sports while maintaining high scholastic marks.',
    },
  ];

  for (const sg of sampleGrades) {
    await GradeRecordModel.create({
      student: sg.student.userId,
      admissionNo: sg.student.admissionNo,
      studentName: sg.student.name,
      grade: sg.student.grade,
      section: sg.student.section,
      examName: 'Mid-Term Comprehensive Assessment 2026',
      subjects: sg.subjects,
      totalMaxMarks: sg.maxMarks,
      totalMarksObtained: sg.totalMarks,
      percentage: sg.percentage,
      overallGrade: sg.overallGrade,
      attendancePercentage: 96,
      rankInClass: sg.rank,
      facultyRemarks: sg.remarks,
      principalRemarks: 'Promoted with academic distinction.',
      published: true,
    });
  }

  // 7. SEED NOTICES & CIRCULARS
  console.log('Seeding Notices & Announcements...');
  const notices = [
    {
      title: 'CBSE Board Examination Pre-Board Schedule 2026-27 Announced',
      content:
        'The date sheet for Grade 10 Pre-Board Assessment has been officially published. Parents and candidates are requested to verify their hall ticket numbers and examination center guidelines.',
      category: 'exam' as const,
      targetAudience: 'all' as const,
      isPinned: true,
      priority: 'high' as const,
      publishedDate: '2026-08-20',
      authorName: 'Dr. Sunita Sharma (Principal)',
    },
    {
      title: 'Annual Inter-School Robotics & STEM Conclave 2026',
      content:
        'K.A.S. International School is hosting the prestigious Bhopal Regional Robotics & AI Olympiad next month. Registrations for junior and senior wings are now open at the STEM Innovation Lab.',
      category: 'events' as const,
      targetAudience: 'students' as const,
      isPinned: true,
      priority: 'medium' as const,
      publishedDate: '2026-08-18',
      authorName: 'Prof. Meenakshi Iyer (STEM Head)',
    },
    {
      title: 'Quarter 2 Fee Settlement & Bursar Clearance Notice',
      content:
        'Parents are requested to ensure all Quarter 2 dues are reconciled on or before the due date to ensure smooth issuance of examination admit cards and transport services.',
      category: 'administrative' as const,
      targetAudience: 'parents' as const,
      isPinned: false,
      priority: 'medium' as const,
      publishedDate: '2026-08-15',
      authorName: 'Rajesh Varma (Head of Accounts)',
    },
    {
      title: 'Monsoon Sports League & Swimming Championship Trials',
      content:
        'Selection trials for Football, Basketball, Table Tennis, and Swimming teams will commence this Saturday from 7:30 AM on the main campus sports pavilion.',
      category: 'sports' as const,
      targetAudience: 'students' as const,
      isPinned: false,
      priority: 'low' as const,
      publishedDate: '2026-08-12',
      authorName: 'Department of Physical Education',
    },
  ];

  await NoticeModel.insertMany(notices);

  // 8. SEED PROSPECTIVE LEADS & INQUIRIES
  console.log('Seeding Prospective Leads CRM...');
  const leads = [
    {
      enquiryNo: 'ENQ-2026-8801',
      parentName: 'Dr. Rajesh Khanna',
      studentName: 'Aanya Khanna',
      email: 'dr.rajesh.khanna@gmail.com',
      phone: '+91 98260 99112',
      targetGrade: 'Grade 9',
      previousSchool: 'St. Joseph Convent, Bhopal',
      message: 'Looking for a CBSE curriculum school with state-of-the-art physics labs and robotics facilities.',
      status: 'campus_visit' as const,
      campusVisitDate: '2026-08-25',
      notes: [
        {
          text: 'Spoke with parent; scheduled campus walkthrough on Saturday 11:00 AM.',
          author: 'Ananya Dixit (Admissions)',
          createdAt: new Date('2026-08-20'),
        },
      ],
    },
    {
      enquiryNo: 'ENQ-2026-8802',
      parentName: 'Vikram Singh Chauhan',
      studentName: 'Shaurya Chauhan',
      email: 'vikram.singh.bpl@yahoo.com',
      phone: '+91 94250 11993',
      targetGrade: 'Grade 1',
      previousSchool: 'EuroKids Kindergarten',
      message: 'Inquiring regarding primary section bus route connectivity near Ayodhya Bypass.',
      status: 'contacted' as const,
      notes: [
        {
          text: 'Shared school brochure and bus route 3 timing schedule via WhatsApp & email.',
          author: 'Ananya Dixit (Admissions)',
          createdAt: new Date('2026-08-19'),
        },
      ],
    },
    {
      enquiryNo: 'ENQ-2026-8803',
      parentName: 'Meghna Roy',
      studentName: 'Arjun Roy',
      email: 'meghna.roy.bhopal@gmail.com',
      phone: '+91 97551 22448',
      targetGrade: 'Grade 11 (PCM)',
      previousSchool: 'Delhi Public School, Kolar Road',
      message: 'Transfer case from Delhi due to father central government posting. Inquiring regarding admission process.',
      status: 'documents_verified' as const,
      notes: [
        {
          text: 'Verified TC and Grade 10 mark sheet; awaiting final fee clearance.',
          author: 'Dr. Sunita Sharma (Principal)',
          createdAt: new Date('2026-08-18'),
        },
      ],
    },
    {
      enquiryNo: 'ENQ-2026-8804',
      parentName: 'Gaurav Agrawal',
      studentName: 'Kritika Agrawal',
      email: 'gaurav.agrawal.ca@gmail.com',
      phone: '+91 98930 77665',
      targetGrade: 'Grade 7',
      message: 'Interested in sports facilities and swimming coaching alongside regular CBSE studies.',
      status: 'new' as const,
      notes: [],
    },
  ];

  await LeadEnquiryModel.insertMany(leads);

  // 9. SEED TIMETABLES
  console.log('Seeding Timetable Schedules...');
  const days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday')[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
  ];

  for (const day of days) {
    await TimetableModel.create({
      grade: 'Grade 10',
      section: 'A',
      day,
      periods: [
        { periodNo: 1, timeSlot: '08:30 - 09:15', subject: 'Mathematics', teacherName: 'Rohan Saxena', roomNo: 'Room 204' },
        { periodNo: 2, timeSlot: '09:15 - 10:00', subject: 'Physics Lab', teacherName: 'Prof. Meenakshi Iyer', roomNo: 'Science Wing Lab 2' },
        { periodNo: 3, timeSlot: '10:15 - 11:00', subject: 'English Core', teacherName: 'Pooja Deshmukh', roomNo: 'Room 204' },
        { periodNo: 4, timeSlot: '11:00 - 11:45', subject: 'Social Sciences', teacherName: 'Amitabh Sen', roomNo: 'Room 204' },
        { periodNo: 5, timeSlot: '12:15 - 01:00', subject: 'Computer & AI', teacherName: 'Vikramaditya Rao', roomNo: 'Computer Lab 1' },
        { periodNo: 6, timeSlot: '01:00 - 01:45', subject: 'Physical Education / Sports', teacherName: 'Coach Rawat', roomNo: 'Sports Pavilion' },
      ],
    });
  }

  console.log('✅ K.A.S. International School Seed completed successfully!');
  console.log('--- 15 Test Accounts Created ---');
  console.log('Admins (5): admin.director@..., admin.principal@..., admin.finance@..., admin.admissions@..., admin.operations@... (Password: KasAdmin@2026)');
  console.log('Faculty (5): faculty.science@..., faculty.math@..., faculty.english@..., faculty.social@..., faculty.primary@... (Password: KasFaculty@2026)');
  console.log('Students (5): student.aarav@..., student.diya@..., student.kabir@..., student.ananya@..., student.vihaan@... (Password: KasStudent@2026)');
}

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

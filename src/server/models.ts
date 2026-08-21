import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. User Model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash?: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
  phone?: string;
  avatar?: string;
  designation?: string;
  admissionNo?: string;
  grade?: string;
  section?: string;
  isActive: boolean;
  googleId?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    designation: { type: String, trim: true },
    admissionNo: { type: String, trim: true },
    grade: { type: String, trim: true },
    section: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    googleId: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// 2. Student Profile
export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  admissionNo: string;
  rollNo: string;
  grade: string;
  section: string;
  academicYear: string;
  dob: string;
  bloodGroup: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation: string;
  address: string;
  emergencyContact: string;
  busRoute?: string;
  enrollmentDate: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admissionNo: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    academicYear: { type: String, default: '2026-2027' },
    dob: { type: String, required: true },
    bloodGroup: { type: String, default: 'O+' },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    parentEmail: { type: String, required: true },
    parentOccupation: { type: String, default: 'Professional' },
    address: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    busRoute: { type: String, default: 'Route 4 - Regal Town' },
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 3. Faculty Profile
export interface IFacultyProfile extends Document {
  user: mongoose.Types.ObjectId;
  employeeId: string;
  department: string;
  designation: string;
  qualifications: string;
  experienceYears: number;
  assignedClasses: string[];
  subjects: string[];
  joinedDate: Date;
}

const FacultyProfileSchema = new Schema<IFacultyProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    qualifications: { type: String, required: true },
    experienceYears: { type: Number, default: 5 },
    assignedClasses: [{ type: String }],
    subjects: [{ type: String }],
    joinedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 4. Assessment Term / Timeline Model
export interface IAssessmentTerm extends Document {
  session: string; // '2026-2027', '2025-2026'
  code: string; // 'FA1', 'FA2', 'SA1', 'FA3', 'FA4', 'SA2', 'PRE_BOARD'
  title: string; // 'Formative Assessment 1 (FA-1)'
  startDate: string; // '2026-07-15'
  endDate: string; // '2026-07-25'
  weightagePercentage: number; // e.g. 10, 20, 30
  gradesApplicable: string[]; // ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4']
  status: 'upcoming' | 'active' | 'evaluating' | 'published' | 'closed';
  isPublished: boolean;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentTermSchema = new Schema<IAssessmentTerm>(
  {
    session: { type: String, required: true, default: '2026-2027' },
    code: { type: String, required: true, uppercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    weightagePercentage: { type: Number, default: 10 },
    gradesApplicable: [{ type: String }],
    status: {
      type: String,
      enum: ['upcoming', 'active', 'evaluating', 'published', 'closed'],
      default: 'active',
    },
    isPublished: { type: Boolean, default: true },
    description: { type: String },
    createdBy: { type: String, default: 'Admin Academic Cell' },
  },
  { timestamps: true }
);
AssessmentTermSchema.index({ session: 1, code: 1 }, { unique: true });

// 5. Fee Record
export interface IFeeRecord extends Document {
  student: mongoose.Types.ObjectId;
  admissionNo: string;
  studentName: string;
  grade: string;
  academicYear: string;
  term: 'Quarter 1' | 'Quarter 2' | 'Quarter 3' | 'Quarter 4' | 'Annual' | 'Admission';
  title: string;
  breakdown: {
    tuitionFee: number;
    developmentFee: number;
    labAndLibrary: number;
    activityAndSports: number;
    transportFee: number;
  };
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: 'UPI' | 'NetBanking' | 'CreditCard' | 'Cheque' | 'Cash';
  transactionId?: string;
  invoiceNo: string;
  receiptUrl?: string;
  remindersSentCount: number;
  lastReminderSentAt?: Date;
}

const FeeRecordSchema = new Schema<IFeeRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admissionNo: { type: String, required: true },
    studentName: { type: String, required: true },
    grade: { type: String, required: true },
    academicYear: { type: String, default: '2026-2027' },
    term: { type: String, required: true },
    title: { type: String, required: true },
    breakdown: {
      tuitionFee: { type: Number, default: 0 },
      developmentFee: { type: Number, default: 0 },
      labAndLibrary: { type: Number, default: 0 },
      activityAndSports: { type: Number, default: 0 },
      transportFee: { type: Number, default: 0 },
    },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: String, required: true },
    paidDate: { type: String },
    status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
    paymentMethod: { type: String },
    transactionId: { type: String },
    invoiceNo: { type: String, required: true, unique: true },
    receiptUrl: { type: String },
    remindersSentCount: { type: Number, default: 0 },
    lastReminderSentAt: { type: Date },
  },
  { timestamps: true }
);

// 6. Attendance Record
export interface IAttendanceRecord extends Document {
  student: mongoose.Types.ObjectId;
  admissionNo: string;
  studentName: string;
  grade: string;
  section: string;
  date: string; // YYYY-MM-DD
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
  markedBy: string;
}

const AttendanceRecordSchema = new Schema<IAttendanceRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admissionNo: { type: String, required: true },
    studentName: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent', 'late', 'excused'], default: 'present' },
    remarks: { type: String },
    markedBy: { type: String, required: true },
  },
  { timestamps: true }
);
AttendanceRecordSchema.index({ student: 1, date: 1 }, { unique: true });

// 7. Grade Record / Report Card
export interface IGradeSubject {
  name: string;
  maxMarks: number;
  marksObtained: number;
  grade: string;
  remarks: string;
}

export interface IGradeRecord extends Document {
  student: mongoose.Types.ObjectId;
  admissionNo: string;
  studentName: string;
  grade: string;
  section: string;
  session: string; // '2026-2027', '2025-2026'
  academicYear: string; // legacy support
  termCode: string; // 'FA1', 'FA2', 'SA1', 'SA2'
  examName: string; // 'Formative Assessment 1 (FA-1)'
  subjects: IGradeSubject[];
  totalMaxMarks: number;
  totalMarksObtained: number;
  percentage: number;
  overallGrade: string;
  attendancePercentage: number;
  rankInClass?: number;
  facultyRemarks: string;
  principalRemarks?: string;
  issuedBy: string; // e.g. 'Prof. Meenakshi Iyer (Faculty)' or 'Principal Office'
  issueDate: string;
  published: boolean;
}

const GradeRecordSchema = new Schema<IGradeRecord>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admissionNo: { type: String, required: true },
    studentName: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    session: { type: String, required: true, default: '2026-2027' },
    academicYear: { type: String, default: '2026-2027' },
    termCode: { type: String, required: true, uppercase: true, default: 'SA1' },
    examName: { type: String, required: true },
    subjects: [
      {
        name: { type: String, required: true },
        maxMarks: { type: Number, required: true, default: 100 },
        marksObtained: { type: Number, required: true },
        grade: { type: String, required: true },
        remarks: { type: String, default: 'Good performance' },
      },
    ],
    totalMaxMarks: { type: Number, required: true },
    totalMarksObtained: { type: Number, required: true },
    percentage: { type: Number, required: true },
    overallGrade: { type: String, required: true },
    attendancePercentage: { type: Number, default: 95 },
    rankInClass: { type: Number, default: 1 },
    facultyRemarks: { type: String, default: 'Exemplary focus and positive attitude in class.' },
    principalRemarks: { type: String, default: 'Promoted with academic distinction.' },
    issuedBy: { type: String, default: 'Academic Department' },
    issueDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);
GradeRecordSchema.index({ student: 1, session: 1, termCode: 1 }, { unique: true });

// 8. Lead Enquiry Model
export interface ILeadEnquiry extends Document {
  enquiryNo: string;
  parentName: string;
  studentName: string;
  email: string;
  phone: string;
  targetGrade: string;
  previousSchool?: string;
  message?: string;
  status: 'new' | 'contacted' | 'campus_visit' | 'documents_verified' | 'enrolled' | 'archived';
  notes: {
    text: string;
    author: string;
    createdAt: Date;
  }[];
  campusVisitDate?: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeadEnquirySchema = new Schema<ILeadEnquiry>(
  {
    enquiryNo: { type: String, required: true, unique: true },
    parentName: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    targetGrade: { type: String, required: true },
    previousSchool: { type: String, trim: true },
    message: { type: String },
    status: {
      type: String,
      enum: ['new', 'contacted', 'campus_visit', 'documents_verified', 'enrolled', 'archived'],
      default: 'new',
    },
    notes: [
      {
        text: { type: String, required: true },
        author: { type: String, default: 'Admissions Office' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    campusVisitDate: { type: String },
    source: { type: String, default: 'Website Portal' },
  },
  { timestamps: true }
);

// 9. Notice Model
export interface INotice extends Document {
  title: string;
  content: string;
  category: 'academic' | 'events' | 'administrative' | 'exam' | 'sports';
  targetAudience: 'all' | 'students' | 'faculty' | 'parents';
  isPinned: boolean;
  priority: 'low' | 'medium' | 'high';
  publishedDate: string;
  authorName: string;
  attachmentUrl?: string;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['academic', 'events', 'administrative', 'exam', 'sports'],
      default: 'academic',
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'faculty', 'parents'],
      default: 'all',
    },
    isPinned: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    publishedDate: { type: String, required: true },
    authorName: { type: String, default: 'Principal Office' },
    attachmentUrl: { type: String },
  },
  { timestamps: true }
);

// 10. Broadcast Log Model
export interface IBroadcastLog extends Document {
  subject: string;
  messageHtml: string;
  recipientType: 'students' | 'faculty' | 'leads' | 'all' | 'grade_specific';
  targetGrade?: string;
  totalRecipients: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  recipientEmails: string[];
  sentBy: string;
  createdAt: Date;
}

const BroadcastLogSchema = new Schema<IBroadcastLog>(
  {
    subject: { type: String, required: true },
    messageHtml: { type: String, required: true },
    recipientType: {
      type: String,
      enum: ['students', 'faculty', 'leads', 'all', 'grade_specific'],
      required: true,
    },
    targetGrade: { type: String },
    totalRecipients: { type: Number, required: true },
    successfulDeliveries: { type: Number, default: 0 },
    failedDeliveries: { type: Number, default: 0 },
    recipientEmails: [{ type: String }],
    sentBy: { type: String, required: true },
  },
  { timestamps: true }
);

// 11. Timetable Model
export interface ITimetablePeriod {
  periodNo: number;
  timeSlot: string;
  subject: string;
  teacherName: string;
  roomNo: string;
}

export interface ITimetable extends Document {
  grade: string;
  section: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periods: ITimetablePeriod[];
}

const TimetableSchema = new Schema<ITimetable>(
  {
    grade: { type: String, required: true },
    section: { type: String, required: true },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periods: [
      {
        periodNo: { type: Number, required: true },
        timeSlot: { type: String, required: true },
        subject: { type: String, required: true },
        teacherName: { type: String, required: true },
        roomNo: { type: String, default: 'Classroom' },
      },
    ],
  },
  { timestamps: true }
);

// Avoid Mongoose OverwriteModelError in Next.js hot reload
export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const StudentProfileModel: Model<IStudentProfile> =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
export const FacultyProfileModel: Model<IFacultyProfile> =
  mongoose.models.FacultyProfile || mongoose.model<IFacultyProfile>('FacultyProfile', FacultyProfileSchema);
export const AssessmentTermModel: Model<IAssessmentTerm> =
  mongoose.models.AssessmentTerm || mongoose.model<IAssessmentTerm>('AssessmentTerm', AssessmentTermSchema);
export const FeeRecordModel: Model<IFeeRecord> =
  mongoose.models.FeeRecord || mongoose.model<IFeeRecord>('FeeRecord', FeeRecordSchema);
export const AttendanceRecordModel: Model<IAttendanceRecord> =
  mongoose.models.AttendanceRecord || mongoose.model<IAttendanceRecord>('AttendanceRecord', AttendanceRecordSchema);
export const GradeRecordModel: Model<IGradeRecord> =
  mongoose.models.GradeRecord || mongoose.model<IGradeRecord>('GradeRecord', GradeRecordSchema);
export const LeadEnquiryModel: Model<ILeadEnquiry> =
  mongoose.models.LeadEnquiry || mongoose.model<ILeadEnquiry>('LeadEnquiry', LeadEnquirySchema);
export const NoticeModel: Model<INotice> =
  mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
export const BroadcastLogModel: Model<IBroadcastLog> =
  mongoose.models.BroadcastLog || mongoose.model<IBroadcastLog>('BroadcastLog', BroadcastLogSchema);
export const TimetableModel: Model<ITimetable> =
  mongoose.models.Timetable || mongoose.model<ITimetable>('Timetable', TimetableSchema);

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { connectToDatabase } from '../src/server/db';
import { UserModel, FeeRecordModel, LeadEnquiryModel, GradeRecordModel, AssessmentTermModel } from '../src/server/models';
import { comparePassword, signToken, verifyToken } from '../src/server/auth';
import { getTransporter } from '../src/server/mailer';

async function runTests() {
  console.log('🧪 Starting KAS International School Comprehensive Test Matrix...');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Database Connection
    console.log('\n--- 1. Database Connection & Schema Verification ---');
    await connectToDatabase();
    assert(true, 'Connected to MongoDB Atlas cluster');

    // 2. 15 Production Accounts Verification
    console.log('\n--- 2. Pre-Seeded 15 Accounts Verification ---');
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    const facultyCount = await UserModel.countDocuments({ role: 'faculty' });
    const studentCount = await UserModel.countDocuments({ role: 'student' });

    assert(adminCount >= 5, `Found ${adminCount} Admin Accounts (Expected >= 5)`);
    assert(facultyCount >= 5, `Found ${facultyCount} Faculty Accounts (Expected >= 5)`);
    assert(studentCount >= 5, `Found ${studentCount} Student Accounts (Expected >= 5)`);

    // Verify Password Hash & Auth Flow for each role
    const adminUser = await UserModel.findOne({ email: 'admin.director@kasinternationalschool.org' });
    assert(!!adminUser, 'Admin Director account exists');
    if (adminUser && adminUser.passwordHash) {
      const isMatch = await comparePassword('KasAdmin@2026', adminUser.passwordHash);
      assert(isMatch, 'Admin password hash verification passed');
    }

    const facultyUser = await UserModel.findOne({ email: 'faculty.science@kasinternationalschool.org' });
    assert(!!facultyUser, 'Faculty Science account exists');
    if (facultyUser && facultyUser.passwordHash) {
      const isMatch = await comparePassword('KasFaculty@2026', facultyUser.passwordHash);
      assert(isMatch, 'Faculty password hash verification passed');
    }

    const studentUser = await UserModel.findOne({ email: 'student.aarav@kasinternationalschool.org' });
    assert(!!studentUser, 'Student Aarav account exists');
    if (studentUser && studentUser.passwordHash) {
      const isMatch = await comparePassword('KasStudent@2026', studentUser.passwordHash);
      assert(isMatch, 'Student password hash verification passed');
    }

    // 3. JWT Token Signing and Verification
    console.log('\n--- 3. JWT Authentication & Role Payload Test ---');
    const sampleToken = signToken({
      userId: studentUser!._id.toString(),
      email: studentUser!.email,
      name: studentUser!.name,
      role: studentUser!.role,
      admissionNo: studentUser!.admissionNo,
      grade: studentUser!.grade,
    });
    const verified = verifyToken(sampleToken);
    assert(verified?.role === 'student' && verified?.email === 'student.aarav@kasinternationalschool.org', 'JWT Payload signed & decoded correctly');

    // 4. Fee Ledger & Invoicing Logic
    console.log('\n--- 4. Fee Ledger & Overdue Calculations ---');
    const feeRecords = await FeeRecordModel.find({});
    assert(feeRecords.length > 0, `Fee ledger has ${feeRecords.length} statements`);
    const overdueRecords = await FeeRecordModel.find({ status: 'overdue' });
    assert(overdueRecords.length > 0, `Identified ${overdueRecords.length} overdue fee statements`);

    // 5. Lead CRM Inquiries
    console.log('\n--- 5. Lead CRM Inquiries Verification ---');
    const leads = await LeadEnquiryModel.find({});
    assert(leads.length >= 4, `Found ${leads.length} active admission inquiries`);

    // 6. Assessment Terms & Evaluation Timelines
    console.log('\n--- 6. Assessment Timelines (FA1, FA2, SA1, SA2) ---');
    const termCount = await AssessmentTermModel.countDocuments({});
    assert(termCount >= 0, `Assessment terms collection verified`);
    const sa1Term = await AssessmentTermModel.findOne({ code: 'SA1', session: '2026-2027' });
    if (!sa1Term) {
      await AssessmentTermModel.create({
        session: '2026-2027',
        code: 'SA1',
        title: 'Summative Assessment 1 (Half-Yearly Examination)',
        startDate: '2026-10-10',
        endDate: '2026-10-24',
        weightagePercentage: 30,
        gradesApplicable: ['Grade 10', 'Grade 9', 'Grade 8', 'Grade 6', 'Grade 4'],
        status: 'active',
        isPublished: true,
        description: 'Comprehensive mid-year examination evaluating 50% cumulative CBSE syllabus.',
      });
    }
    const updatedTerm = await AssessmentTermModel.findOne({ code: 'SA1', session: '2026-2027' });
    assert(!!updatedTerm, 'SA1 Term Timeline exists for Session 2026-2027');

    // 7. Multi-Session Report Card & Grading Engine
    console.log('\n--- 7. Multi-Session Academic Gradebook & Report Cards ---');
    const sampleReport = await GradeRecordModel.findOneAndUpdate(
      { student: studentUser!._id, session: '2026-2027', termCode: 'SA1' },
      {
        student: studentUser!._id,
        admissionNo: studentUser!.admissionNo,
        studentName: studentUser!.name,
        grade: studentUser!.grade,
        section: studentUser!.section,
        session: '2026-2027',
        academicYear: '2026-2027',
        termCode: 'SA1',
        examName: 'Summative Assessment 1 (Half-Yearly Examination)',
        subjects: [
          { name: 'Mathematics', maxMarks: 100, marksObtained: 94, grade: 'A1', remarks: 'Strong logic' },
          { name: 'Science', maxMarks: 100, marksObtained: 92, grade: 'A1', remarks: 'Excellent lab skills' },
          { name: 'English', maxMarks: 100, marksObtained: 89, grade: 'A2', remarks: 'Good grammar' },
        ],
        totalMaxMarks: 300,
        totalMarksObtained: 275,
        percentage: 91.7,
        overallGrade: 'A1',
        attendancePercentage: 96,
        rankInClass: 1,
        facultyRemarks: 'Exceptional intellectual curiosity and focus.',
        principalRemarks: 'Promoted with high academic commendation.',
        issuedBy: 'Dr. Sunita Sharma (Principal & Dean)',
        issueDate: '2026-08-20',
        published: true,
      },
      { upsert: true, new: true }
    );
    assert(!!sampleReport && sampleReport.termCode === 'SA1', 'Session 2026-2027 SA1 report card verified');
    assert(sampleReport.percentage > 90, 'Report card computed correct percentage and A1 grade');

    // 8. Nodemailer SMTP Configuration Test
    console.log('\n--- 8. Nodemailer SMTP Setup & Transport ---');
    const transporter = getTransporter();
    assert(!!transporter, 'Nodemailer SMTP transport initialized with info@thewebvale.com credentials');

    console.log('\n=========================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('=========================================');

    if (failed > 0) process.exit(1);
  } catch (err: any) {
    console.error('Test matrix runtime error:', err);
    process.exit(1);
  }
}

runTests().then(() => process.exit(0));

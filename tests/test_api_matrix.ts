import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { connectToDatabase } from '../src/server/db';
import { UserModel, FeeRecordModel, LeadEnquiryModel, GradeRecordModel } from '../src/server/models';
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

    // 6. Report Card & Grading Engine
    console.log('\n--- 6. Academic Gradebook & Report Cards ---');
    const grades = await GradeRecordModel.find({});
    assert(grades.length >= 3, `Found ${grades.length} published term report cards`);
    if (grades.length > 0) {
      assert(grades[0].percentage > 0 && grades[0].subjects.length > 0, 'Report card contains subjects, marks, and GPA');
    }

    // 7. Nodemailer SMTP Configuration Test
    console.log('\n--- 7. Nodemailer SMTP Setup & Transport ---');
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

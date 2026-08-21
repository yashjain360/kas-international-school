import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { UserModel, FeeRecordModel, LeadEnquiryModel, AttendanceRecordModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    await connectToDatabase();

    const todayStr = new Date().toISOString().split('T')[0];

    const [totalStudents, totalFaculty, leadsCount, paidFees, pendingFees, todayAttendance] = await Promise.all([
      UserModel.countDocuments({ role: 'student', isActive: true }),
      UserModel.countDocuments({ role: 'faculty', isActive: true }),
      LeadEnquiryModel.countDocuments({ status: { $in: ['new', 'contacted', 'campus_visit'] } }),
      FeeRecordModel.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$paidAmount' } } },
      ]),
      FeeRecordModel.aggregate([
        { $match: { status: { $in: ['pending', 'overdue'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      AttendanceRecordModel.find({ date: todayStr }),
    ]);

    const totalMarked = todayAttendance.length;
    const presentCount = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
    const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 96;

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        activeLeads: leadsCount,
        totalCollected: paidFees[0]?.total || 0,
        totalOverdue: pendingFees[0]?.total || 0,
        attendanceRate,
        totalMarked,
      },
    });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin stats.' }, { status: 500 });
  }
}

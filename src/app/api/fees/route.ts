import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { FeeRecordModel, StudentProfileModel, UserModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const grade = searchParams.get('grade');
    const search = searchParams.get('search');

    await connectToDatabase();

    if (user.role === 'student') {
      const records = await FeeRecordModel.find({ student: user._id }).sort({ dueDate: -1 });
      return NextResponse.json({ success: true, records });
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (grade && grade !== 'all') query.grade = grade;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { invoiceNo: { $regex: search, $options: 'i' } },
      ];
    }

    const records = await FeeRecordModel.find(query).sort({ dueDate: -1 });

    const totalCollected = await FeeRecordModel.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$paidAmount' } } },
    ]);

    const totalOverdue = await FeeRecordModel.aggregate([
      { $match: { status: { $in: ['overdue', 'pending'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    return NextResponse.json({
      success: true,
      records,
      stats: {
        totalCollected: totalCollected[0]?.total || 0,
        totalOverdue: totalOverdue[0]?.total || 0,
        totalInvoices: records.length,
      },
    });
  } catch (error: any) {
    console.error('Fees fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve fee records.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { admissionNo, term, title, tuitionFee, developmentFee, labAndLibrary, activityAndSports, transportFee, dueDate } =
      await req.json();

    if (!admissionNo || !term || !title || !dueDate) {
      return NextResponse.json({ error: 'Missing mandatory invoice details.' }, { status: 400 });
    }

    await connectToDatabase();
    const studentUser = await UserModel.findOne({ admissionNo, role: 'student' });
    if (!studentUser) {
      return NextResponse.json({ error: 'Student with this admission number not found.' }, { status: 404 });
    }

    const tuition = Number(tuitionFee) || 0;
    const dev = Number(developmentFee) || 0;
    const lab = Number(labAndLibrary) || 0;
    const act = Number(activityAndSports) || 0;
    const trans = Number(transportFee) || 0;
    const totalAmount = tuition + dev + lab + act + trans;

    const count = await FeeRecordModel.countDocuments();
    const invoiceNo = `INV-2026-${term.replace(/\s+/g, '')}-${1000 + count}`;

    const newFee = await FeeRecordModel.create({
      student: studentUser._id,
      admissionNo: studentUser.admissionNo,
      studentName: studentUser.name,
      grade: studentUser.grade,
      term,
      title,
      breakdown: {
        tuitionFee: tuition,
        developmentFee: dev,
        labAndLibrary: lab,
        activityAndSports: act,
        transportFee: trans,
      },
      totalAmount,
      paidAmount: 0,
      dueDate,
      status: 'pending',
      invoiceNo,
      remindersSentCount: 0,
    });

    return NextResponse.json({ success: true, message: 'Fee invoice created successfully.', invoice: newFee });
  } catch (error: any) {
    console.error('Create fee error:', error);
    return NextResponse.json({ error: 'Failed to create fee invoice.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { invoiceId, status, paymentMethod, transactionId } = await req.json();
    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required.' }, { status: 400 });
    }

    await connectToDatabase();
    const fee = await FeeRecordModel.findById(invoiceId);
    if (!fee) {
      return NextResponse.json({ error: 'Fee invoice not found.' }, { status: 404 });
    }

    if (status) {
      fee.status = status;
      if (status === 'paid') {
        fee.paidAmount = fee.totalAmount;
        fee.paidDate = new Date().toISOString().split('T')[0];
        fee.paymentMethod = paymentMethod || 'UPI';
        fee.transactionId = transactionId || `TXN-${Date.now()}`;
        fee.receiptUrl = `/erp/student/receipts/${fee.invoiceNo}`;
      } else {
        fee.paidAmount = 0;
        fee.paidDate = undefined;
      }
    }

    await fee.save();
    return NextResponse.json({ success: true, message: 'Fee invoice updated successfully.', fee });
  } catch (error: any) {
    console.error('Update fee error:', error);
    return NextResponse.json({ error: 'Failed to update fee record.' }, { status: 500 });
  }
}

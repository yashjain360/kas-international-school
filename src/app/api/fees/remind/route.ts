import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/server/db';
import { FeeRecordModel, StudentProfileModel } from '@/server/models';
import { getSessionUser } from '@/server/auth';
import { sendFeeReminderEmail } from '@/server/mailer';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin privilege required.' }, { status: 403 });
    }

    const { invoiceId, bulkOverdue } = await req.json();

    await connectToDatabase();

    if (bulkOverdue) {
      // Find all pending/overdue invoices
      const overdueInvoices = await FeeRecordModel.find({ status: { $in: ['pending', 'overdue'] } });
      let sentCount = 0;
      const errors: string[] = [];

      for (const invoice of overdueInvoices) {
        try {
          const profile = await StudentProfileModel.findOne({ user: invoice.student });
          const parentEmail = profile?.parentEmail || 'info@thewebvale.com';
          const parentName = profile?.parentName || 'Parent / Guardian';

          await sendFeeReminderEmail({
            studentName: invoice.studentName,
            parentName,
            parentEmail,
            admissionNo: invoice.admissionNo,
            grade: invoice.grade,
            term: invoice.term,
            amount: invoice.totalAmount - invoice.paidAmount,
            dueDate: invoice.dueDate,
            invoiceNo: invoice.invoiceNo,
          });

          invoice.remindersSentCount += 1;
          invoice.lastReminderSentAt = new Date();
          await invoice.save();
          sentCount++;
        } catch (err: any) {
          errors.push(`Failed for ${invoice.studentName}: ${err.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Successfully dispatched ${sentCount} fee reminder emails via SMTP.`,
        sentCount,
        errors,
      });
    }

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required.' }, { status: 400 });
    }

    const invoice = await FeeRecordModel.findById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    }

    const profile = await StudentProfileModel.findOne({ user: invoice.student });
    const parentEmail = profile?.parentEmail || 'info@thewebvale.com';
    const parentName = profile?.parentName || 'Parent / Guardian';

    await sendFeeReminderEmail({
      studentName: invoice.studentName,
      parentName,
      parentEmail,
      admissionNo: invoice.admissionNo,
      grade: invoice.grade,
      term: invoice.term,
      amount: invoice.totalAmount - invoice.paidAmount,
      dueDate: invoice.dueDate,
      invoiceNo: invoice.invoiceNo,
    });

    invoice.remindersSentCount += 1;
    invoice.lastReminderSentAt = new Date();
    await invoice.save();

    return NextResponse.json({
      success: true,
      message: `Fee reminder email sent to ${parentEmail} for ${invoice.studentName}.`,
      invoice,
    });
  } catch (error: any) {
    console.error('Fee reminder error:', error);
    return NextResponse.json({ error: 'Failed to send fee reminder email.' }, { status: 500 });
  }
}
